import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class PopularityService {
  private readonly logger = new Logger(PopularityService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) { }

  @Cron('0 0 2 * * 0,3', {
    timeZone: 'America/Mexico_City',
  })
  async updatePopularity() {
    this.logger.log('Cron job started: Updating popularity...');
    // Update Product Popularity
    await this.dataSource.query(`
      UPDATE products p
      SET popularity = sub.score
      FROM (
        SELECT
          oi."productId" AS product_id,
          (SUM(oi.quantity) * 0.7 + COUNT(DISTINCT o."user") * 0.3)::int AS score
        FROM order_items oi
        LEFT JOIN order_item_groups oig ON oig.id = oi.order_item_group_id
        JOIN orders o ON o.id = oig."orderId"
        GROUP BY oi."productId"
      ) sub
      WHERE p.id = sub.product_id
    `);
    // Update Product Option Popularity
    await this.dataSource.query(`
       UPDATE product_options po
       SET popularity = sub.score
       FROM (
         SELECT
           oio."productOptionId" AS product_option_id,
           COUNT(oio.id)::int AS score
         FROM order_item_options oio
         GROUP BY oio."productOptionId"
       ) sub
       WHERE po.id = sub.product_option_id
    `);
    this.logger.log('Cron job finished: Popularity updated successfully!');
  }

}

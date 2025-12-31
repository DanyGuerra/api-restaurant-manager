import { Module } from '@nestjs/common';
import { LoggerModule, LoggerErrorInterceptor } from 'nestjs-pino';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { LoggerContextInterceptor } from './interceptors/logger-context.interceptor';
import { ApiKeyGuard } from './auth/api-key.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelpController } from './modules/help/help.controller';
import { AuthModule } from '././modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { BusinessModule } from './modules/business/business.module';
import { UserBusinessRolesModule } from './modules/user-business-role/user-business-role.module';
import { Business } from 'entities/business.entity';
import { UserBusinessRole } from 'entities/user-business-role.entity';
import { ProductGroup } from 'entities/product-group.entity';
import { Product } from 'entities/product.entity';
import { OptionGroup } from 'entities/option-group.entity';
import { ProductOption } from 'entities/product-option.entity';
import { ProductGroupModule } from './modules/product-group/product-group.module';
import { ProductsModule } from './modules/products/products.module';
import { OptionGroupModule } from './modules/option-group/option-group.module';
import { ProductOptionGroupController } from './modules/product-option-group/product-option-group.controller';
import { ProductOptionGroupModule } from './modules/product-option-group/product-option-group.module';
import { ProductOptionGroupService } from './modules/product-option-group/product-option-group.service';
import { ProductOptionGroup } from 'entities/product-option-group.entity';
import { ProductOptionModule } from './modules/product-option/product-option.module';
import { OrdersModule } from './modules/orders/orders.module';
import { Order } from 'entities/order.entity';
import { OrderItem } from 'entities/order-item.entity';
import { OrderItemOption } from 'entities/order-item-option.entity';
import { OrderItemOptionsModule } from './modules/order-item-options/order-item-options.module';
import { OrderItemGroup } from 'entities/order-item-group.entity';
import { OrderItemsModule } from './modules/order-items/order-items.module';
import { Label } from 'entities/label.entity';
import { OrderLabel } from 'entities/order-label.entity';
import { OrderItemGroupsModule } from './modules/order-item-groups/order-item-groups.module';

@Module({
  controllers: [AppController, HelpController, ProductOptionGroupController],
  providers: [
    AppService,
    ProductOptionGroupService,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerErrorInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerContextInterceptor,
    },
  ],
  imports: [
    TypeOrmModule.forFeature([
      Business,
      UserBusinessRole,
      ProductGroup,
      Product,
      OptionGroup,
      ProductOption,
      ProductOptionGroup,
      Order,
      OrderItem,
      OrderItemOption,
      OrderItemGroup,
      Label,
      OrderLabel,
    ]),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    BusinessModule,
    UserBusinessRolesModule,
    ProductGroupModule,
    ProductsModule,
    OptionGroupModule,
    ProductOptionGroupModule,
    ProductOptionGroupModule,
    ProductOptionModule,
    OrdersModule,
    OrderItemGroupsModule,
    OrderItemsModule,
    OrderItemOptionsModule,
    LoggerModule.forRoot({
      pinoHttp: {
        customSuccessMessage: (req, res) => {
          return 'Request completed';
        },
        customErrorMessage: (req, res, err) => {
          return 'Request failed';
        },
        customLogLevel: (req, res, err) => {
          if (res.statusCode >= 400 || err) {
            return 'error';
          }
          return 'info';
        },
        serializers: {
          err: (err) => {
            return {
              type: err.type,
              message: err.message,
              stack: err.stack,
              response: (err as any).response,
            };
          },
        },
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
  ],
})
export class AppModule { }

import { Module } from '@nestjs/common';
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
import { Option } from 'entities/option.entity';
import { ProductGroupModule } from './modules/product-group/product-group.module';

@Module({
  controllers: [AppController, HelpController],
  providers: [AppService],
  imports: [
    TypeOrmModule.forFeature([
      Business,
      UserBusinessRole,
      ProductGroup,
      Product,
      OptionGroup,
      Option,
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
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    BusinessModule,
    UserBusinessRolesModule,
    ProductGroupModule,
  ],
})
export class AppModule {}

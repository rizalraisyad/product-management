import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { AuditLogModule } from './domains/audit-log/audit-log.module';
import { DatabaseModule } from './db/database.module';
import { allConfig } from './config/all-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config';
import { ProductModule } from './domains/product/product.module';
import { CategoryModule } from './domains/category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [allConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dbConfig()),
    DatabaseModule,
    AuditLogModule,
    ProductModule,
    CategoryModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}

import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { AuditLogModule } from './domains/audit-log/audit-log.module';
import { DatabaseModule } from './db/database.module';
import { allConfig } from './config/all-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [allConfig],
      isGlobal: true,
    }),
    DatabaseModule,
    AuditLogModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}

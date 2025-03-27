// src/domains/audit-log/audit-log.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './audit-log.entity';
import { AuditLogService } from './audit-log.service';
import { AuditLogRepository } from './audit-log.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditLogService, AuditLogRepository],
  exports: [AuditLogService],
})
export class AuditLogModule {}

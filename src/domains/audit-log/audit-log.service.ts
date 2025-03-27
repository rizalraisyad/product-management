import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from './audit-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async log(method: string, path: string, body: Record<string, any>) {
    await this.auditRepo.insert({
      method,
      path,
      body,
    });
  }
}

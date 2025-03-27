import { Injectable } from '@nestjs/common';
import { AuditLog } from './audit-log.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuditLogRepository {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repo: Repository<AuditLog>,
  ) {}

  async insertLog(
    method: string,
    path: string,
    body: Record<string, unknown>,
  ): Promise<void> {
    const log = this.repo.create({ method, path, body });
    await this.repo.save(log);
  }
}

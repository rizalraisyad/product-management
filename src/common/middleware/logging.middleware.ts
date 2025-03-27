import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuditLog } from 'src/domains/audit-log/audit-log.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private dataSource: DataSource) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { method, path } = req;
    const body = req.body as Record<string, any>; // 🔧 FIXED

    if (['PUT', 'PATCH', 'DELETE'].includes(method)) {
      const auditRepo = this.dataSource.getRepository(AuditLog);
      await auditRepo.insert({
        method,
        path,
        body,
      });
    }

    next();
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditLogRepository } from '../audit-log.repository';
import { AuditLog } from '../audit-log.entity';

describe('AuditLogRepository', () => {
  let auditLogRepository: AuditLogRepository;
  let mockRepository: Record<'create' | 'save', jest.Mock>;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogRepository,
        {
          provide: getRepositoryToken(AuditLog),
          useValue: mockRepository,
        },
      ],
    }).compile();

    auditLogRepository = module.get<AuditLogRepository>(AuditLogRepository);
  });

  describe('insertLog', () => {
    it('should successfully insert a log with valid method, path, and body', async () => {
      const method = 'POST';
      const path = '/api/users';
      const body = { name: 'John Doe', email: 'john@example.com' };

      const mockLog = { id: 1, method, path, body };
      mockRepository.create.mockReturnValue(mockLog);
      mockRepository.save.mockResolvedValue(mockLog);

      await auditLogRepository.insertLog(method, path, body);

      expect(mockRepository.create).toHaveBeenCalledWith({
        method,
        path,
        body,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockLog);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditLogService } from '../audit-log.service';
import { AuditLog } from '../audit-log.entity';

describe('AuditLogService', () => {
  let service: AuditLogService;
  let mockRepository: {
    insert: jest.Mock;
  };

  beforeEach(async () => {
    mockRepository = {
      insert: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogService,
        {
          provide: getRepositoryToken(AuditLog),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuditLogService>(AuditLogService);
  });

  it('should successfully log a valid method, path, and body', async () => {
    const method = 'GET';
    const path = '/api/test';
    const body = { key: 'value' };

    await service.log(method, path, body);

    expect(mockRepository.insert).toHaveBeenCalledWith({
      method,
      path,
      body,
    });
  });
});

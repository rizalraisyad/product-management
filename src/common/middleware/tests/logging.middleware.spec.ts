import { Test, TestingModule } from '@nestjs/testing';
import { LoggingMiddleware } from '../logging.middleware';
import { DataSource, Repository } from 'typeorm';
import { AuditLog } from 'src/domains/audit-log/audit-log.entity';

describe('LoggingMiddleware', () => {
  let loggingMiddleware: LoggingMiddleware;
  let mockAuditRepo: jest.Mocked<Partial<Repository<AuditLog>>>;
  let mockDataSource: jest.Mocked<Partial<DataSource>>;

  beforeEach(async () => {
    mockAuditRepo = {
      insert: jest.fn(),
    };

    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockAuditRepo),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggingMiddleware,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    loggingMiddleware = module.get<LoggingMiddleware>(LoggingMiddleware);
  });

  it('should insert audit log for PUT request', async () => {
    const mockRequest = {
      method: 'PUT',
      path: '/test',
      body: { key: 'value' },
    };
    const mockResponse = {};
    const mockNext = jest.fn();

    await loggingMiddleware.use(
      mockRequest as any,
      mockResponse as any,
      mockNext,
    );

    expect(mockDataSource.getRepository).toHaveBeenCalledWith(AuditLog);
    expect(mockAuditRepo.insert).toHaveBeenCalledWith({
      method: 'PUT',
      path: '/test',
      body: { key: 'value' },
    });
    expect(mockNext).toHaveBeenCalled();
  });

  it('should insert audit log for PATCH request', async () => {
    const mockRequest = {
      method: 'PATCH',
      path: '/test-patch',
      body: { update: 'value' },
    };
    const mockResponse = {};
    const mockNext = jest.fn();

    await loggingMiddleware.use(
      mockRequest as any,
      mockResponse as any,
      mockNext,
    );

    expect(mockDataSource.getRepository).toHaveBeenCalledWith(AuditLog);
    expect(mockAuditRepo.insert).toHaveBeenCalledWith({
      method: 'PATCH',
      path: '/test-patch',
      body: { update: 'value' },
    });
    expect(mockNext).toHaveBeenCalled();
  });

  it('should insert audit log for DELETE request', async () => {
    const mockRequest = {
      method: 'DELETE',
      path: '/test-delete',
      body: { id: '123' },
    };
    const mockResponse = {};
    const mockNext = jest.fn();

    await loggingMiddleware.use(
      mockRequest as any,
      mockResponse as any,
      mockNext,
    );

    expect(mockDataSource.getRepository).toHaveBeenCalledWith(AuditLog);
    expect(mockAuditRepo.insert).toHaveBeenCalledWith({
      method: 'DELETE',
      path: '/test-delete',
      body: { id: '123' },
    });
    expect(mockNext).toHaveBeenCalled();
  });

  it('should not insert audit log for GET request', async () => {
    const mockRequest = {
      method: 'GET',
      path: '/test-get',
      body: {},
    };
    const mockResponse = {};
    const mockNext = jest.fn();

    await loggingMiddleware.use(
      mockRequest as any,
      mockResponse as any,
      mockNext,
    );

    expect(mockDataSource.getRepository).not.toHaveBeenCalled();
    expect(mockAuditRepo.insert).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });
});

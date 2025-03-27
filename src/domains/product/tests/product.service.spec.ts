import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ProductRepository } from '../product.repository';
import { ProductService } from '../product.service';

describe('ProductService', () => {
  let service: ProductService;
  let repo: jest.Mocked<ProductRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: {
            createAndSave: jest.fn(),
            findOne: jest.fn(),
            findWithPagination: jest.fn(),
            findByIds: jest.fn(),
            save: jest.fn(),
            merge: jest.fn(),
            update: jest.fn(),
            softDeleteById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ProductService);
    repo = module.get(ProductRepository);
  });

  it('should create a product', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const dto = { sku: 'SKU001', name: 'Test', price: 10000 } as any;
    repo.findOne.mockResolvedValue(null);
    repo.createAndSave.mockResolvedValue({ ...dto, id: 1 });

    const result = await service.create(dto);
    expect(result).toEqual({ ...dto, id: 1 });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.createAndSave).toHaveBeenCalledWith(dto);
  });

  it('should throw conflict if SKU exists', async () => {
    repo.findOne.mockResolvedValue({ sku: 'DUPLICATE' } as any);
    await expect(service.create({ sku: 'DUPLICATE' } as any)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should list products with pagination', async () => {
    repo.findWithPagination.mockResolvedValue({ data: [], total: 0 });
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result).toEqual({ data: [], total: 0 });
  });

  it('should return product by ID', async () => {
    repo.findOne.mockResolvedValue({ id: 1 } as any);
    const product = await service.findById(1);
    expect(product).toEqual({ id: 1 });
  });

  it('should checkout products and return total', async () => {
    repo.findByIds.mockResolvedValue([
      { id: 1, price: 1000 },
      { id: 2, price: 2000 },
    ] as any);
    const result = await service.checkout([1, 2]);
    expect(result.totalPrice).toBe(3000);
    expect(result.items).toHaveLength(2);
  });

  it('should update product with new SKU', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const existing = { id: 1, sku: 'OLD' } as any;
    const dto = { sku: 'NEW' };
    repo.findOne.mockResolvedValueOnce(existing).mockResolvedValueOnce(null);

    repo.merge.mockReturnValue({ ...existing, ...dto });
    repo.save.mockResolvedValue({ id: 1, sku: 'NEW' } as any);

    const result = await service.update(1, dto as any);
    expect(result.sku).toBe('NEW');
  });

  it('should soft delete product', async () => {
    repo.findOne.mockResolvedValue({ id: 1 } as any);
    await service.softDelete(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.softDeleteById).toHaveBeenCalledWith(1);
  });

  it('should throw 404 if deleting non-existent product', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.softDelete(123)).rejects.toThrow(NotFoundException);
  });
});

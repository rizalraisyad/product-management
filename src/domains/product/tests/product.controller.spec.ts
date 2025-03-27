import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';

describe('ProductController', () => {
  let controller: ProductController;
  let service: jest.Mocked<ProductService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
            checkout: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(ProductController);
    service = module.get(ProductService);
  });

  it('should create a product', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const dto = { sku: 'X', name: 'Test' } as any;
    service.create.mockResolvedValue({ id: 1, ...dto });

    const result = await controller.create(dto);
    expect(result).toEqual({ id: 1, ...dto });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all products', async () => {
    service.findAll.mockResolvedValue({ data: [], total: 0 });
    const result = await controller.findAll();
    expect(result.total).toBe(0);
  });

  it('should return product by ID', async () => {
    const product = { id: 1, name: 'A' };
    service.findById.mockResolvedValue(product as any);
    const result = await controller.findOne(1);
    expect(result).toEqual(product);
  });

  it('should call update with ID and DTO', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const dto = { name: 'Updated' } as any;
    const product = { id: 1, name: 'Updated' };
    service.update.mockResolvedValue(product as any);
    const result = await controller.update(1, dto);
    expect(result).toEqual(product);
  });

  it('should call soft delete', async () => {
    await controller.remove(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.softDelete).toHaveBeenCalledWith(1);
  });

  it('should checkout products', async () => {
    service.checkout.mockResolvedValue({
      success: true,
      items: [],
      totalPrice: 0,
    });
    const result = await controller.checkout({ productIds: [1, 2] });
    expect(result.success).toBe(true);
  });
});

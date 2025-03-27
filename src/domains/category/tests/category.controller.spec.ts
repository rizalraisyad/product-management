import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { Category } from '../category.entity';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: jest.Mocked<CategoryService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            create: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get(CategoryService);
  });

  it('should call service.create and return result', async () => {
    const dto: CreateCategoryDto = { name: 'Fruits' };

    const mockCategory: Category = {
      id: 1,
      name: 'Fruits',
      isDeleted: false,
      products: [],
      created_at: new Date(),
      updated_at: new Date(),
    };

    service.create.mockResolvedValue(mockCategory);

    const response = await controller.create(dto);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(response).toEqual(mockCategory);
  });

  it('should call service.softDelete', async () => {
    await controller.delete(5);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(service.softDelete).toHaveBeenCalledWith(5);
  });
});

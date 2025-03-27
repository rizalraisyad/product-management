import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../category.repository';
import { CategoryService } from '../category.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let repo: jest.Mocked<CategoryRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useValue: {
            createAndSave: jest.fn(),
            findOne: jest.fn(),
            softDeleteById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repo = module.get(CategoryRepository);
  });

  it('should create a category', async () => {
    const mockCategory = {
      id: 1,
      name: 'Snacks',
      isDeleted: false,
      products: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    repo.createAndSave.mockResolvedValue(mockCategory);

    const result = await service.create({ name: 'Snacks' });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.createAndSave).toHaveBeenCalledWith('Snacks');
    expect(result).toEqual(mockCategory);
  });

  it('should soft delete a category', async () => {
    const mockCategory2 = {
      id: 2,
      name: 'Drinks',
      isDeleted: false,
      products: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    repo.findOne.mockResolvedValue(mockCategory2);

    await service.softDelete(2);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.softDeleteById).toHaveBeenCalledWith(2);
  });

  it('should throw NotFoundException if category not found', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.softDelete(99)).rejects.toThrow(NotFoundException);
  });
});

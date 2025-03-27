import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly productRepo: ProductRepository,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const existing = await this.productRepo.findOne({
      where: {
        sku: dto.sku,
        isDeleted: false,
      },
    });
    if (existing) {
      throw new ConflictException('SKU already exists');
    }

    return this.productRepo.createAndSave(dto);
  }

  async findAll({
    search,
    page,
    limit,
  }: {
    search?: string;
    page: number;
    limit: number;
  }): Promise<{ data: Product[]; total: number }> {
    return this.productRepo.findWithPagination(search, page, limit);
  }

  async findById(id: number): Promise<Product | null> {
    return this.productRepo.findOne({ where: { id, isDeleted: false } });
  }

  async checkout(productIds: number[]): Promise<{
    success: boolean;
    items: Product[];
    totalPrice: number;
  }> {
    const items = await this.productRepo.findByIds(productIds);
    const totalPrice = items.reduce((sum, p) => sum + p.price, 0);

    return {
      success: true,
      items,
      totalPrice,
    };
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id, isDeleted: false },
    });
    if (!product) throw new NotFoundException('Product not found');

    if (dto.sku && dto.sku !== product.sku) {
      const existing = await this.productRepo.findOne({
        where: { sku: dto.sku, isDeleted: false },
      });
      if (existing) throw new ConflictException('SKU already exists');
    }

    const updated = this.productRepo.merge(product, dto);
    return this.productRepo.save(updated);
  }

  async softDelete(id: number): Promise<void> {
    const product = await this.productRepo.findOne({
      where: { id, isDeleted: false },
    });
    if (!product) throw new NotFoundException('Product not found');

    await this.productRepo.softDeleteById(id);
  }
}

import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dtos/create-product.dto';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(private readonly dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async createAndSave(dto: CreateProductDto): Promise<Product> {
    const product = this.create(dto);
    return this.save(product);
  }

  async findWithPagination(
    search = '',
    page = 1,
    limit = 10,
  ): Promise<{ data: Product[]; total: number }> {
    const qb = this.createQueryBuilder('product').where(
      'product.isDeleted = false',
    );

    if (search) {
      qb.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    qb.skip((page - 1) * limit)
      .take(limit)
      .orderBy('product.created_at', 'DESC');

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async findByIds(ids: number[]): Promise<Product[]> {
    return this.find({
      where: {
        id: In(ids),
        isDeleted: false,
      },
    });
  }

  async softDeleteById(id: number): Promise<void> {
    await this.update(id, { isDeleted: true });
  }
}

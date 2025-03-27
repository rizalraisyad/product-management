// src/domains/category/category.repository.ts
import { Category } from './category.entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async createAndSave(name: string): Promise<Category> {
    const category = this.create({ name });
    return this.save(category);
  }

  async softDeleteById(id: number): Promise<void> {
    await this.update(id, { isDeleted: true });
  }
}

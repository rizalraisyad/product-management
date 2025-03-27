import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  ParseIntPipe,
  NotFoundException,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CheckoutDto } from './dtos/checkout.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all products with search & pagination' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of products' })
  async findAll(
    @Query('search') search?: string,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ): Promise<{ data: Product[]; total: number }> {
    return this.productService.findAll({ search, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product detail by ID' })
  @ApiResponse({ status: 200, description: 'Product detail' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    const product = await this.productService.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Checkout flow (demo)' })
  @ApiResponse({ status: 200, description: 'Checkout success' })
  async checkout(@Body() body: CheckoutDto): Promise<{
    success: boolean;
    items: Product[];
    totalPrice: number;
  }> {
    return this.productService.checkout(body.productIds);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a product by ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productService.softDelete(id);
  }
}

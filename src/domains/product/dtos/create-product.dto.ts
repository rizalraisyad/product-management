import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsUrl } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'MHZVTK' })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty({ example: 'snack' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Cheap snack',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 500 })
  @IsInt()
  weight: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  width: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  length: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  height: number;

  @ApiProperty({
    example: 'https://cf.shopee.co.id/file/7cb930d1bd183a435f4fb3e5cc4a896b',
  })
  @IsUrl()
  image: string;

  @ApiProperty({ example: 30000 })
  @IsInt()
  price: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  category_id: number;
}

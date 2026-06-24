import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateProductDto {
  @ApiProperty({
    example: "XXXXXID",
    description: "category id",
    required: true,
  })
  categoryId: string;

  @ApiProperty({ example: "milk", description: "product name", required: true })
  name: string;

  @ApiProperty({
    example: "100",
    description: "product cost price",
    required: true,
  })
  costPrice: number;

  @ApiProperty({
    example: "120",
    description: "product selling price",
    required: true,
  })
  sellingPrice: number;

  @ApiProperty({ example: "milk", description: "product name", required: true })
  stockQuantity: number;

  @ApiProperty({ example: "url", description: "product name", required: false })
  imageUrl?: string;

  @ApiProperty({ description: "product name", required: false })
  description?: string;
}

export class QueryProductDto {
  @ApiPropertyOptional({ example: "milk", description: "product name" })
  category?: string;

  @ApiPropertyOptional({ example: "milk", description: "product name" })
  search?: string;

  @ApiPropertyOptional({ example: "milk", description: "product name" })
  page?: number;

  @ApiPropertyOptional({ example: "milk", description: "product name" })
  limit?: number;
}

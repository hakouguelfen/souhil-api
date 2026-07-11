import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PriceDto } from "./price.dto";

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
    type: PriceDto,
    required: false,
    description: "List of order items",
  })
  price?: PriceDto;

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

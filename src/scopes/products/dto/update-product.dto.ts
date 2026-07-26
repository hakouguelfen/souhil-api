import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateProductDto {
  @ApiPropertyOptional({
    example: "XXXXXID",
    description: "category id",
  })
  categoryId?: string;

  @ApiPropertyOptional({
    example: "XXXXXID",
    description: "category id",
  })
  brandId?: string;

  @ApiPropertyOptional({
    example: "milk",
    description: "product name",
  })
  name?: string;

  @ApiPropertyOptional({
    example: "false",
  })
  isAvailable?: boolean;

  @ApiPropertyOptional({
    example: "100",
    description: "product cost price",
  })
  costPrice?: number;

  @ApiPropertyOptional({
    example: "120",
    description: "product selling price",
  })
  sellingPrice: number;

  @ApiPropertyOptional({
    example: "milk",
    description: "product name",
  })
  stockQuantity?: number;

  @ApiPropertyOptional({
    example: "url",
    description: "product name",
  })
  imageUrl?: string;

  @ApiPropertyOptional({ description: "product name", required: false })
  description?: string;
}

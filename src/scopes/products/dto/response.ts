import { ApiExtraModels, ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { PriceDto } from "./price.dto";

export class CategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class BrandDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

@ApiExtraModels(PriceDto)
export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: CategoryDto })
  categoryId: CategoryDto;

  @ApiProperty({ type: BrandDto })
  brandId: BrandDto;

  @ApiProperty()
  name: string;

  @ApiProperty({
    type: "object",
    additionalProperties: { $ref: getSchemaPath(PriceDto) },
  })
  prices: Record<string, PriceDto>;

  @ApiProperty()
  stockQuantity: number;

  @ApiProperty()
  isAvailable: boolean;

  @ApiProperty({ nullable: true, required: false })
  imageUrl?: string;

  @ApiProperty({ nullable: true, required: false })
  description?: string;
}

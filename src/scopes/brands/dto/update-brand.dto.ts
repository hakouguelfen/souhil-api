import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateBrandDto {
  @ApiPropertyOptional({
    example: "milk",
    description: "product name",
  })
  name?: string;

  @ApiPropertyOptional({
    example: "url",
    description: "product name",
  })
  imageUrl?: string;
}

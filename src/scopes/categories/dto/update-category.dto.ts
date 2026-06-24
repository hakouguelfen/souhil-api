import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    example: "milk",
    description: "product name",
  })
  name?: string;
}

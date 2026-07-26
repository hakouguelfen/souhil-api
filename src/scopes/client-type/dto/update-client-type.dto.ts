import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateClientTypeDto {
  @ApiPropertyOptional({ description: "The image of the user" })
  label?: string;

  @ApiPropertyOptional({ description: "The image of the user" })
  imageUrl?: string;
}

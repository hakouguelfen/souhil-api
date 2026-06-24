import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty({ example: "hakou", description: "The username of the user" })
  name: string;

  @ApiProperty({ description: "The image of the user" })
  image_url?: string;
}

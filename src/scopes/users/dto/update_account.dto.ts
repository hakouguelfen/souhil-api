import { ApiProperty } from "@nestjs/swagger";

export class UpdateAccountDto {
  @ApiProperty({
    description: "account status",
  })
  verified: boolean;
}

import { ApiProperty } from "@nestjs/swagger";

export class AccountResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  locked: boolean;

  @ApiProperty()
  verified: boolean;
}

export class UserAccountsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  accountStatus: boolean;
}

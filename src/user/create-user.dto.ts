import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  walletAddress: string;

  @ApiProperty({ required: false, default: [] })
  assets?: string[];
}

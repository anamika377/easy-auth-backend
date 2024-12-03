import { IsString, IsNotEmpty } from 'class-validator';

export class SignUpDto {
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsNotEmpty()
  password: string;
}

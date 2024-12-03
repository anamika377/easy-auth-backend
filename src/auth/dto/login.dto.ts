import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  email: string;

  @IsNotEmpty()
  password: string;
}

import { IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  name: string;
  @IsString()
  email: string;
  @IsString()
  password: string;
}

export class LoginAccountDto {
  @IsString()
  email: string;
  @IsString()
  password: string;
}

import {
  IsEmail,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsUrl,
  IsArray,
} from 'class-validator';
import { DocumentType } from 'prisma/generated/client';
import { CreateAccountDto } from 'src/modules/auth/dto/auth.dto';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @IsString()
  documentType?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;


  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @IsOptional()
  @IsArray()
  uploadedDocumentsTypes: DocumentType[]
}   

export class CreateUserDto extends CreateAccountDto {
  @IsString()
  salt: string;
}

export class ChangeUserPwdDto {
  @IsString()
  oldPassword: string;
  @IsString()
  newPassword: string;
}
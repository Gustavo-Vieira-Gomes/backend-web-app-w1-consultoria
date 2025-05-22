import {
  IsEmail,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { MartialStatusEnum } from "prisma/generated/client";

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @IsString()
  documentType?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsEnum(MartialStatusEnum)
  martialStatus?: MartialStatusEnum;

  @IsOptional()
  @IsUrl()
  photoUrl?: photoUrl
}

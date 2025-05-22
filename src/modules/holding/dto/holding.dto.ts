import {
  IsOptional,
  IsString,
  IsDate,
  IsNumber,
  IsUUID,
  IsNotEmpty
} from 'class-validator';
import { Type } from 'class-transformer'

export class CreateHoldingDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  legalEntityType: string;

  @IsString()
  @IsNotEmpty()
  taxRegime: string;

  @Type(() => Date)
  @IsDate()
  incorporationDate: Date;

  @IsNumber()
  shareCapital: number;

  @IsUUID()
  userId: string;
}

export class UpdateHoldingDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  legalEntityType?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  taxRegime?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  incorporationDate?: Date;

  @IsOptional()
  @IsNumber()
  shareCapital?: number;
}

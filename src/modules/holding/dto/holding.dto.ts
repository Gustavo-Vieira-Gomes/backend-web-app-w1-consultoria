import {
  IsOptional,
  IsString,
  IsDate,
  IsNumber,
  IsUUID,
  IsNotEmpty
} from 'class-validator';
import { Type } from 'class-transformer/;'
import { MartialStatusEnum } from "prisma/generated/client";

export class CreateHoldingDto {
  @IsString()
  @IsNotEmpty()
  name: name;

  @IsString()
  @IsNotEmpty()
  cnpj: cnpj;

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
  
  @IsUUID()
  consultantId: string;
}

export class UpdateHoldingDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  legalEntityType?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  taxRegime?: string;

  @IsOptional()
  @IsNumber()
  shareCapital?: number;

  @IsOptional()
  @IsUUID()
  consultantId?: string;
}

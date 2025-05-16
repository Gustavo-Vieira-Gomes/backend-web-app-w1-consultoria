import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { HeirRelation, DocumentType } from "prisma/generated/client";

export class CreateHeirDto {
  @IsString()
  name: string;

  @IsEnum(HeirRelation)
  relation: HeirRelation;

  @IsNumber()
  percentage: number;

  @IsBoolean()
  is_forced_heir: boolean;

  @ValidateNested()
  @Type(() => DocumentDto)
  document: DocumentDto;
}

export class DocumentDto {
  @IsString()
  phone: string;

  @IsString()
  document: string;

  @IsEnum(DocumentType)
  documentType: DocumentType;

  @IsString()
  address: string;

  // exemplo de campo opcional
  @IsOptional()
  @IsString()
  email?: string;
}

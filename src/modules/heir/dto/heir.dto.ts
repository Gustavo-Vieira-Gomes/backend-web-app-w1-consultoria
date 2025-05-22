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
  @IsNotEmpty()
  name: string;

  @IsEnum(HeirRelation)
  @IsNotEmpty()
  relation: HeirRelation;

  @IsNumber()
  @IsNotEmpty()
  percentage: number;

  @IsBoolean()
  @IsNotEmpty()
  is_forced_heir: boolean;

  @ValidateNested()
  @Type(() => DocumentDto)
  document: DocumentDto;
}

export class DocumentDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  document: string;

  @IsEnum(DocumentType)
  @IsNotEmpty()
  documentType: DocumentType;

  @IsString()
  @IsNotEmpty()
  address: string;
}

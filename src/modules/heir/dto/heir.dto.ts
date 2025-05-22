import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
  IsNotEmpty,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { HeirRelation, DocumentType, Gender } from "prisma/generated/client";
import { AddressDto } from "src/modules/asset/dto/asset.dto";
import { PartialType } from "@nestjs/mapped-types";

export class CreateHeirDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(HeirRelation)
  @IsNotEmpty()
  relation: HeirRelation;

  @IsEnum(Gender)
  gender: Gender;
  
  @IsString()
  @IsNotEmpty()
  phone: string;
  
  @IsNumber()
  @IsNotEmpty()
  percentage: number;

  @IsString()
  @IsNotEmpty()
  document: string;
  
  @IsEnum(DocumentType)
  @IsNotEmpty()
  documentType: DocumentType;
  
  @IsBoolean()
  @IsNotEmpty()
  isForcedHeir: boolean;
  
  @IsOptional()
  @IsEnum(DocumentType)
  uploadedDocumentType?: DocumentType;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;
}
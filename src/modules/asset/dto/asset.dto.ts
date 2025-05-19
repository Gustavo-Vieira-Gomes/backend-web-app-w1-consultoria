import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsOptional, IsPositive, IsString, IsUUID, Length, ValidateNested } from "class-validator";
import { AssetType, LiquidityLevel, DocumentType } from "prisma/generated/client";


export class AssetDto {
    @IsString()
    description: string;

    @IsPositive()
    initialValue: number;

    @IsEnum(AssetType)
    type: AssetType;

    @IsEnum(LiquidityLevel)
    liquidityLevel: LiquidityLevel;

    @IsOptional()
    @ValidateNested()
    @Type(() => AddressDto)
    address?: AddressDto;

    @IsOptional()
    @IsEnum(DocumentType)
    documentType?: DocumentType;

    @IsBoolean()
    isProtected: boolean;
}

export class AddressDto {
    @IsString()
    street: string;

    @IsString()
    number: string;

    @IsOptional()
    @IsString()
    complement?: string;

    @IsString()
    district: string;

    @IsString()
    city: string;

    @IsString()
    state: string;

    @IsString()
    @Length(8, 9, { message: 'zipCode must be between 8 and 9 characters' })
    zipCode: string;

    @IsOptional()
    @IsString()
    country?: string = 'BR';
}

export class updateAssetDto {
    @IsUUID()
    id: string;

    @IsString()
    description: string;

    @IsPositive()
    initialValue: number;

    @IsEnum(AssetType)
    type: AssetType;

    @IsEnum(LiquidityLevel)
    liquidityLevel: LiquidityLevel;

    @IsOptional()
    @IsUUID()
    fileId?: string;

    @IsOptional()
    @IsEnum(DocumentType)
    documentType?: DocumentType;

    @IsBoolean()
    isProtected: boolean;
}

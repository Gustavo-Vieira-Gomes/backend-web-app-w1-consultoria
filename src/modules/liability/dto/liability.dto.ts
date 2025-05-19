import { IsDateString, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { LiabilityType } from "prisma/generated/client";

export class LiabilityDto {
    @IsString()
    name: string;

    @IsPositive()
    initialValue: number;

    @IsEnum(LiabilityType)
    type: LiabilityType;

    @IsOptional()
    @IsString()
    lender?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    interestRate?: number;

    @IsOptional()
    @IsDateString()
    dueDate?: string;
}

export class UpdateLiabilityDto extends LiabilityDto {
    @IsPositive()
    currentValue: number
}
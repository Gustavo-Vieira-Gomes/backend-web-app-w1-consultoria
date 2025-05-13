import { IsBoolean, IsEnum, IsNumber, IsString } from "class-validator";
import { HeirRelation } from "prisma/generated/client";

export class CreateHeirDto {
    @IsString()
    name: string;

    @IsEnum(HeirRelation)
    relation: HeirRelation;

    @IsNumber()
    percentage: number;

    @IsBoolean()
    is_forced_heir: boolean

    document: DocumentDto
}

class DocumentDto {}
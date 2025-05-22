import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class SimulateTaxSavingsDto {
    @IsNumber()
    vehiclesTotalValue: number;

    @IsNumber()
    realEstateTotalValue: number;

    @IsNumber()
    fixedIncomeTotalValue: number;

    @IsNumber()
    stocksTotalValue: number;

    @IsNumber()
    cryptoTotalValue: number;

    @IsNumber()
    annualTotalValue: number;
}
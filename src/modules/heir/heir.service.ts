import { BadRequestException, Injectable } from "@nestjs/common";
import { ClientService } from "src/client/client.service";
import { CreateHeirDto } from "./dto/heir.dto";


@Injectable()
export class HeirService {
    constructor(private readonly clientService: ClientService) {}

    async createHeir(payload: CreateHeirDto){
        const heirExists = await this.clientService.heir.findFirst(
            {
                where: {
                    name: payload.name
                }
            }
        )
        if (heirExists) throw new BadRequestException("Heir already exists");

        const heir = await this.clientService.heir.create({
            data: {
                name: payload.name,
                relation: payload.relation,
                percentage: payload.percentage,
                is_forced_heir: payload.is_forced_heir
            }
        })

        if (!heir) throw new BadRequestException("Failed to create heir");

        return heir
    }

    async updateHeir(){}

    async softDeleteHeir(){}

    async getAllHeirsByUser(){}

    async getHeirById(){}
}
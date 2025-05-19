import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ClientService } from 'src/client/client.service';
import { LiabilityDto, UpdateLiabilityDto } from './dto/liability.dto';
import { paginated, skipOption } from 'src/utils/pagination/pagination';

@Injectable()
export class LiabilityService {
    constructor(private readonly clientService: ClientService) {}

    async createLiability(user: string, body: LiabilityDto){
        const liability = await this.clientService.liability.create({
            data: {
                currentValue: body.initialValue,
                ...body,
                user: {
                    connect: {
                        id: user
                    }
                } 
            }
        })

        if (!liability) throw new BadRequestException("Failed to create liability");

        return liability
    }

    async updateLiability(id: string, body: UpdateLiabilityDto){
        const liabilityExists = await this.clientService.liability.findFirst({
            where: {
                id
            }
        })

        if (!liabilityExists) throw new BadRequestException("Liability not found");

        const liability = await this.clientService.liability.update({
            where: {
                id
            },
            data: {
                ...body
            }
        })

        if (!liability) throw new BadRequestException("Failed to update liability");

        return liability
    }

    async getLiabilityById(id: string){
        const liability = await this.clientService.liability.findUnique({
            where: {
                id
            }
        })

        if (!liability) throw new BadRequestException("Liability not found");

        return liability
    }

    async getAllLiabilitiesByUser(user: string, page: number, limit: number){
        const [liabilities, liabilitiesCount] = await this.clientService.$transaction([
            this.clientService.liability.findMany({
                where: {
                    user: {
                        id: user
                    }
                },
                skip: skipOption(limit, page),
                take: limit
            }),
            this.clientService.liability.count({
                where: {
                    user: {
                        id: user
                    }
                }
            })
        ]);

        return paginated(liabilities, liabilitiesCount, page, limit)
    }

    async softDeleteLiability(id: string){
        const liabilityExists = await this.clientService.liability.findFirst({
            where: {
                id
            }
        })

        if (!liabilityExists) throw new BadRequestException("Liability not found");

        const liability = await this.clientService.liability.update({
            where: {
                id
            },
            data: {
                softDeleted: true,
                deletedAt: new Date()
            }
        })

        if (!liability) throw new BadRequestException("Failed to delete liability");

        return HttpStatus.NO_CONTENT
    }
}

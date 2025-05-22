import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ClientService } from "src/client/client.service";
import { CreateHoldingDto, UpdateHoldingDto } from "./dto/holding.dto";

@Injectable()
export class HoldingService {
  constructor(private readonly clientService: ClientService) { }

  async createHolding(consultantId: string, payload: CreateHoldingDto) {
    const holdingExists = await this.clientService.holding.findFirst({
      where: {
        name: payload.name,
        userId: payload.userId,
      },
    });
    if (holdingExists) {
      throw new BadRequestException("Holding already exists");
    }

    const holding = await this.clientService.holding.create({
      data: {
        name: payload.name,
        cnpj: payload.cnpj,
        legalEntityType: payload.legalEntityType,
        taxRegime: payload.taxRegime,
        incorporationDate: payload.incorporationDate,
        shareCapital: payload.shareCapital,

        user: {
          connect: {
            id: payload.userId,
          },
        },
        consultant: {
          connect: {
            id: consultantId,
          },
        },
      },
    });

    if (!holding) {
      throw new BadRequestException("Failed to create holding");
    }

    return holding;
  }

  async updateHolding(id: string, payload: UpdateHoldingDto) {
    const holding = await this.clientService.holding.findUnique({ where: { id } });

    if (!holding) {
      throw new NotFoundException("Holding not found");
    }

    const dataToUpdate = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined)
    );

    const updated = await this.clientService.holding.update({
      where: { id },
      data: {
        ...dataToUpdate,
      },
    });

    return updated;
  }

  async getById(id: string) {
    const holding = await this.clientService.holding.findUnique(
      {
        where: {
          id: id
        },
        include: {
          user: true,
          consultant: true,
          heirs: true
        }
      });

    if (!holding) {
      throw new NotFoundException("Holding not found or deleted");
    }

    return holding;
  }

  async getAllByConsultantId(userId: string) {
    return this.clientService.holding.findMany({
      where: {
        consultantId: userId,
      },
      include: {
        user: true,
        heirs: true
      }
    });
  }
}

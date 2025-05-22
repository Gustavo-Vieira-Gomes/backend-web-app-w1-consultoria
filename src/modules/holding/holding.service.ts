import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ClientService } from "src/client/client.service";
import { CreateHoldingDto, UpdateHoldingDto } from "./dto/holding.dto";

@Injectable()
export class HoldingService {
  constructor(private readonly clientService: ClientService) {}

  async createHolding(payload: CreateHoldingDto) {
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

        userId: payload.userId,
        consultantId: payload.consultantId,
      },
    });

    /*
    if (!holding) {
      throw new BadRequestException("Failed to create holding");
    }
    */

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

  async softDeleteHolding(id: string) {
    const holding = await this.clientService.holding.findUnique({ where: { id } });

    if (!holding) {
      throw new NotFoundException("Holding not found");
    }

    const deleted = await this.clientService.holding.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return deleted;
  }

  async getById(id: string) {
    const holding = await this.clientService.holding.findUnique({ where: { id } });

    if (!holding || holding.deletedAt) {
      throw new NotFoundException("Holding not found or deleted");
    }

    return holding;
  }

  async getAllByUserId(userId: string) {
      return this.clientService.holding.findMany({
        where: {
          userId,
          deletedAt: null,
        },
      });
  }
}

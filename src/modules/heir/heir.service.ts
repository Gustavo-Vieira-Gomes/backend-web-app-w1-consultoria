import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ClientService } from "src/client/client.service";
import { CreateHeirDto, UpdateHeirDto } from "./dto/heir.dto";

@Injectable()
export class HeirService {
  constructor(private readonly clientService: ClientService) {}

  async createHeir(payload: CreateHeirDto) {
    const heirExists = await this.clientService.heir.findFirst({
      where: {
        document: payload.document,
      },
    });
    if (heirExists) {
      throw new BadRequestException("Heir already exists");
    }

    const heir = await this.clientService.heir.create({
      data: {
        name: payload.name,
        gender: payload.gender,
        relation: payload.relation,
        phone: payload.phone,
        document: payload.document,
        documentType: payload.documentType,
        percentage: payload.percentage,
        address: { {create: { ...payload.adress } } };
        isForcedHeir: payload.isForcedHeir,
        userId: payload.userId,
      },
    });

    /*
    if (!heir) {
      throw new BadRequestException("Failed to create heir");
    }
    */

    return heir;
  }

  async updateHeir(id: string, payload: UpdateHeirDto) {
    const heir = await this.clientService.heir.findUnique({ where: { id } });
    if (!heir) {
      throw new NotFoundException("Heir not found");
    }

    const updated = await this.clientService.heir.update({
      where: { id },
      data: {
        name: payload.name,
        gender: payload.gender,
        relation: payload.relation,
        phone: payload.phone,
        document: payload.document,
        documentType: payload.documentType,
        percentage: payload.percentage,
        address: { {connect: { ...payload.adress } } };
        isForcedHeir: payload.isForcedHeir,
        deletedAt: null,
      },
    });

    return updated;
  }

  async softDeleteHeir(id: string) {
    const heir = await this.clientService.heir.findUnique({ where: { id } });

    if (!heir) {
      throw new NotFoundException("Heir not found");
    }

    const deleted = await this.clientService.heir.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return deleted;
  }

  async findAllByUserId(userId: string) {
    return this.clientService.heir.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });
  }

  async findOneById(id: string) {
    const heir = await this.clientService.heir.findUnique({ where: { id } });

    if (!heir || heir.deletedAt) {
      throw new NotFoundException("Heir not found or deleted");
    }

    return heir;
  }
}

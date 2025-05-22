import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ClientService } from "src/client/client.service";
import { CreateHeirDto } from "./dto/heir.dto";
import { S3Service } from "src/services/s3/s3.service";

@Injectable()
export class HeirService {
  constructor(private readonly clientService: ClientService, private readonly s3Service: S3Service) { }

  async createHeir(user: string, payload: CreateHeirDto, file?: Express.Multer.File) {
    const heirExists = await this.clientService.heir.findFirst({
      where: {
        document: payload.document,
      },
    });
    if (heirExists) {
      throw new BadRequestException("Heir already exists");
    }

    let s3Key: null | string = null;
    if (file && payload.uploadedDocumentType) {
      s3Key = await this.s3Service.uploadFile(file, "heirs");
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
        isForcedHeir: payload.isForcedHeir,

        user: {
          connect: {
            id: user
          }
        },

        ...(payload.address && {
          address: {
            create: {
              ...payload.address,
            },
          },
        }
        ),

        ...(s3Key && {
          documents: {
            create: {
              fileKey: s3Key,
              type: payload.uploadedDocumentType,
            },
          },
        }),
      },
    });

    if (!heir) {
      throw new BadRequestException("Failed to create heir");
    }

    return heir;
  }

  async updateHeir(id: string, payload: CreateHeirDto, file?: Express.Multer.File) {
    const heir = await this.clientService.heir.findUnique(
      {
        where: { id }
      }
    );
    if (!heir) {
      throw new NotFoundException("Heir not found");
    }

    let s3Key: null | string = null;
    if (file && payload.uploadedDocumentType) {
      const document = await this.clientService.document.findFirst({
        where: {
          type: payload.uploadedDocumentType,
          heirId: id
        }
      })
      if (document) {
        await this.s3Service.deleteFile(document.fileKey);
        await this.clientService.document.delete({
          where: {
            id: document.id
          }
        })
      }

      s3Key = await this.s3Service.uploadFile(file, "heirs");

    }


    const updated = await this.clientService.heir.update({
      where: {
        id: id
      },
      data: {
        name: payload.name,
        gender: payload.gender,
        relation: payload.relation,
        phone: payload.phone,
        document: payload.document,
        documentType: payload.documentType,
        percentage: payload.percentage,
        isForcedHeir: payload.isForcedHeir,

        ...(s3Key && {
          documents: {
            create: {
              fileKey: s3Key,
              type: payload.uploadedDocumentType,
            }
          }
        })
      },
    });

    return updated;
  }

  async updateHeirAddress (id: string, payload: any) {
    const addressExists = await this.clientService.address.findFirst({
      where: {
        heirs: {
          some: {
            id
          }
        }
      }
    })

    if (!addressExists) {
      return this.clientService.address.create({
        data: {
          street: payload.street,
          number: payload.number,
          complement: payload.complement,
          district: payload.district,
          city: payload.city,
          state: payload.state,
          zipCode: payload.zipCode,
          country: payload.country,
          heirs: {
            connect: {
              id
            }
          }
        }
      })
    } else {
      return this.clientService.address.update({
        where: {
          id: addressExists.id
        },
        data: {
          street: payload.street,
          number: payload.number,
          complement: payload.complement,
          district: payload.district,
          city: payload.city,
          state: payload.state,
          zipCode: payload.zipCode,
          country: payload.country,
        }
      })
    }
  }

  async softDeleteHeir(id: string) {
    const heir = await this.clientService.heir.findUnique({ where: { id } });

    if (!heir) {
      throw new NotFoundException("Heir not found");
    }

    const deleted = await this.clientService.heir.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        softDeleted: true
      },
    });
    return deleted;
  }

  async findAllByUserId(userId: string) {
    return this.clientService.heir.findMany({
      where: {
        userId,
        softDeleted: false,
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

import { Injectable } from '@nestjs/common';
import { ClientService } from 'src/client/client.service';
import { AddressDto, AssetDto, updateAssetDto } from './dto/asset.dto';
import { paginated, skipOption } from 'src/utils/pagination/pagination';
import { S3Service } from 'src/services/s3/s3.service';

@Injectable()
export class AssetService {
    constructor(private readonly clientService: ClientService, private readonly s3Service: S3Service) { }

    async createAsset(user: string, body: AssetDto, file?: Express.Multer.File) {
        let s3Key: null | string = null
        if (file && body.documentType) {
            s3Key = await this.s3Service.uploadFile(file, "assets")
        }

        return this.clientService.asset.create({
            data: {
                description: body.description,
                initialValue: body.initialValue,
                currentValue: body.initialValue,
                type: body.type,
                liquidityLevel: body.liquidityLevel,
                isProtected: body.isProtected,

                user: {
                    connect: {
                        id: user
                    }
                },

                ...(body.address && {
                    address: {
                        create: {
                            street: body.address.street,
                            number: body.address.number,
                            complement: body.address.complement,
                            district: body.address.district,
                            city: body.address.city,
                            state: body.address.state,
                            zipCode: body.address.zipCode,
                            country: body.address.country,
                        }
                    }
                }),

                ...((s3Key) && {
                    documents: {
                        create: [{
                            fileKey: s3Key, // s3 url
                            type: body.documentType,
                        }]
                    }
                })

            }
        })
    }


    async updateAsset(body: updateAssetDto, file?: Express.Multer.File) {
        let s3Key: null | string = null

        if (file && body.documentType) {
            const document = await this.clientService.document.findFirst({
                where: {
                    id: body.fileId
                }
            })
            await this.s3Service.deleteFile(document.fileKey);
            s3Key = await this.s3Service.uploadFile(file, "assets")
        }

        return this.clientService.asset.update({
            where: {
                id: body.id
            },
            data: {
                description: body.description,
                initialValue: body.initialValue,
                currentValue: body.initialValue,
                type: body.type,
                liquidityLevel: body.liquidityLevel,
                isProtected: body.isProtected,

                ...((s3Key) && {
                    documents: {
                        update: [{
                            where: {
                                id: body.fileId
                            },
                            data: {
                                fileKey: s3Key, // s3 url
                                type: body.documentType
                            }
                        }]
                    }
                })
            }
        })
    }

    async updateAssetAddress (id: string, body: AddressDto) {
        const addressExists = await this.clientService.address.findFirst({
            where: {
                user: {
                    id: id
                }
            }
        })
        if (!addressExists) {
            return this.clientService.address.create({
                data: {
                    street: body.street,
                    number: body.number,
                    complement: body.complement,
                    district: body.district,
                    city: body.city,
                    state: body.state,
                    zipCode: body.zipCode,
                    country: body.country,
                    user: {
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
                    street: body.street,
                    number: body.number,
                    complement: body.complement,
                    district: body.district,
                    city: body.city,
                    state: body.state,
                    zipCode: body.zipCode,
                    country: body.country,
                }
            })
        }
    }

    async getAssetById(id: string) {
        return this.clientService.asset.findUnique({
            where: {
                id
            },
            include: {
                address: true,
                documents: true
            }
        })
    }

    async getAllAssetsByUser(user:string, page: number, limit: number) {
        const [assets, assetsCount] = await this.clientService.$transaction([
            this.clientService.asset.findMany({
                where: {
                    user: {
                        id: user
                    }
                },
                skip: skipOption(limit, page),
                take: limit,
                include: {
                    address: true,
                    documents: true
                }
            }),
            this.clientService.asset.count({
                where: {
                    user: {
                        id: user
                    }
                }
            })
        ]);

        return paginated(assets, assetsCount, page, limit)
    }
    async softDeleteAsset(id: string) {
        return this.clientService.asset.update({
            where: {
                id
            },
            data: {
                softDeleted: true,
                deletedAt: new Date()
            }
        })
    }
}

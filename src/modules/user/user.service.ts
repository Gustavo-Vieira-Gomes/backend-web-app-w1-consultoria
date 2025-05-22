import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientService } from 'src/client/client.service';
import { ChangeUserPwdDto, CreateUserDto, UpdateUserDto } from './dto/user.dto'
import { compare, hashSync } from 'bcrypt';
import { S3Service } from 'src/services/s3/s3.service';

@Injectable()
export class UserService {
    constructor(private readonly clientService: ClientService, private readonly s3Service: S3Service) { }

    async create(data: CreateUserDto) {
        return this.clientService.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash: data.password,
                salt: data.salt
            }
        });
    }

    async getById(id: string) {
        const user = await this.clientService.user.findUnique({
            where: { id },
            include: {
                assets: true,
                liabilities: true,
                documents: true,
                address: true,
                heirs: true,
                userHolding: true,
                consultingHoldings: true,
            }
        });

        if (!user) {
            throw new NotFoundException("User not found or deleted");
        }

        return user;
    }

    async updateUser(id: string, payload: UpdateUserDto, files?: Express.Multer.File[]) {
        const user = await this.clientService.user.findUnique(
            {
                where: {
                    id
                }
            }
        );

        if (!user) throw new NotFoundException("User not found");

        let s3Keys: null | string[] = null;
        if (files && payload.uploadedDocumentsTypes) {
            s3Keys = await Promise.all(
                files.map(async (file, index) => {
                    const document = await this.clientService.document.findFirst({
                        where: {
                            type: payload.uploadedDocumentsTypes[index],
                            userId: id
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

                    return await this.s3Service.uploadFile(file, "users");
                })
            )
        }

        const dataToUpdate = Object.fromEntries(
            Object.entries(payload).filter(([_, v]) => v !== undefined)
        );

        const updated = await this.clientService.user.update({
            where: { id },
            data: {
                ...dataToUpdate,

                ...(s3Keys && {
                    documents: {
                        create: s3Keys.map((s3Key, index) => ({
                            fileKey: s3Key,
                            type: payload.uploadedDocumentsTypes[index]
                        }))
                    }
                })
            },
        });

        return updated;
    }

    async deleteUser(id: string) {
        return this.clientService.user.delete({
            where: {
                id: id
            }
        })
    }

    async changeUserPassword(
        id: string,
        body: ChangeUserPwdDto
    ) {
        const user = await this.clientService.user.findUnique({
            where: { id },
        });

        if (user && (await compare(body.oldPassword + user.salt, user.passwordHash))) {
            const passwordHash = hashSync(body.newPassword + user.salt, 10);

            if (passwordHash) {
                return this.clientService.user.update({
                    where: {
                        id: id
                    },
                    data: {
                        passwordHash: passwordHash
                    }
                });
            }
        }
    }

    // verifyUserEmail


    async getUserAssets(id: string) {
        return this.clientService.asset.findMany({
            where: {
                userId: id,
                softDeleted: false,
            }
        })
    }

    async getUserLiabilities(id: string) {
        return this.clientService.liability.findMany({
            where: {
                userId: id,
                softDeleted: false,
            }
        })
    }

    async getUserNetWorth(id: string) {
        const assets = await this.getUserAssets(id);
        const liabilities = await this.getUserLiabilities(id);

        const totalAssets = assets.reduce((acc, a) => acc + a.currentValue.toNumber(), 0);
        const totalLiabilities = liabilities.reduce((acc, l) => acc + l.currentValue.toNumber(), 0);

        return {
            netWorth: totalAssets - totalLiabilities,
            totalAssets,
            totalLiabilities,
        }
    }
}

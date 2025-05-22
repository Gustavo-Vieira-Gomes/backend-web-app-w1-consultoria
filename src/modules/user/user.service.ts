import { Injectable } from '@nestjs/common';
import { ClientService } from 'src/client/client.service';
import { CreateAccountDto } from '../auth/dto/auth.dto';
import { validateUser } from '../auth/auth.service.ts';
import { UpdateUserDto } from './dto/user.dto.ts'
import { compare, hashSync } from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly clientService: ClientService){}

    async create(data: CreateAccountDto) {
        return this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash: data.password
            }
        });
    }

    async getById(id: string) {
        const user = await this.clientService.user.findUnique({
          where: { id },
        });

        if (!user || user.deletedAt) {
          throw new NotFoundException("User not found or deleted");
        }

        return user;
    }

    async updateUser(id: string, payload: UpdateUserDto) {
        const user = await this.clientService.user.findUnique(
            {
                where: {
                    id
                }
            }
        );

        if (!user) throw new NotFoundException("User not found");

        const dataToUpdate = Object.fromEntries(
            Object.entries(payload).filter(([_, v]) => v !== undefined)
        );

        const updated = await this.clientService.user.update({
          where: { id },
          data: {
            ...dataToUpdate,
          },
        });

        return updated;
    }
    
    async softDeleteUser(id: string) {
        return this.prisma.user.update({
            data: {
                deletedAt: new Date();
            }
        });
    }
  
    async changeUserPassword(
        id: string,
        oldPassword: string,
        newPassword: string,
        newPasswordConfirm: string,
    ) {
        const user = await this.clientService.user.findUnique({
          where: { id },
        });

        if (user && (await compare(oldPassword + user.salt, user.passwordHash)) && newPassword == newPasswordConfirm) {
            const passwordHash = hashSync(newPassword + user.salt, 10);
            
            if (passwordHash) {
                return this.prisma.user.update({
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
                softDelete: false,
            }
        })
    }

    async getUserLiabilities(id: string) {
        return this.clientService.liabilities.findMany({
            where: {
                userId: id,
                softDelete: false,
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

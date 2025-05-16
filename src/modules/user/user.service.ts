import { Injectable } from '@nestjs/common';
import { ClientService } from 'src/client/client.service';
import { CreateAccountDto } from '../auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly prisma: ClientService){}

    async findOne(){}

    async create(data: CreateAccountDto) {
        return this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password_hash: data.password
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

         const updated = await this.clientService.user.update({
          where: { id },
          data: {
            name: payload.name,
            relation: payload.relation,
            percentage: payload.percentage,
            is_forced_heir: payload.is_forced_heir,
            phone: payload.phone,
            document: payload.document,
            documentType: payload.documentType,
            adress: payload.adress,
            userId: payload.userId,
            deletedAt: null
          },
        });

        return updated;
        return this.prisma.user.update({
            data: {
                // Se é null mantém se não troca
            }
        });
    }
    
    async softDeleteUser(id: string) {
        return this.prisma.user.update({
            data: {
                deletedAt: now();
            }
        });
    }
  
    async changeUserPassword(
        id: string,
        oldPassword: string,
        newPassword: string,
        newPasswordConfirm: string,
    ) {
        if 
      return this.prisma.user.update({
          data: {
              deletedAt: now();
          }
      });
    }

    // resetUserPassword


    // verifyUserEmail


    async getUserAssets(
    ) {
      return this.userService.getUserAssets(id);
    }

    async getUserLiabilities(
    ) {
      return this.userService.getUserLiabilities(id);
    }

    async getUserNetWorth(
    ) {
      return this.userService.getUserNetWorth(id);
    }

    async getUserInflowSummary(
    ) {
      return this.userService.getUserInflowSummary(id);
    }

    async getUserOutflowSummary(
    ) {
      return this.userService.getUserOutflowSummary(id);
    }

    async updateUserNewPhone(
    ) {
      return this.userService.updateUserAdress(newPhone);
    }

    async updateUserAddress(
    ) {
      return this.userService.updateUserAdress(newAdress);
    }
}

import { Injectable } from '@nestjs/common';
import { ClientService } from 'src/client/client.service';
import { CreateAccountDto } from '../auth/dto/auth.dto';

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
}

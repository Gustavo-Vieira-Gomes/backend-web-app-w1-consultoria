import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { userToReturnMapper } from 'src/utils/mappers/user-to-return.mapper';
import { ClientService } from 'src/client/client.service';
import { CreateAccountDto, LoginAccountDto } from './dto/auth.dto';
import { access } from 'fs';


type userJwtProps = {
    sub: string;
    email: string;
    name?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private readonly prisma: ClientService,
  ) {}

  async validateUser(email: string, password: string) {
    const account = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (account && (await bcrypt.compare(password, account.password_hash))) {
      return userToReturnMapper(account);
    }
    return;
  }

  async register(payload: CreateAccountDto) {
    const account = {
        ...payload,
        password: bcrypt.hashSync(payload.password, 10),
    };

    const emailExists = await this.prisma.user.findUnique({
      where: { email: account.email },
    });

    if (emailExists) throw new BadRequestException("Este Email já está cadastrado");

    const create = this.userService.create(account);

    if(!create)
        return HttpStatus.BAD_REQUEST;
    return HttpStatus.OK;
  }

  async login(payload: LoginAccountDto) {
    const account = await this.prisma.user.findUnique({
        where: { email: payload.email }
    });

    if(!account)
        throw new HttpException("Usuário não encontrado", HttpStatus.NOT_FOUND);

    const validateUser = await this.validateUser(payload.email, payload.password);

    if(!validateUser)
        throw new BadRequestException("Senha Inválida");

    const accountJwt: userJwtProps = {
        sub: account.id,
        email: account.email,
        name: account.name,
    };

    return {
        message: `Bem vindo ${account.name}`,
        accountId: account.id,
        type: account.userType,
        accessToken: this.jwtService.sign(accountJwt),
        refreshToken: this.jwtService.sign(accountJwt, { expiresIn: '60d' }),
    }
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { CreateAccountDto, LoginAccountDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ){}

    @Post('register')
    registerUser(@Body() payload: CreateAccountDto){
        return this.authService.register(payload);
    }

    @Post('login')
    loginUser(@Body() payload: LoginAccountDto){
        return this.authService.login(payload);
    }
}

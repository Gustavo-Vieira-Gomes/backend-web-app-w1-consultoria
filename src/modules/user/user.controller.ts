import { Body, Controller, Post, Get, Param, Put, Patch, UseInterceptors, UploadedFiles, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { ChangeUserPwdDto, UpdateUserDto } from "./dto/user.dto";
import { AddressDto } from "../asset/dto/asset.dto";
import { AnyFilesInterceptor, FilesInterceptor } from "@nestjs/platform-express";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get(':id')
    async getById(
        @Param('id') id: string
    ) {
        return this.userService.getById(id);
    }

    @Put(':id')
    @UseInterceptors(FilesInterceptor('files'))
    async updateUser(
        @Param('id') id: string,
        @Body() payload: UpdateUserDto,
        @UploadedFiles() files?: Express.Multer.File[]
    ) {
        return this.userService.updateUser(id, payload, files);
    }
    
    @Patch(':id')
    async deleteUser(
        @Param('id') id: string
    ) {
        return this.userService.deleteUser(id);
    }
  
    @Patch('password')
    async changeUserPassword(
        @Req() req,
        @Body() body: ChangeUserPwdDto
    ) {
      return this.userService.changeUserPassword(req.user.id, body);
    }

    @Get(':id')
    async getUserNetWorth(
      @Param('id') id: string
    ) {
      return this.userService.getUserNetWorth(id);
    }


    @Patch(':id/address')
    async updateUserAddress(
      @Param('id') id: string,
      @Body() newAdress: AddressDto
      //file?: Express.Multer.File
    ) {
      //return this.userService.updateUserAdress(newAdress);
    }

}

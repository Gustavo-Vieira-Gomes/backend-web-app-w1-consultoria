import { Body, Controller, Post, Get, Patch, Param, Req, Put, UseInterceptors, UploadedFile } from "@nestjs/common";
import { HeirService } from "./heir.service";
import { CreateHeirDto } from "./dto/heir.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('heir')
export class HeirController {
    constructor(private readonly heirService: HeirService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    create(
        @Req() req,
        @Body() payload: CreateHeirDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.heirService.createHeir(req.user.id, payload, file);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('file'))
    async updateHeir(
        @Param('id') id: string,
        @Body() payload: CreateHeirDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.heirService.updateHeir(id, payload, file);
    }

    @Put(':id/address')
    async updateHeirAddress(
        @Param('id') id: string,
        @Body() payload: any
    ) {
        return this.heirService.updateHeirAddress(id, payload);
    }

    @Get('user/:userId')
    async findAllByUserId(
        @Param('userId') userId: string
    ) {
        return this.heirService.findAllByUserId(userId);
    }

    @Get(':id')
    async findOneById(
        @Param('id') id: string,
    ) {
        return this.heirService.findOneById(id);
    }
}

import { Body, Controller, Post, Get, Put, Param } from "@nestjs/common";
import { HeirService } from "./heir.service";
import { CreateHeirDto, UpdateHeirDto } from "./dto/heir.dto";

@Controller('heir')
export class HeirController {
    constructor(private readonly heirService: HeirService) { }

    @Post()
    create(@Body() payload: CreateHeirDto) {
        return this.heirService.createHeir(payload);
    }

    @Put(':id')
    async updateHeir(
        @Param('id') id: string,
        @Body() payload: UpdateHeirDto
    ) {
        return this.heirService.updateHeir(id, payload);
    }

    @Get('user/:userId')
    async getAllHeirsByUser(
        @Param('userId') userId: string
    ) {
        return this.heirService.getAllHeirsByUser(userId);
    }

    @Get(':id')
    async getById(
        @Param('id') id: string,
    ) {
        return this.heirService.getHeirById(id);
    }
}

import { Body, Controller, Post, Get, Patch, Param } from "@nestjs/common";
import { HeirService } from "./heir.service";
import { CreateHeirDto, UpdateHeirDto } from "./dto/heir.dto";

@Controller('heir')
export class HeirController {
    constructor(private readonly heirService: HeirService) { }

    @Post()
    create(@Body() payload: CreateHeirDto) {
        return this.heirService.createHeir(payload);
    }

    @Patch(':id')
    async updateHeir(
        @Param('id') id: string,
        @Body() payload: UpdateHeirDto
    ) {
        return this.heirService.updateHeir(id, payload);
    }

    @Get('user/:userId')
    async findAllByUserId(
        @Param('userId') userId: string
    ) {
        return this.heirService.getAllHeirsByUser(userId);
    }

    @Get(':id')
    async findOneById(
        @Param('id') id: string,
    ) {
        return this.heirService.getHeirById(id);
    }
}

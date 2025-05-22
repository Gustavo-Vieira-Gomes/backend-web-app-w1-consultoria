import { Body, Controller, Post, Get, Put, Param } from "@nestjs/common";
import { HoldingService } from "./holding.service";
import { CreateHoldingDto, UpdateHoldingDto } from "./dto/holding.dto";

@Controller('holding')
export class HoldingController {
    constructor(private readonly holdingService: HoldingService) { }

    @Post()
    create(@Body() payload: CreateHoldingDto) {
        return this.holdingService.createHolding(payload);
    }

    @Put(':id')
    async updateHolding(
        @Param('id') id: string,
        @Body() payload: UpdateHoldingDto
    ) {
        return this.holdingService.updateHolding(id, payload);
    }

    @Get(':id')
    async getById(
        @Param('id') id: string,
    ) {
        return this.holdingService.getHoldingById(id);
    }

    @Get('user/:userId')
    async getAllByUserId(
        @Param('userId') userId: string
    ) {
        return this.holdingService.getAllHoldingsByUser(userId);
    }
}

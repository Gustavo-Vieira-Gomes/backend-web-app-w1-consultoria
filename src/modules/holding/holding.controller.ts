import { Body, Controller, Post, Get, Put, Param, Req } from "@nestjs/common";
import { HoldingService } from "./holding.service";
import { CreateHoldingDto, UpdateHoldingDto } from "./dto/holding.dto";

@Controller('holding')
export class HoldingController {
    constructor(private readonly holdingService: HoldingService) { }

    @Post()
    create(
        @Req() req,
        @Body() payload: CreateHoldingDto) {
        return this.holdingService.createHolding(req.user.id, payload);
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
        return this.holdingService.getById(id);
    }

    @Get('consultant/:id')
    async getAllByUserId(
        @Param('id') consultantId: string
    ) {
        return this.holdingService.getAllByConsultantId(consultantId);
    }
}

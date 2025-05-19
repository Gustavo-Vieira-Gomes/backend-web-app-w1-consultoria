import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { LiabilityService } from './liability.service';
import { LiabilityDto, UpdateLiabilityDto } from './dto/liability.dto';

@Controller('liability')
export class LiabilityController {
    constructor(private readonly liabilityService: LiabilityService) {}

    @Post()
    async createLiability(@Req() req, @Body() body: LiabilityDto) {
        return this.liabilityService.createLiability(req.user.id, body)
    }

    @Patch(':id')
    async updateLiability(@Param('id') id: string, @Body() body: UpdateLiabilityDto) {
        return this.liabilityService.updateLiability(id, body)
    }

    @Get(':id')
    async getLiabilityById(@Param('id') id: string) {
        return this.liabilityService.getLiabilityById(id)
    }

    @Get()
    async getAllLiabilitiesByUser(@Req() req, @Param('page') page: number = 1, @Param('limit') limit: number = 10) {
        return this.liabilityService.getAllLiabilitiesByUser(req.user.id, page, limit)
    }

    @Post(':id/softDelete')
    async softDeleteLiability(@Param('id') id: string) {
        return this.liabilityService.softDeleteLiability(id)
    }
}

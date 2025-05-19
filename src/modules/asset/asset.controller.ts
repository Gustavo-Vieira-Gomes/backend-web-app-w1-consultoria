import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AddressDto, AssetDto, updateAssetDto } from './dto/asset.dto';

@Controller('asset')
export class AssetController {
    constructor(private readonly assetService: AssetService) { }

    @Post()
    async createAsset(
        @Req() req,
        @Body() Body: AssetDto,
        file?: Express.Multer.File) {
        return this.assetService.createAsset(req.user.id, Body, file)
    }

    @Put(':id')
    async updateAsset(
        @Param('id') id: string,
        @Body() body: updateAssetDto,
        file?: Express.Multer.File) {
        return this.assetService.updateAsset(id, body, file)
    }

    @Put(':id/address')
    async updateAssetAddress(@Param('id') id: string, @Body() body: AddressDto) {
        return this.assetService.updateAssetAddress(id, body)
    }

    @Get(':id')
    async getAssetById(@Param('id') id: string) {
        return this.assetService.getAssetById(id)
    }

    @Get()
    async getAllAssetsByUser(@Req() req, @Param('page') page: number = 1, @Param('limit') limit: number = 10) {
        return this.assetService.getAllAssetsByUser(req.user.id, page, limit)
    }

    @Post('softDelete/:id')
    async softDeleteAsset(@Param('id') id: string) {
        return this.assetService.softDeleteAsset(id)
    }
}

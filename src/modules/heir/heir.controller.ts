import { Body, Controller, Post } from "@nestjs/common";
import { HeirService } from "./heir.service";
import { CreateHeirDto } from "./dto/heir.dto";

@Controller('heir')
export class HeirController {
    constructor(private readonly heirService: HeirService) { }

    @Post()
    create(@Body() payload: CreateHeirDto) {
        return this.heirService.createHeir(payload);
    }
}
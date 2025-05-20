import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getdashboard(@Req() req) {
    const [summary, byCategory, byLiquidity, history] = await Promise.all([
      this.appService.getSummary(req.user.id),
      this.appService.getAssetsByCategory(req.user.id),
      this.appService.getAssetByLiquidity(req.user.id),
      this.appService.getNetWorthHistory(req.user.id, 1, 10)
    ]);

    return {
      summary,
      charts: {
        byCategory,
        byLiquidity,
        history
      }
    }
  }
}

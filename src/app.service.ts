import { Injectable, Logger } from '@nestjs/common';
import { ClientService } from './client/client.service';
import { AssetService } from './modules/asset/asset.service';
import { LiabilityService } from './modules/liability/liability.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { skip } from 'rxjs';
import { paginated, skipOption } from './utils/pagination/pagination';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly clientService: ClientService) { }

  async getSummary(userId: string) {
    const [assets, liabilities] = await this.clientService.$transaction([
      this.clientService.asset.findMany({
        where: {
          user: {
            id: userId
          }
        }
      }),
      this.clientService.liability.findMany({
        where: {
          user: {
            id: userId
          }
        }
      })
    ]);

    const totalAssets = assets.reduce((acc, asset) => acc + asset.currentValue.toNumber(), 0);
    const totalLiabilities = liabilities.reduce((acc, liability) => acc + liability.currentValue.toNumber(), 0);
    const netWorth = totalAssets - totalLiabilities;
    const liquidAssets = assets.filter(a => a.liquidityLevel === 'high').reduce((acc, asset) => acc + asset.currentValue.toNumber(), 0);

    return { totalAssets, netWorth, liquidAssets };
  }

  async getAssetsByCategory(userId: string) {
    const assets = await this.clientService.asset.findMany({
      where: {
        user: {
          id: userId
        }
      }
    });

    const map = new Map<string, number>();

    for (const asset of assets) {
      map.set(asset.type, (map.get(asset.type) || 0) + asset.currentValue.toNumber());
    }

    return Array.from(map.entries()).map(([type, value]) => ({ type, value }));
  }

  async getAssetByLiquidity(userId: string) {
    const assets = await this.clientService.asset.findMany({
      where: {
        user: {
          id: userId
        }
      }
    });

    const map = new Map<string, number>();

    for (const asset of assets) {
      map.set(asset.liquidityLevel, (map.get(asset.liquidityLevel) || 0) + asset.currentValue.toNumber());
    }

    return Array.from(map.entries()).map(([type, value]) => ({ type, value }));
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async createMonthlySnapshots() {
    this.logger.log("Iniciando snapshots mensais");

    const users = await this.clientService.user.findMany({ select: { id: true } });

    const now = new Date();
    const month = new Date(now.getFullYear(), now.getMonth(), 1);

    for (const user of users) {
      const summary = await this.getSummary(user.id);

      await this.clientService.monthlySnapshot.create({
        data: {
          userId: user.id,
          month: month,
          totalAssets: summary.totalAssets,
          netWorth: summary.netWorth
        }
      });
    }

    this.logger.log("Snapshots mensais criados com sucesso");
  }

  async getHistoricalSnapshots(userId: string, page: number, limit: number) {

    const [snapshots, snapshotsCount] = await this.clientService.$transaction([
      this.clientService.monthlySnapshot.findMany(
        {
          where: { userId },
          skip: (skipOption(limit, page)),
          take: limit,
        }),
      this.clientService.monthlySnapshot.count({ where: { userId } })
    ])

    return paginated(snapshots, snapshotsCount, page, limit)
  }

  async getNetWorthHistory(userId: string, page: number, limit: number) {
    const snapshots = await this.getHistoricalSnapshots(userId, page, limit);

    return snapshots.data.map((snapshot: { month: Date; totalAssets: number; netWorth: number; }) => ({ month: snapshot.month, totalAssets: snapshot.totalAssets, netWorth: snapshot.netWorth }))
  }
}

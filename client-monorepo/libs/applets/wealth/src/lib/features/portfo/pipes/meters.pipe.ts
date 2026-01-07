import { IMeter } from '../models/meter.interface';
import { Pipe, PipeTransform } from '@angular/core';
import { PortfolioDetail } from '../../../data-access/models/portfolio-detail.model';

@Pipe({
  name: 'meters',
  standalone: true,
})
export class MetersPipe implements PipeTransform {
  transform(balance: number, asset: PortfolioDetail[]): IMeter[] {
    const items = asset ?? [];

    const priority: Record<string, number> = {
      Wallet: 1,
      Gold: 2,
      FixedIncome: 3,
      CrowdFund: 4,
    };

    // Totals by category
    const goldTotal = this.sumOf(items, (x) => x.type === 'Gold');
    const crowdTotal = this.sumOf(items, (x) => x.investmentType === 'CrowdFund');
    const walletTotal = this.sumOf(items, (x) => x.investmentType === 'Wallet');
    const walletSymbol = items.find((x) => x.investmentType === 'Wallet')?.symbol?.toLowerCase();

    // Percents by category
    const goldPercent = this.percentOfTotal(balance, goldTotal);
    const crowdPercent = this.percentOfTotal(balance, crowdTotal);
    const treasuryPercent = this.percentOfTotal(balance, walletTotal);

    // Fixed income is the remainder after known categories
    const knownTotal = goldTotal + crowdTotal + walletTotal;
    const fixedIncomePrice = this.clampPrice(balance - knownTotal);
    const fixedIncomePercent = this.percentOfTotal(balance, fixedIncomePrice);

    const assets: IMeter[] = [
      { type: 'FixedIncome', color: '#7A54F8', title: 'صندوق‌های درامد ثابت', percent: fixedIncomePercent, price: fixedIncomePrice },
      { type: 'Gold', color: '#FEC003', title: 'طلا', percent: goldPercent, price: goldTotal },
      { type: 'CrowdFund', color: '#3479FF', title: 'تامین مالی جمعی', percent: crowdPercent, price: crowdTotal },
      {
        type: 'Wallet',
        color: '#00C888',
        title: 'کیف ثروت',
        percent: treasuryPercent,
        price: walletTotal,
        symbol: walletSymbol ?? undefined,
      },
    ];

    const sortedAssets = assets.sort((a, b) => {
      if (a.price > 0 && b.price > 0) {
        return b.price - a.price;
      }
      if (a.price > 0) return -1;
      if (b.price > 0) return 1;
      return priority[a.type] - priority[b.type];
    });

    return sortedAssets;
  }

  private sumOf(assets: PortfolioDetail[], predicate: (x: PortfolioDetail) => boolean): number {
    return (assets ?? []).filter(predicate).reduce((sum, current) => sum + (current?.price ?? 0), 0);
  }

  private percentOfTotal(balance: number, total: number): number {
    if (!balance || balance <= 0) return 0;
    const value = (total / balance) * 100;
    return this.clamp(Math.round(value * 100) / 100);
  }

  private clamp(value: number, min = 0, max = 100): number {
    if (Number.isNaN(value)) return 0;
    return Math.min(max, Math.max(min, value));
  }

  private clampPrice(value: number): number {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, value);
  }
}

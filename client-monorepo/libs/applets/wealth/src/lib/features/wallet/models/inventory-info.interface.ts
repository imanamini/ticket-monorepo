import { IFundPortfolioChart, IFundPortfolioGoldChart } from '../../funds/models/fund-chart.model';

export interface IInventoryInfo {
  chart?: {
    data?: IFundPortfolioChart & Partial<IFundPortfolioGoldChart>;
    preferredColors?: string[];
  };
  profitPercents?: string;
  whithfrowalBalance?: number;
  uncollectibleInvestory?: number;
  totalBalance?: number;
  hasProfit?: boolean;
  profit?: number;
}

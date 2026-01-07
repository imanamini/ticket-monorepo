import { FundsType } from './types';

export interface IFundDetail {
  id: number;
  purchaseNav: number;
  displayOrder: number;
  netAsset: number;
  statisticNav: number;
  saleNav: number;
  dailyEfficiency: number;
  weekleyEfficiency: number;
  quarterlyEfficiency: number;
  sixMonthEfficiency: number;
  minBuyableAmount: number;
  maxBuyableAmount: number;
  thumbnailLogoAddress: string;
  title: string;
  symbol: string;
  displaySymbol: string;
  type: FundsType;
  investmentType: string;
  latestNavUpdate: string;
  riskLevel: string;
  liquidityPolicy: string;
  dividendPeriod: string;
  contractLink: string;
  monthlyEfficiency: string;
  annualEfficiency: string;
  dividendDescription: string;
  compoundProfit: string;
  website: string;
  expectedProfit: string;
  oldName: string;
  buyable: boolean;
  sellable: boolean;
}

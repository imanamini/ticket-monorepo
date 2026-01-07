import { FundsInvestmentType, FundsProfitType, FundsType, FundsRiskLevel } from './types';

export interface IFundList {
  title: string;
  symbol: string;
  profit: string;
  type: FundsType;
  buyable: boolean;
  sellable: boolean;
  riskLevel: FundsRiskLevel;
  displaySymbol: string;
  expectedProfit: string;
  dividendPeriod: string;
  profitType: FundsProfitType;
  dividendPeriodProfit: string;
  thumbnailLogoAddress: string;
  investmentType: FundsInvestmentType;
}

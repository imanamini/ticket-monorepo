import { FundsInvestmentType, FundsType } from '../fund-schemas';

export interface IPortfolio {
  type: FundsType;
  title: string;
  price: number;
  symbol: string;
  quantity: number;
  logoAddress: string;
  lastUpdatedAt: string;
  investmentType: FundsInvestmentType;
}

export interface IPortfolios {
  balance: number;
  portfolios: IPortfolio[];
}

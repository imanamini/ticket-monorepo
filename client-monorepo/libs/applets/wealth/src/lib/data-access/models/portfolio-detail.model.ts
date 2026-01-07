import { FundsType } from '../../components/core/models/fund-schemas';

export interface PortfolioDetail {
  title: string;
  symbol: string;
  quantity: number;
  price: number;
  lastUpdatedAt: string;
  logoAddress?: string;
  investmentType: string;
  type?: FundsType;
}

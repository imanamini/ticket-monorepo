import { FundsType } from '../../../components/core/models/fund-schemas';

export type PriceUnitSectionType = 'BUY' | 'SELL';

export interface IPriceUnitProps {
  title: string;
  type: FundsType;
  sectionType: PriceUnitSectionType;
  customerPortfolioUnit: number;
  purchaseNav: number;
  sellNav: number;
  description: string;
}

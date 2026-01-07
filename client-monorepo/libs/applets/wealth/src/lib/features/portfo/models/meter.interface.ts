import { FundsType } from '../../../components/core/models/fund-schemas';

export interface IMeter {
  color: string;
  title: string;
  percent: number;
  price: number;
  type: FundsType;
  symbol?: string;
}

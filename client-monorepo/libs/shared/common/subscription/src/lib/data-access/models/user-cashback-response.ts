import { SERVICES_TYPE } from './services-type.model';

export interface UserCashbackResponse {
  caps: CashbackData[];
}

export interface CashbackData {
  type: SERVICES_TYPE;
  totalCount: number;
  usedCount: number;
  totalPrice: number;
  usedPrice: number;
}

import { CardType } from '@client-monorepo/daily-fintech/bank-card';

export interface CheckCardRequest {
  prefix: string;
  postfix: string;

  panType?: CardType;
  amount?: number;
  cardIndex?: string;
}

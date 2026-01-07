import { CardType } from '@client-monorepo/daily-fintech/bank-card';

export interface CardVerifyRequest {
  nationalCode?: string;
  pan: {
    value: string;
    type: CardType;
    prefix: string;
    postfix: string;
  };
  targetPan: {
    value: string;
    type: CardType;
    prefix: string;
    postfix: string;
  };
  amount?: number;
}

import { CardCtaTypes } from '../constants/card-cta-types.const';
import { CardActionOverview } from '@client-monorepo/payment/card-data';

export interface AllCardsArrayModel {
  cardsType: CardCtaTypes;
  cards: CardActionOverview[];
  order: number;
}

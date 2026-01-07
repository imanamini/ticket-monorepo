import { CardActionOverview } from '@client-monorepo/payment/card-data';
import { CardCtaTypes } from '../constants/card-cta-types.const';

export type AllCardsModel = {
  [key in CardCtaTypes]: CardActionOverview[];
};

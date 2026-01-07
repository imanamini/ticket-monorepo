import { Action, ActionType } from '@client-monorepo/common/action-handler';
import { FrequentServicesIdEnum } from '@client-monorepo/common/service-data';

export enum CardCtaTypes {
  WALLET = 'wallet',
  CREDIT = 'credit',
  BANK_CARDS = 'bank_cards',
  BNPL = 'bnpl',
  DP_CARD = 'dp_card',
}

export const CtaCardsOrderMapper: Record<CardCtaTypes, number> = {
  [CardCtaTypes.BNPL]: 1,
  [CardCtaTypes.BANK_CARDS]: 5,
  [CardCtaTypes.CREDIT]: 4,
  [CardCtaTypes.WALLET]: 2,
  [CardCtaTypes.DP_CARD]: 3,
};
export const CardTitlesItemsMap: Record<CardCtaTypes, string> = {
  [CardCtaTypes.BNPL]: 'خرید اعتباری',
  [CardCtaTypes.BANK_CARDS]: 'کارت‌های بانکی',
  [CardCtaTypes.CREDIT]: 'وام‌ها',
  [CardCtaTypes.WALLET]: 'کیف پول',
  [CardCtaTypes.DP_CARD]: 'کیف من',
};

export const CardActionMapper: Record<CardCtaTypes, Action> = {
  [CardCtaTypes.BNPL]: {
    type: ActionType.GO_TO_SERVICE,
    payload: {
      serviceId: FrequentServicesIdEnum.BNPL,
    },
  },
  [CardCtaTypes.BANK_CARDS]: {
    type: ActionType.GO_TO_SERVICE,
    payload: {
      serviceId: FrequentServicesIdEnum.C2C,
    },
  },
  [CardCtaTypes.CREDIT]: {
    type: ActionType.GO_TO_SERVICE,
    payload: {
      serviceId: FrequentServicesIdEnum.CREDIT,
    },
  },
  [CardCtaTypes.WALLET]: {
    type: ActionType.GO_TO_SERVICE,
    payload: {
      serviceId: FrequentServicesIdEnum.WALLET,
    },
  },
  [CardCtaTypes.DP_CARD]: {
    type: ActionType.GO_TO_SERVICE,
    payload: {
      serviceId: FrequentServicesIdEnum.WALLET,
    },
  },
};

import { CardCtaItems } from '../models/cards-cta-items.model';
import { ActionType } from '@client-monorepo/common/action-handler';
import { StatusLightBordersEnum, StatusLightColorsEnum, StatusLightSizesEnum } from '@client-monorepo/common/ui-components';
import { FrequentServicesIdEnum } from '@client-monorepo/common/service-data';
import { CallbackInstallmentsOverviewKey } from '@client-monorepo/applets/credit';

export enum CardCtaItemType {
  C2C = 'C2C',
  ADD_CARD = 'ADD_CARD',
  QR = 'QR',
  BARCODE_BUY = 'BARCODE_BUY',
  DETAILS = 'DETAILS',
  CONNECT_CARD_TO_CREDIT = 'CONNECT_CARD_TO_CREDIT',
  MANAGE_CARDS = 'MANAGE_CARDS',
  MY_CARDS = 'MY_CARDS',
  INSTALLMENT = 'INSTALLMENT',
  BNPL_INSTALLMENT = 'BNPL_INSTALLMENT',
  STORES = 'STORES',
  CASH_IN = 'CASH_IN',
  CASH_OUT = 'CASH_OUT',
  ADD_GIFT_CARD = 'ADD_GIFT_CARD',
  TRANSFER = 'TRANSFER',
  MORE = 'MORE',
  ACTIVE_DP_CARD = 'ACTIVE_DP_CARD',
  INSTRUCTIONS_DP_CARD = 'INSTRUCTIONS_DP_CARD',
  PASSWORD_SETTING_DP_CARD = 'PASSWORD_SETTING_DP_CARD',
  CARD_BLOCK_DP_CARD = 'CARD_BLOCK_DP_CARD',
  REISSUE_DP_CARD = 'REISSUE_DP_CARD',
  UNBLOCKING_DP_CARD = 'UNBLOCKING_DP_CARD',
  ATTACHMENT_DP_CARD = 'ATTACHMENT_DP_CARD',
  SUPPORT = 'SUPPORT',
}

export const CardCtaItemTitleMapper: Record<CardCtaItemType, string> = {
  [CardCtaItemType.C2C]: 'کارت‌به‌کارت',
  [CardCtaItemType.ADD_CARD]: 'افزودن کارت',
  [CardCtaItemType.QR]: 'بارکد‌خوان',
  [CardCtaItemType.DETAILS]: 'جزییات',
  [CardCtaItemType.BARCODE_BUY]: 'خرید با بارکد',
  [CardCtaItemType.MANAGE_CARDS]: 'مدیریت کارت‌ها',
  [CardCtaItemType.MY_CARDS]: 'کارت‌های‌من',
  [CardCtaItemType.CONNECT_CARD_TO_CREDIT]: 'اتصال به وام',
  [CardCtaItemType.INSTALLMENT]: 'اقساط',
  [CardCtaItemType.BNPL_INSTALLMENT]: 'اقساط',
  [CardCtaItemType.STORES]: 'فروشگاه‌ها',
  [CardCtaItemType.CASH_IN]: 'واریز',
  [CardCtaItemType.CASH_OUT]: 'برداشت',
  [CardCtaItemType.ADD_GIFT_CARD]: 'افزودن کد هدیه',
  [CardCtaItemType.TRANSFER]: 'انتقال',
  [CardCtaItemType.MORE]: 'بیشتر',
  [CardCtaItemType.ACTIVE_DP_CARD]: 'فعال‌سازی کارت',
  [CardCtaItemType.INSTRUCTIONS_DP_CARD]: 'راهنمای دیجی کارت',
  [CardCtaItemType.PASSWORD_SETTING_DP_CARD]: 'تنظیمات رمز',
  [CardCtaItemType.CARD_BLOCK_DP_CARD]: 'مسدود سازی',
  [CardCtaItemType.REISSUE_DP_CARD]: 'صدور مجدد',
  [CardCtaItemType.UNBLOCKING_DP_CARD]: 'رفع مسدودی',
  [CardCtaItemType.ATTACHMENT_DP_CARD]: 'درخواست کارت',
  [CardCtaItemType.SUPPORT]: 'پشتیبانی',
};

export const CardCtaItemMapper: Record<CardCtaItemType, CardCtaItems> = {
  [CardCtaItemType.C2C]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.C2C],
    icon: {
      name: 'card-to-card',
      type: 'linear',
    },
    action: {
      type: ActionType.GO_TO_C2C,
      payload: {
        cardNumber: '',
      },
    },
    isHighlighted: true,
    isDisabled: false,
    hasNotification: false,
    hasChildren: false,
  },
  [CardCtaItemType.ADD_CARD]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.ADD_CARD],
    icon: {
      name: 'Bank-Card',
      type: 'linear',
    },
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'profile/saved-cards/add/source',
      },
    },
    isHighlighted: false,
    isDisabled: false,
    hasNotification: false,
    hasChildren: false,
  },
  [CardCtaItemType.QR]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.QR],
    icon: {
      name: 'qr-scan',
      type: 'linear',
      secondColor: '#4c4c4c',
    },
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'qr',
      },
    },
    isHighlighted: false,
    hasNotification: false,
    isDisabled: false,
    hasChildren: false,
  },
  [CardCtaItemType.BARCODE_BUY]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.BARCODE_BUY],
    icon: {
      name: 'barcode-scan',
      type: 'linear',
      secondColor: '#4c4c4c',
    },
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'barcode',
      },
    },
    isHighlighted: false,
    hasNotification: false,
    isDisabled: false,
    hasChildren: false,
  },
  [CardCtaItemType.DETAILS]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.DETAILS],
    icon: {
      name: 'Info-menu',
      type: 'linear',
      secondColor: '#4c4c4c',
    },
    action: {
      type: ActionType.GO_TO_SERVICE,
      payload: {
        serviceId: FrequentServicesIdEnum.C2C,
      },
    },
    isHighlighted: false,
    hasNotification: false,
    isDisabled: false,
    hasChildren: false,
  },
  [CardCtaItemType.CONNECT_CARD_TO_CREDIT]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.CONNECT_CARD_TO_CREDIT],
    icon: {
      name: 'link',
      type: 'linear',
      secondColor: '#4c4c4c',
    },
    isHighlighted: false,
    isDisabled: false,
    hasNotification: false,
    hasChildren: false,
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'profile/saved-cards',
      },
    },
  },
  [CardCtaItemType.MANAGE_CARDS]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.MANAGE_CARDS],
    icon: {
      name: 'Info-menu',
      type: 'linear',
      secondColor: '#4c4c4c',
    },
    isHighlighted: false,
    isDisabled: false,
    hasNotification: false,
    hasChildren: false,
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'profile/saved-cards',
      },
    },
  },
  [CardCtaItemType.MY_CARDS]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.MY_CARDS],
    icon: {
      name: 'Info-menu',
      type: 'linear',
      secondColor: '#4c4c4c',
    },
    isHighlighted: false,
    isDisabled: false,
    hasNotification: false,
    hasChildren: false,
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'profile/saved-cards',
      },
    },
  },
  [CardCtaItemType.INSTALLMENT]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.INSTALLMENT],
    icon: {
      name: 'Calendar',
      type: 'linear',
    },
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'service/credit/installments-overview',
        params: {
          serviceType: 'credit',
          rfr: 'inst-btn',
          closeServiceUrl: window.location.pathname,
        },
      },
    },
    isHighlighted: false,
    hasNotification: false,
    isDisabled: false,
    notification: {
      size: StatusLightSizesEnum.TWELVE,
      color: StatusLightColorsEnum.RED,
      border: StatusLightBordersEnum.WHITE,
    },
    hasChildren: false,
  },
  [CardCtaItemType.BNPL_INSTALLMENT]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.BNPL_INSTALLMENT],
    icon: {
      name: 'Calendar',
      type: 'linear',
    },
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'service/credit/installments-overview',
        params: {
          serviceType: 'bnpl',
          rfr: 'inst-btn',
          [CallbackInstallmentsOverviewKey]: encodeURIComponent('/transactions'),
          closeServiceUrl: window.location.pathname,
        },
      },
    },
    isHighlighted: false,
    hasNotification: false,
    isDisabled: false,
    notification: {
      size: StatusLightSizesEnum.TWELVE,
      color: StatusLightColorsEnum.RED,
      border: StatusLightBordersEnum.WHITE,
    },
    hasChildren: false,
  },
  [CardCtaItemType.STORES]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.STORES],
    icon: {
      name: 'Bag',
      type: 'linear',
    },
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'stores',
      },
    },
    isHighlighted: false,
    hasNotification: false,
    isDisabled: false,
    hasChildren: false,
  },
  [CardCtaItemType.CASH_IN]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.CASH_IN],
    icon: {
      name: 'Plus',
      type: 'linear',
    },
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'cash-in',
      },
    },
    isHighlighted: true,
    hasNotification: false,
    isDisabled: false,
    hasChildren: false,
  },
  [CardCtaItemType.CASH_OUT]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.CASH_OUT],
    icon: {
      name: 'Arrow-up',
      type: 'linear',
    },
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'cash-out',
      },
    },
    isHighlighted: false,
    hasNotification: false,
    isDisabled: false,
    hasChildren: false,
  },
  [CardCtaItemType.ADD_GIFT_CARD]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.ADD_GIFT_CARD],
    icon: {
      name: 'gift',
      type: 'linear',
      secondColor: '#4c4c4c',
    },
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'wallet-management',
      },
    },
    isHighlighted: false,
    hasNotification: false,
    isDisabled: false,
    hasChildren: false,
  },
  [CardCtaItemType.TRANSFER]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.TRANSFER],
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'cash-out',
      },
    },
    icon: {
      name: 'Arrow-up',

      type: 'linear',
      secondColor: '#4c4c4c',
    },
    isHighlighted: false,
    hasNotification: false,
    isDisabled: false,
    hasChildren: false,
  },
  [CardCtaItemType.MORE]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.MORE],
    icon: {
      name: 'Info-menu',
      type: 'linear',
      secondColor: '#4c4c4c',
    },
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: '/',
      },
    },
    isHighlighted: false,
    hasNotification: false,
    isDisabled: false,
    hasChildren: false,
  },
  [CardCtaItemType.ACTIVE_DP_CARD]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.ACTIVE_DP_CARD],
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'card/activation',
      },
    },
    icon: {
      name: 'bank-card-check',
      type: 'linear',
      secondColor: '#4c4c4c',
    },
    isHighlighted: false,
    hasNotification: false,
    isDisabled: false,
    hasChildren: false,
  },
  [CardCtaItemType.INSTRUCTIONS_DP_CARD]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.INSTRUCTIONS_DP_CARD],
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'card/instructions',
      },
    },
    icon: {
      name: 'question-mark-circle',
      type: 'linear',
      secondColor: '#4c4c4c',
    },
    isHighlighted: false,
    hasNotification: false,
    isDisabled: false,
    hasChildren: false,
  },
  [CardCtaItemType.PASSWORD_SETTING_DP_CARD]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.PASSWORD_SETTING_DP_CARD],
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'card/password-settings',
      },
    },
    icon: {
      name: 'shield-lock',
      type: 'linear',
      secondColor: '#4c4c4c',
    },
    isHighlighted: false,
    hasNotification: false,
    isDisabled: false,
    hasChildren: false,
  },
  [CardCtaItemType.CARD_BLOCK_DP_CARD]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.CARD_BLOCK_DP_CARD],
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'card/blocking',
      },
    },
    icon: {
      name: 'bank-card-remove',
      type: 'linear',
      secondColor: '#4c4c4c',
    },
    isHighlighted: false,
    hasNotification: false,
    isDisabled: false,
    hasChildren: false,
  },
  [CardCtaItemType.REISSUE_DP_CARD]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.REISSUE_DP_CARD],
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'card/issuance',
      },
    },
    icon: {
      name: 'bank-card-2',
      type: 'linear',
      secondColor: '#4c4c4c',
    },
    isHighlighted: false,
    hasNotification: false,
    isDisabled: false,
    hasChildren: false,
  },
  [CardCtaItemType.UNBLOCKING_DP_CARD]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.UNBLOCKING_DP_CARD],
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'card/unblocking',
      },
    },
    icon: {
      name: 'bank-card-check',
      type: 'linear',
      secondColor: '#4c4c4c',
    },
    isHighlighted: false,
    hasNotification: false,
    isDisabled: false,
    hasChildren: false,
  },
  [CardCtaItemType.ATTACHMENT_DP_CARD]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.ATTACHMENT_DP_CARD],
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'card/attachment',
      },
    },
    icon: {
      name: 'bank-card-2',
      type: 'linear',
      secondColor: '#4c4c4c',
    },
    isHighlighted: false,
    hasNotification: false,
    isDisabled: false,
    hasChildren: false,
  },
  [CardCtaItemType.SUPPORT]: {
    name: CardCtaItemTitleMapper[CardCtaItemType.SUPPORT],
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'support',
      },
    },
    icon: {
      name: 'headphone',
      type: 'linear',
      secondColor: '#4c4c4c',
    },
    isHighlighted: false,
    hasNotification: false,
    isDisabled: false,
    hasChildren: false,
  },
};

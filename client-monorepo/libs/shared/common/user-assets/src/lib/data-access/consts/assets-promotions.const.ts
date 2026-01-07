import { ActionType } from '@client-monorepo/common/action-handler';
import { AssetTypes } from '@client-monorepo/common/user-assets';
import { AssetPromotionInterface } from '../models/asset-promotion.interface';

const isBrowser = typeof window !== 'undefined';

// Function to get the current path safely
const getCloseServiceUrl = (): string => (isBrowser ? window.location.pathname : '');

export const ASSETS_PROMOTIONS: Partial<Record<AssetTypes, AssetPromotionInterface>> = {
  // [AssetTypes.BNPL_1PAY]: {
  //   type: AssetTypes.BNPL_1PAY,
  //   icon: 'bnpl',
  //   title: 'دریافت اعتبار ماهانه',
  //   description: 'با دریافت اعتبار، همین حالا از مزایای خرید اعتباری استفاده کنید.',
  //   action: {
  //     type: ActionType.REDIRECT,
  //     payload: {
  //       url: 'service/bnpl/pre-register',
  //     },
  //   },
  //   order: 3,
  // iconColor: '#925DFD',
  // iconType: 'due',
  // },
  [AssetTypes.BNPL_4PAY]: {
    type: AssetTypes.BNPL_4PAY,
    icon: 'bnpl',
    title: 'دریافت اعتبار دیجی‌‌پی',
    description: 'با اعتبار دیجی‌پی، سریع و راحت، الان بخر بعداً پرداخت کن!',
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'service/bnpl/pre-register',
      },
    },
    order: 1,
    iconColor: '#925DFD',
    iconType: 'due',
  },
  [AssetTypes.CREDIT]: {
    type: AssetTypes.CREDIT,
    icon: 'credit',
    title: 'دریافت وام',
    description: 'تا ۱۰۰ میلیون تومان وام برای خرید کالا از هزاران فروشگاه، بدون ضامن و سپرده',
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'service/credit/resolve',
        params: {
          closeServiceUrl: getCloseServiceUrl(),
        },
      },
    },
    order: 2,
    iconColor: '#925DFD',
    iconType: 'due',
  },
};

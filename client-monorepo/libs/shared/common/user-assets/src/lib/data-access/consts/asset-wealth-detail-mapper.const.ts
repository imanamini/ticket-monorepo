import { FundTypeNames } from './fund-type-names';
import { AssetSubtitleType, ModifiedAsset } from '../models/modified-asset.interface';
import { ActionType } from '@client-monorepo/common/action-handler';

export const ASSET_WEALTH_DETAIL_MAPPER: Record<any, Omit<ModifiedAsset, 'balance' | 'status' | 'type'>> = {
  [FundTypeNames.FIXED_INCOME]: {
    id: FundTypeNames.FIXED_INCOME,
    title: 'صندوق‌های درآمد ثابت',
    subtitle: '',
    subtitleType: AssetSubtitleType.PRICE,
    icon: 'chart-three-line',
    primaryColor: '#00C958',
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'mini-app/wealth/portfo',
        params: {
          referrer: 'dpxapp',
          utm_medium: 'Assets-Details-Portfo',
          utm_source: 'hub',
        },
      },
    },
  },
  [FundTypeNames.CROWD_FUND]: {
    id: FundTypeNames.CROWD_FUND,
    title: 'تامین مالی جمعی',
    subtitle: '',
    subtitleType: AssetSubtitleType.PRICE,
    icon: 'Crowd-funding',
    primaryColor: '#00C958',
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'mini-app/wealth/portfo',
        params: {
          referrer: 'dpxapp',
          utm_medium: 'Assets-Details-Portfo',
          utm_source: 'hub',
        },
      },
    },
  },
  [FundTypeNames.INDEX]: {
    id: FundTypeNames.INDEX,
    title: 'صندوق‌های شاخصی',
    subtitle: '',
    subtitleType: AssetSubtitleType.PRICE,
    icon: 'bar-chart-upward',
    primaryColor: '#00C958',
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'mini-app/wealth/portfo',
        params: {
          referrer: 'dpxapp',
          utm_medium: 'Assets-Details-Portfo',
          utm_source: 'hub',
        },
      },
    },
  },
  [FundTypeNames.GOLD]: {
    id: FundTypeNames.GOLD,
    title: 'صندوق‌های مبتنی بر طلا',
    subtitle: '',
    subtitleType: AssetSubtitleType.PRICE,
    icon: 'golds',
    primaryColor: '#00C958',
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'mini-app/wealth/portfo',
        params: {
          referrer: 'dpxapp',
          utm_medium: 'Assets-Details-Portfo',
          utm_source: 'hub',
        },
      },
    },
  },
  [FundTypeNames.WALLET]: {
    id: FundTypeNames.WALLET,
    title: 'کیف ثروت',
    subtitle: '',
    subtitleType: AssetSubtitleType.PRICE,
    icon: 'bag-of-wealth',
    primaryColor: '#00C958',
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: 'mini-app/wealth/wallets/treasury',
        params: {
          referrer: 'dpxapp',
          utm_medium: 'Assets-Details-Portfo',
          utm_source: 'hub',
        },
      },
    },
  },
};

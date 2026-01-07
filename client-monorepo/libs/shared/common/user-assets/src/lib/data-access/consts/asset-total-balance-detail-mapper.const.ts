import { ActionType } from '@client-monorepo/common/action-handler';
import { AssetTypes } from '@client-monorepo/common/user-assets';
import { AssetSubtitleType, ModifiedAsset } from '../models/modified-asset.interface';

export const ASSET_TOTAL_BALANCE_DETAIL_MAPPER: Record<any, Omit<ModifiedAsset, 'balance' | 'status' | 'type'>> = {
  [AssetTypes.BNPL_1PAY]: {
    id: AssetTypes.BNPL_1PAY,
    title: 'اعتبار ماهانه',
    subtitle: '',
    subtitleType: AssetSubtitleType.PRICE,
    icon: 'bnpl',
    primaryColor: '#7347EB',
  },
  [AssetTypes.BNPL_4PAY]: {
    id: AssetTypes.BNPL_4PAY,
    title: 'اعتبار 4 قسطه',
    subtitle: '',
    subtitleType: AssetSubtitleType.PRICE,
    icon: 'bnpl',
    primaryColor: '#7347EB',
  },
  [AssetTypes.CREDIT]: {
    id: AssetTypes.CREDIT,
    title: 'وام',
    subtitle: '',
    subtitleType: AssetSubtitleType.PRICE,
    icon: 'credit',
    primaryColor: '#7347EB',
  },
  [AssetTypes.WALLET]: {
    id: AssetTypes.WALLET,
    title: 'کیف پول',
    subtitle: '',
    subtitleType: AssetSubtitleType.PRICE,
    icon: 'wallet',
    primaryColor: '#3479FF',
    action: {
      type: ActionType.REDIRECT,
      payload: {
        url: '/wallet-management',
      },
    },
  },
};

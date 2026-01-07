import { UserAssetModel } from '@client-monorepo/common/user-assets';
import { Action } from '@client-monorepo/common/action-handler';

export interface ModifiedAsset extends UserAssetModel {
  id: string;
  title: string;
  balance: number;
  subtitle: string | number;
  subtitleType: AssetSubtitleType;
  subtitleColor?: string;
  icon: string;
  primaryColor: string;
  actionText?: string;
  action?: Action;
  isDisabled?: boolean;
}

export enum AssetSubtitleType {
  TEXT = 'text',
  PRICE = 'price',
}

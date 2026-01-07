import { AssetTypes } from '@client-monorepo/common/user-assets';
import { Action } from '@client-monorepo/common/action-handler';

export interface AssetPromotionInterface {
  type: AssetTypes;
  icon?: string;
  title: string;
  description: string;
  action: Action;
  order: number;
  iconColor: string;
  iconType: 'linear' | 'bold' | 'due';
}

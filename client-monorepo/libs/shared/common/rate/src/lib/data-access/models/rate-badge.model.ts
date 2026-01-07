import { FramedIconGradientModel } from '@client-monorepo/common/ui-components';

export interface RateBadgeModel {
  icon: string;
  title: string;
  iconType: 'linear' | 'bold' | 'due';
  active: boolean;
  style: string;
  gradient: FramedIconGradientModel;
}

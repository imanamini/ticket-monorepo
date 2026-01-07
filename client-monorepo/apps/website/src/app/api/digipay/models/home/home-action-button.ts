import { HomeStatus } from './home-status';

export interface HomeActionButton {
  imageId?: string;
  value: string;
  textColor: string;
  status: HomeStatus;
  featureName?: string;
}

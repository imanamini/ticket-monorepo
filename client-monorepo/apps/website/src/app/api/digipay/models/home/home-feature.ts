import { HomeFeatureBadge } from './home-feature-badge';

export interface HomeFeature {
  uid: string;
  name: string;
  featureName: string;
  group: number;
  badges: HomeFeatureBadge[];
  fireBaseEvent?: string;
  xtremePushEvent?: string;
  insiderEvent?: string;
  status: {
    value: number;
    message?: string;
  };
  imageId: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  url?: string;
}

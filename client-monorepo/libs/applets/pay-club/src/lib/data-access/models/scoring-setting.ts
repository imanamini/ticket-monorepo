import { GenericApiResponse } from '@client-monorepo/common/network';

export interface ScoringSettingResponse extends GenericApiResponse {
  clubLandingUrl: string;
  description: any;
  headerImg: string;
  items: ScoringItem[];
}

export interface ScoringItem {
  icon: string;
  text: string;
  description: string;
  point: string;
  color: number[];
  featureName: string;
  action: number;
  url?: string;
}

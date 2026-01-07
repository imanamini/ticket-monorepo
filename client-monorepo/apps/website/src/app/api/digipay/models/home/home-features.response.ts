import { HomeFeature } from './home-feature';
import { HomeFeatureSettings } from './home-feature-settings';
import { BaseApiResponse } from '../base-api.response';

export interface HomeFeaturesResponse extends BaseApiResponse {
  features: HomeFeature[];
  setting: HomeFeatureSettings;
}

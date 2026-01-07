import { LandingConfig } from './landing-config';
import { BaseApiResponse } from '../../../../../digipay/models/base-api.response';

export interface CampaignConfigResponse extends BaseApiResponse {
  landingConfig: LandingConfig;
}

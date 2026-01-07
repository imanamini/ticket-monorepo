import { GenericApiResponse } from '@client-monorepo/common/network';
import { FineLandingConfig, FineUser } from './fine-landing-config';
import { Plate } from '@client-monorepo/daily-fintech/vehicle-data';

export interface FineConfigResponse extends GenericApiResponse {
  landingConfig: FineLandingConfig;
  plateDetails: Plate[];
  user: FineUser;
}

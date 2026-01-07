import { CampaignCapDetail } from './campaign-cap-detail';
import { BaseApiResponse } from '../../../../../digipay/models/base-api.response';

export interface CampaignCapResponse extends BaseApiResponse {
  capDetail: CampaignCapDetail;
}

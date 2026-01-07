import { ApiResultInfo } from './api-result-info';
import { IdentityInfo } from './identity-info.model';

export interface InquiryResponse extends ApiResultInfo {
  IdentityInfo: IdentityInfo;
}

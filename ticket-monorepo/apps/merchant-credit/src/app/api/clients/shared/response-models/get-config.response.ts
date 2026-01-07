import { CancelReason } from '../basic-models/cancel-reason';
import { BaseApiResponse } from '../../../models/base-api.response';

export interface GetConfigResponse extends BaseApiResponse {
  cancelReasons: CancelReason[];
}

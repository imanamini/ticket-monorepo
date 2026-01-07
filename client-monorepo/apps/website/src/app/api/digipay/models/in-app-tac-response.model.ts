import { Feature } from './feature.model';
import { ApiResult } from './api-result.model';

export interface InAppTacResponse {
  result: ApiResult;
  shouldAcceptTac: boolean;
  tacUrl: string;
  userDetail: {
    userId: string;
    cellNumber: string;
    active: boolean;
  };
  features: {
    [key: string]: Feature;
  };
  gateways: Array<number>;
  transactionType?: number;
}

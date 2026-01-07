import { BaseApiResponse } from '../base-api.response';
import { Feature } from './feature';

export interface InAppTacResponse extends BaseApiResponse {
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

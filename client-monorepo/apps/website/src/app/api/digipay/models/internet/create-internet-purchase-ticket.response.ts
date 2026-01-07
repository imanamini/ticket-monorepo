import { BaseApiResponse } from '../base-api.response';
import { OperatorIds } from '../carrier/operator-ids';

export interface CreateInternetPurchaseTicketResponse extends BaseApiResponse {
  payUrl: string;
  fallbackUrl: string;
  ticket: string;
  topUpInfo: {
    feeCharge: number;
    name: string;
    expirationDate: number;
    creationDate: number;
    targetedCellNumber: string;
    productCode: string;
    operatorId: OperatorIds;
    trackingCode: string;
    internetPackage: {
      amount: number;
      duration: number;
      description: string;
      durationDescription: string;
      bundleId: string;
    };
    imageId: string;
    type: number;
    description: string;
    topUpDescription: string;
    ownerSide: number;
    status: number;
    businessName: string;
  };
}

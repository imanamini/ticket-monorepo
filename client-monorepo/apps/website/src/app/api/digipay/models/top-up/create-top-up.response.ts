import { BaseApiResponse } from '../base-api.response';
import { OperatorIds } from '../carrier/operator-ids';
import { TOP_UP_CHARGE_TYPES } from './top-up-types';

export interface CreateTopUpResponse extends BaseApiResponse {
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
    chargePackage: {
      amount: number;
    };
    chargeType: TOP_UP_CHARGE_TYPES;
    imageId: string;
    type: number;
    description: string;
    topUpDescription: string;
    ownerSide: number;
    status: number;
    businessName: string;
  };
}

import { BaseApiResponse } from '../../models/base-api.response';

export interface GetProfileResponse extends BaseApiResponse {
  merchant: Merchant;
}

export interface Merchant {
  registrationId: string,
  creditId: string,
  businessId: string,
  merchantName: string,
  nationalCode: string,
  creationDate: Date,
  type: number,
  state: number,
  status: number,
  providerId: string,
  cellNumber: string,
  registerCellNumber: string,
  fundProvider: string
}

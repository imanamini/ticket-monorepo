import { GenericApiResponse } from '../../generic-api-response.model';

export interface GetChequeOwnerAddressResponse extends GenericApiResponse {
  address: string;
  province: string;
  city: string;
  cityUid: string;
  provinceUid: string;
  postalCode: string;
  plaqueNo: string;
  unit: string;
  phoneNumber: string;
}

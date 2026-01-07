import { GenericApiResponse } from '../../generic-api-response.model';

export interface ProfileField<T = string> {
  name: string;
  editable: boolean;
  value?: T;
}

export interface ProfileFieldList {
  name: ProfileField;
  surname: ProfileField;
  nationalCode: ProfileField;
  birthCertificate: ProfileField;
  gender: ProfileField<1 | 2>;
  birthDate: ProfileField<number>;
  iban: ProfileField;
  address: ProfileField;
  cityUid: ProfileField;
  provinceUid: ProfileField;
  postalCode: ProfileField;
}

export interface CreditProfileResponse extends GenericApiResponse {
  cellNumber: string;
  fields: ProfileFieldList;
}

export interface UserAddressesResponse extends GenericApiResponse {
  addresses: UserAddress[];
}

export interface UserAddress {
  city: string;
  cityUid: string;
  cityName: string;
  province: string;
  provinceName: string;
  provinceUid: string;
  address: string;
  postalCode: string;
  phoneNumber: string;
  addressUnit: string;
  addressNo: string;
  birthPlace: string;
  birthPlaceProvince: string;
  job: string;
  education: string;
  listOption?: ListOption;
}

export interface ListOption {
  label: any;
  value: string;
  selected: boolean;
  iconLabel?: string;
}

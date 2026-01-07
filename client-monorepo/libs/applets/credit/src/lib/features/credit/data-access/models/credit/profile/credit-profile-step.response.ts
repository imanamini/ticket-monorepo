import { GenericApiResponse } from '../../generic-api-response.model';

export enum CREDIT_PROFILE_RULE {
  OPTIONAL,
  MANDATORY,
}

export type ProfileStepFieldName =
  | 'postalCode'
  | 'provinceUid'
  | 'cityUid'
  | 'address'
  | 'addressNo'
  | 'addressUnit'
  | 'birthPlace'
  | 'birthPlaceProvince'
  | 'phoneNumber'
  | 'education'
  | 'job';

export interface ProfileStepField {
  name: ProfileStepFieldName;
  editable: boolean;
  value: number | string | null;
  option: CREDIT_PROFILE_RULE;
}

export interface CreditProfileStepResponse extends GenericApiResponse {
  header: {
    content: string;
    color: string;
    bgColor: string;
    strokeColor: string;
  };
  fields: ProfileStepField[];
}

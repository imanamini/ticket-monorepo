import { GenericApiResponse } from '../generic-api-response.model';

export interface CreditSmartScoringProfileDetailsResponse extends GenericApiResponse {
  cellNumber: string;
  fields: PreSignupField[];
}

export interface PreSignupField {
  name: 'birthDate' | 'nationalCode';
  editable: boolean;
  value?: string | number;
}

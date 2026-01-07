import { GenericApiResponse } from '../../generic-api-response.model';

export enum PROFILE_STATUS {
  INITIATED = 0,
  PENDING = 1,
  SHAHKAR = 2,
  SUCCESS = 3,
  SERVICE_ERROR = 4,
  COMPLETED = 5,
  REGISTRATION_IDENTITY_RETRY = 6,
  POSTAL_CODE_RETRY = 7,
  RETRY_FAILED = 8,
  DEAD = 9,
  BIRTHDATE = 10,
}

export type ProfileStateType =
  | 'LOADING'
  | 'WAIT'
  | 'REGISTER_FORM'
  | 'MAIN_FORM'
  | 'NO_SERVICE'
  | 'SHAHKAR'
  | 'DEAD'
  | 'BIRTHDATE'
  | 'RETRY_FAILED'
  | null;

export interface FieldError {
  fieldName: string; // this will be 'birthDate' or 'postalCode'
  text: string;
}

export interface CreditProfileStatusResponse extends GenericApiResponse {
  pageTitle?: string;
  status: PROFILE_STATUS;
  title?: string;
  message?: string;
  imageId?: string;
  checkCountDown?: number;
  buttonLabel?: string;
  retryable?: boolean; // if true there is true check errorMessage to determine if birthDate or postalCode textBox error
  fieldErrors?: FieldError[];
  preRegisterInfo?: {
    nationalCode: string;
    birthDate: number;
  };
}

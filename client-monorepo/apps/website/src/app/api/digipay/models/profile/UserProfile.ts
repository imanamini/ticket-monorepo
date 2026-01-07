import { ApiResult } from '../api-result.model';

export interface UserProfile {
  result: ApiResult;
  userDetail: {
    userId: string;
    name: string;
    surname: string;
    cellNumber: string;
    nationalCode: string;
    email: {
      email: string;
      status: number;
    };
    imageId: any;
    phone: {
      number: string;
      status: number;
    };
    active: boolean;
    birthDate: number;
    gender: number;
    tacAcceptDate: any;
    tacAcceptVersion: any;
    inAppTacAcceptDate: any;
    inAppTacAcceptVersion: any;
    activationDate: any;
    registrationDate: any;
  };
}

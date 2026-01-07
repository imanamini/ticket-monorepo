import { BaseApiResponse } from '../../../models/base-api.response';
import { MERCHANT_TYPE } from '../basic-models/merchant.type';
import { RegistrationStatus } from '../basic-models/registration-status';

export interface GetTicketDetailResponse extends BaseApiResponse {
  registration: {
    agent: {
      cellNumber: string;
      registerCellNumber : string;
      email: string;
      name: string;
    };
    bankAccount: {
      accountNumber: string;
      customerNumber: string;
      iban: string;
      type: number;
    };
    registrationChanges: [];
    businessId: string;
    businessLabel: string;
    creationDate: number;
    currentState: number;
    fundProvider: string;
    journals: [
      {
        date: number;
        message: string;
        state: number;
      }
    ];
    maxCreditAmount: number;
    name: string;
    nationalCode: string;
    providerId: string;
    registrationId: string;
    creditId: string; // new ID field
    remainingCreditAmount: number;
    status: RegistrationStatus;
    type: MERCHANT_TYPE;
    userId: string;
    cellNumber: string;
    identityInfo: {
      birthDate: string;
      name: string;
      nationalCode: string;
      fatherName: string;
    };
    address: {
      address: string;
      cityCode: string;
      postalCode: string;
      provinceCode: string;
    },

  };
}

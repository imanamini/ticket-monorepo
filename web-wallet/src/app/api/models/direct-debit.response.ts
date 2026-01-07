import { GenericResponse } from './generic.response';
import { ActionTypeEnum } from '../emuns/direct-debit-ticket-info-action-type.enum';
import { DurationTimeUnitEnum } from '../emuns/duration-time-unit.enum';

export interface DirectDebitTicketInfoResponse extends GenericResponse {
  ttl: number,
  callbackUrl: string;
  providerId: string;
  user: DirectDebitTicketInfo;
  business: {
    userId: string;
    name: string;
  };
  action?: {
    type: ActionTypeEnum
  };
  duration?: {
    timeUnit: DurationTimeUnitEnum,
    count: number
  };
  maxDailyTransactionAmount?: number;
  maxDailyTransactionCount?: number;
  maxMonthlyTransactionCount?: number;
}

export interface DirectDebitTicketInfo {
  cellNumber: string;
  name: string;
  nationalCode: string;
  userId: string;
  verified: boolean;
}

export interface DirectDebitBank {
  cardBankLogoImageId: string;
  cardImageId: string;
  cardPrefixes: [];
  cardTransferMethod: number;
  code: string;
  colorRange: string;
  imageId: string;
  name: string;
  profileCert: string;
  profileCertUrl: string;
  providerImages: [];
  0: string;
  1: string;
  shouldVerify: boolean;
  uid: string;
  xferCert: string;
  xferCertFileUrl: string;
  directDebit: DailyAmountMax;
}

export interface DailyAmountMax {
  dailyAmountMax: number;
}

export interface DirectDebitBanks extends GenericResponse {
  banks: DirectDebitBank[];
}

export interface DirectDebitContract {
  action: {
    minWalletBalance: number;
    type: number;
  };
  activationDate: number;
  bankCode: string;
  contractId: string;
  creationDate: number;
  duration: DirectDebitContractDuration;
  expirationDate: number;
  maxDailyTransactionAmount: number;
  status: number;
}

export interface DirectDebitContractDuration {
  count: number;
  timeUnit: number;
}

export interface DirectDebitCreateTicketResponse extends GenericResponse {
  ticket: string;
  redirectUrl: string;
}

export interface DirectDebitContractsResponse extends GenericResponse {
  contracts: DirectDebitContract[];
}

export interface DirectDebitContractResponse extends GenericResponse {
  contract: DirectDebitContract;
}

export interface DirectDebitContractRegister extends GenericResponse {
  contractId: string;
  redirectUrl: string;
}

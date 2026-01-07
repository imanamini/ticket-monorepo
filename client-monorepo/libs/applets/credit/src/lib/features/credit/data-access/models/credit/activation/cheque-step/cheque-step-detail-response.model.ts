import { GenericApiResponse } from '../../../generic-api-response.model';

export interface CreditChequeDocument {
  imageId: string;
  status: CREDIT_CHEQUE_DOCUMENT_STATUS;
  description: string;
  docId: string;
  chequeId?: string;
  option: number;
  tag: number;
  title: string;
  order?: number;
  reasons?: Array<{
    title: string;
    description: string;
    type?: 'notRegistered' | 'others';
  }>;
}

export interface ChequeStepDetailResponseModel extends GenericApiResponse {
  date: number;
  iban: string;
  amount: number;
  bankName: string;
  bankCode: string;
  chequeId: string;
  guideUrl: string;
  type: number; // INDIVIDUAL(1), RELATIVE(2);
  documents: CreditChequeDocument[];
  maxUploadSize: number;
  ownerName: string;
  ownerNationalCode: string;
  ownerRelative: number;
  relatives: any;
  ownerBirthDate: number;
  ownerCellNumber: string;
  ownerBirthCertificate: string;
}

export enum CREDIT_CHEQUE_DOCUMENT_STATUS {
  INITIATED,
  UPLOADED,
  ACCEPTED,
  REJECTED,
  IN_PROGRESS,
  GENERATED,
  READY_TO_SIGN,
  SIGNED,
  SEALED,
}

export const CREDIT_CHEQUE_DOCUMENT_STATUS_TRANSLATION: {
  [key in CREDIT_CHEQUE_DOCUMENT_STATUS]: string;
} = {
  [CREDIT_CHEQUE_DOCUMENT_STATUS.INITIATED]: '',
  [CREDIT_CHEQUE_DOCUMENT_STATUS.UPLOADED]: 'تکمیل شده',
  [CREDIT_CHEQUE_DOCUMENT_STATUS.ACCEPTED]: 'تایید شده',
  [CREDIT_CHEQUE_DOCUMENT_STATUS.REJECTED]: 'رد شده',
  [CREDIT_CHEQUE_DOCUMENT_STATUS.IN_PROGRESS]: '',
  [CREDIT_CHEQUE_DOCUMENT_STATUS.GENERATED]: '',
  [CREDIT_CHEQUE_DOCUMENT_STATUS.READY_TO_SIGN]: '',
  [CREDIT_CHEQUE_DOCUMENT_STATUS.SIGNED]: '',
  [CREDIT_CHEQUE_DOCUMENT_STATUS.SEALED]: '',
};

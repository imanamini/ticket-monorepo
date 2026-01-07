import { CreditAgreementType } from './credit-agreement-type';

export interface CreditAgreementModel {
  documentUrl: string;
  agreementType: CreditAgreementType;
  modificationTime: number;
}

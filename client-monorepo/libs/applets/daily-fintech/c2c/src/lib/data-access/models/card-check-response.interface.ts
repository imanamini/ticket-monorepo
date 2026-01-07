import { GenericApiResponse } from '@client-monorepo/common/network';
import { CardVerificationStatus } from './card-verification-status';

export interface CardCheckResponse extends GenericApiResponse {
  cardTransferMethod: CardTransferMethods;
  kycDescription: string;
  description: string;
  cert: string;
  verificationStatus: CardVerificationStatus;
  redirectType: number;
}

export enum CardTransferMethods {
  DEFAULT = 0,
  VERIFICATION = 1,
  NATIONAL_CODE_VERIFICATION = 2,
  PISP = 3,
}

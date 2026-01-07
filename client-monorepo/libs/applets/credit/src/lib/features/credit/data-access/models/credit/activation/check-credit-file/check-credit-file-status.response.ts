import { GenericApiResponse } from '../../../generic-api-response.model';
import { CHECK_CREDIT_FILE_STATUS } from './check-credit-file-status';
import { CHECK_CREDIT_FILE_RESULT } from './check-credit-file-result';

export interface CheckCreditFileStatusResponse extends GenericApiResponse {
  status: CHECK_CREDIT_FILE_STATUS;
  message?: string;
  creditFileResult?: CHECK_CREDIT_FILE_RESULT;
  bouncedChequeDetails?: CheckCreditFileChequeAndLoan[];
  postponedLoanDetails?: CheckCreditFileChequeAndLoan[];
}

export interface CheckCreditFileChequeAndLoan {
  bankName: string;
  amount: number;
  bouncedDate?: number;
}

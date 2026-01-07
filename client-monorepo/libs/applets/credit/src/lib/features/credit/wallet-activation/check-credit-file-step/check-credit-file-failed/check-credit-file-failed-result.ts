import {
  CheckCreditFileChequeAndLoan
} from '../../../data-access/models/credit/activation/check-credit-file/check-credit-file-status.response';

export type CheckCreditFileFailedResult = {
  [key in CheckCreditFileFailedResultType]: CheckCreditFileChequeAndLoan[];
};

export enum CheckCreditFileFailedResultType {
  LOANS = 'loans',
  CHEQUES = 'cheques',
}

export const CheckCreditFileFailedNoData: { [key: string]: string } = {
  [CheckCreditFileFailedResultType.LOANS]: 'اقساط معوقی ندارید.',
  [CheckCreditFileFailedResultType.CHEQUES]: 'چک برگشتی ندارید.',
};

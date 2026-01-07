import { GenericApiResponse } from '../../generic-api-response.model';

export interface BankAccountPageInformationResponse extends GenericApiResponse {
  message: string;
  amount: number;
  name: string;
  accountNumber: string;
  icon: string;
  title: string;
  accountNumberLabel: string;
}

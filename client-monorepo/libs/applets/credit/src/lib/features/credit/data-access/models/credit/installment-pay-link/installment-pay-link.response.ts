import { GenericApiResponse } from '../../generic-api-response.model';
import { ConfigPaymentFlow } from '../installment/installment-pay-config.response';
import { RegisterIplTicketDetail } from '../../../../installment-pay-link/data-access/register-ipl-ticket';

export interface InstallmentPayLinkResponse extends GenericApiResponse {
  totalDebt: number; // Contains penalty and penaltyWaiver in itself
  totalPenalty: number;
  totalPenaltyWaiver: number;
  clearAmount?: number;
  unPaidInstallments: UnPaidInstallment[];
  fundProviderDto: FundProviderDto;
  fullName: string;
  isCutOffTime: boolean;
  isPayerDebtOwner: boolean;
  cellNumber: string;
  paymentFlow: ConfigPaymentFlow;
  dueInstallmentsTicketDetails: RegisterIplTicketDetail[];
}

interface UnPaidInstallment {
  amount: number;
  penaltyAmount: number;
  penaltyWaiverAmount: number;
  effectiveDate: number;
  order: number;
  contractTrackingCode: string;
}

interface FundProviderDto {
  businessId: string;
  name: string;
  title: string;
}

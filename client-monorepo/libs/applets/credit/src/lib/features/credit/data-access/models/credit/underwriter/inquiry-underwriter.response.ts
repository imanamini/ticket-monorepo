import { GenericApiResponse } from '../../generic-api-response.model';

export interface InquiryUnderwriterResponse extends GenericApiResponse {
  maxInstallmentCount: number;
  maxInstallmentAmount: number;
  maxCreditAmount: number;
  status: any;
  organizationId: string;
  organizationName: string;
  underwriter: any;
}

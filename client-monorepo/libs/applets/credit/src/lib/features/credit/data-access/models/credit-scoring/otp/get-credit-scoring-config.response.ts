import { GenericApiResponse } from '../../generic-api-response.model';
import { CsCancelInfo } from '../basic/cs-cancel-info';

export interface CancelInfoDto {
  title: string;
  header: string;
  description: string;
  descriptionColor: number;
  keywords: string[];
}

export interface BeforeTransformationGetCreditScoringConfigResponse extends GenericApiResponse {
  otpDigits: number;
  cancelInquiryInfo: CancelInfoDto;
}

export interface GetCreditScoringConfigResponse {
  otpLength: number;
  cancelInfo: CsCancelInfo;
}

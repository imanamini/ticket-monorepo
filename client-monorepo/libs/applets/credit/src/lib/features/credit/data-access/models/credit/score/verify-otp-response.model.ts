import { GenericApiResponse } from '../../generic-api-response.model';

export interface VerifyOtpResponse extends GenericApiResponse {
  score: number;
  minScore: number;
  maxScore: number;
  acceptableScore: number;
  color: number;
  compute: boolean;
  active: boolean;
  image: string;
  unAcceptableScore: number;

  // validityText: متاسفانه امتیاز شما نزد خانواده دیجی‌کالا کافی نمی‌باشد :(,
  validityText: string;
  // actionText: امتیاز بانکی نامطلوب,
  actionText: string;

  scoreResult: string;

  // LOCAL
  title: '';
}

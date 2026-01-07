import { PaymentFeature } from './payment-feature';
import { ApiResult } from '../api-result.model';

export interface PaymentFeaturesResponse {
  amount: number;
  fallbackUrl: string;
  features: PaymentFeature[];
  result: ApiResult;
  ttl: number;
  type: number;
}

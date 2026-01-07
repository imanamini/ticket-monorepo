import { BaseApiResponse } from '../base-api.response';
import { MobileOperator } from './mobile-operator';

export interface TopUpOperatorsResponse extends BaseApiResponse {
  topUpOperators: MobileOperator[];
}

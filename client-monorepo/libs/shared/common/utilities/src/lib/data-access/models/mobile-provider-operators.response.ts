import { ApiResultInterface } from '@client-monorepo/common/network';
import { MobileOperator } from '@client-monorepo/common/utilities';

export interface MobileProviderOperatorsResponse {
  result: ApiResultInterface;
  topUpOperators: MobileOperator[];
}

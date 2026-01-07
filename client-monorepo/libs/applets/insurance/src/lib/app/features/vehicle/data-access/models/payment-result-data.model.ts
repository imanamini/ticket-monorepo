import { JourneyType, QueryParamKeysEnum } from '../../../home/query-param-keys.enum';

export interface PaymentResultData {
  applicationFormId: string;
  isHybrid: boolean;
  referrer?: string;
  [QueryParamKeysEnum.JourneyType]?: JourneyType;
}

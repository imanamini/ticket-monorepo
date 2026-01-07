import { ApiResultInfo } from './api-result-info';

export interface SubmitNobitexCreditResponse extends ApiResultInfo {
  result: {
    result: {
      title: string;
      status: number;
      message: string;
      level: string;
    };
    url: string;
    state: number;
    fundProviderCode: number;
    creditId: number;
  };
}

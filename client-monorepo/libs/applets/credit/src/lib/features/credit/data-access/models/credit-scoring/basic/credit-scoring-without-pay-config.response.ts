import { GenericApiResponse } from '../../generic-api-response.model';
import { CsCancelInfo } from './cs-cancel-info';
import { CREDIT_SCORING_STEP_STATUS } from './credit-scoring-step-status';

export interface CreditScoringWithoutPayConfigResponse extends GenericApiResponse {
  pages: {
    imageId: string;
    title: string;
    order: number;
    content: {
      title: string;
      items: {
        order: number;
        title: string;
        linkUrl?: string;
        description: {
          prefix: string;
          linkLabel: string;
          postfix: string;
        };
      }[];
    };
    noticeMessage: {
      title: string;
      body: string;
      items: string[];
    };
  }[];
  cancelInfo: CsCancelInfo;
  status: CREDIT_SCORING_STEP_STATUS;
}

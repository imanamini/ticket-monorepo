import { GenericApiResponse } from '../../../api/digipay/models/generic-api-response.model';

export interface RegisterCardResponse extends GenericApiResponse {
  cardInfo: {
    cardIndex: string;
    cardOwner: string;
    expireDate: string;
    pinned: boolean;
    postfix: string;
    prefix: string;
    requestDate: number;
  };
  redirectUrl?: string;
}

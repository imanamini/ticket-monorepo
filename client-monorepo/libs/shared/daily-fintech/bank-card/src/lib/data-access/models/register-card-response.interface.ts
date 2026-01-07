import { GenericApiResponse } from '@client-monorepo/common/network';

export interface RegisterCardResponse extends GenericApiResponse {
  cardInfo: RegisterCardInfo;
  redirectUrl?: string;
}

export interface RegisterCardInfo {
  cardIndex: string;
  cardOwner: string;
  expireDate: string;
  pinned: boolean;
  postfix: string;
  prefix: string;
  requestDate: number;
}

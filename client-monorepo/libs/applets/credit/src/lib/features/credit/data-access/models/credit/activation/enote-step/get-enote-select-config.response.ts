import { GenericApiResponse } from '../../../generic-api-response.model';

export interface GetEnoteSelectConfigResponse extends GenericApiResponse {
  pageTitle: string;
  title: string;
  pages: EnotePages[];
}

export interface EnotePages {
  title: string;
  amount: number;
  desc: string;
  descriptions: string[];
  type: string;
  enable: boolean;
}

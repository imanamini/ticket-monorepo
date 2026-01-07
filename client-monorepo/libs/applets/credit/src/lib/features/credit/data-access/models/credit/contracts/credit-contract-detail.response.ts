import { GenericApiResponse } from '../../generic-api-response.model';

export interface CreditContractDetailResponse extends GenericApiResponse {
  contractDetails: ContractDetail[];
}

export interface ContractDetail {
  title: string;
  contractDetailItems: ContractDetailItem[];
}

export interface ContractDetailItem {
  title: string;
  value: string;
  indicatorColor: string;
  contractDetailSubitems: {
    text: string;
    value: string;
  }[];
}

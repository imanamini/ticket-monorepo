import { GenericApiResponse } from '@client-monorepo/common/network';

export interface C2cFrequentTransactionResponse extends GenericApiResponse {
  recommendations: C2cFrequentTransaction[];
}

export interface C2cFrequentTransaction {
  color: number;
  id: string;
  imageId: string;
  info: Info[];
  pinned: boolean;
  subTitle: string;
  title: string;
  expired?: boolean;
}

export interface ModifiedC2cFrequentTransaction extends C2cFrequentTransaction {
  amount: string;
  iconId: string;
  sourceIndex: string;
  destinationIndex: string;
}

export interface Info {
  label: string;
  value: string;
}

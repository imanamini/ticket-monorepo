import { GenericApiResponse } from '@client-monorepo/common/network';

export interface C2cFrequentTransactionConfigResponse extends GenericApiResponse {
  banner: C2cFrequentTransactionBanner;
  icons: string[];
}

export interface C2cFrequentTransactionBanner {
  description: string;
  imageId: string;
  title: string;
}

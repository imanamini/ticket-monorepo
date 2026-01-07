import {ApiResultInterface} from '@client-monorepo/common/network';

export interface WalletTransferResponse {
  result: ApiResultInterface;
  ticket: string;
}

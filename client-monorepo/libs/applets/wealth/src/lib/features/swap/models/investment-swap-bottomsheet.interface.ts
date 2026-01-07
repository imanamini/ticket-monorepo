import { ISwapWallet } from './swap-process.interface';

export type InvestmentSwapType = 'origin' | 'destination';

export interface IInvestmentSwapBottomsheet {
  type: InvestmentSwapType;
  wallets: ISwapWallet[];
  defaultWallet: string;
}

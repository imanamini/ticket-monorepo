import { EWithdrawType } from './wallet-action-handler.type';

export interface IWalletActionButton {
  id: EWithdrawType;
  label?: string;
  style?: string;
  disable?: boolean;
  icon?: {
    name: string;
    type: string;
  };
}

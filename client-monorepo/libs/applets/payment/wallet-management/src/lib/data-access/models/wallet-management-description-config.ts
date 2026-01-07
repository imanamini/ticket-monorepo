import { WalletManagementDescriptionState } from './wallet-management-description-state';

export interface WalletManagementDescriptionConfig {
  descriptionEnum: string[];
  stateHandler: new () => WalletManagementDescriptionState;
  headerTitle: string;
  className?: Record<string, string>;
  status: 'normal' | 'blocked-balance';
}

export enum WalletManagementDescriptionThemes {
  NORMAL_THEME = 'normal-theme',
  BLOCK_THEME = 'block-theme',
}

import { WalletManagementDescriptionState } from '../models/wallet-management-description-state';

export class WalletManagementDescription implements WalletManagementDescriptionState {
  public getState(): boolean {
    return localStorage.getItem('readTheWalletManagementDescription') === 'true';
  }

  public setState() {
    localStorage.setItem('readTheWalletManagementDescription', 'true');
  }
}

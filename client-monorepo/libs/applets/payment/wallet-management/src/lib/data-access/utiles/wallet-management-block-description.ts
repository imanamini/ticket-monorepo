import { WalletManagementDescriptionState } from '../models/wallet-management-description-state';

export class WalletManagementBlockDescription implements WalletManagementDescriptionState {
  public getState(): boolean {
    return this.getCount() >= 3;
  }

  public setState() {
    localStorage.setItem('countReadTheWalletManagementBlockDescription', JSON.stringify(this.getCount() + 1));
  }

  private getCount(): number {
    const countFromStorage = localStorage.getItem('countReadTheWalletManagementBlockDescription');
    return countFromStorage ? Number(JSON.parse(countFromStorage)) : 0;
  }
}

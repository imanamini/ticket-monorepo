import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CreditApiService } from './credit-api.service';
import { CreditWallet } from '../models/credit/wallet/credit-wallet.model';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WalletCardService {
  private walletList = new BehaviorSubject<{
    wallets: CreditWallet[];
    volunteers: CreditWallet[];
  }>({ wallets: [], volunteers: [] });
  private cachedWallet: { [key: string]: CreditWallet } = {};
  private loadTime = 0;
  private expireTime = 10 * 60 * 1000; // 10 min

  constructor(private creditApiService: CreditApiService) {}

  clearCache() {
    this.loadTime = 0;
  }

  getWallet(fundProviderCode: number, creditId: string, forceUpdate = false): Observable<CreditWallet> {
    if (!forceUpdate && this.cachedWallet[creditId]) {
      return of(this.cachedWallet[creditId]);
    }
    return this.creditApiService.getCreditWallet(creditId).pipe(
      map((res) => {
        this.cachedWallet[creditId] = res.creditWallet;
        return this.cachedWallet[creditId];
      }),
    );
  }

  getRawWalletList(forceUpdate = false): Observable<{
    wallets: CreditWallet[];
    volunteers: CreditWallet[];
  }> {
    this.checkUpdate(forceUpdate);
    return this.walletList.pipe(
      filter(() => this.loadTime > 0),
      take(1),
    );
  }

  private checkUpdate(forceUpdate = false) {
    if (forceUpdate || !this.loadTime || +new Date() > this.loadTime + this.expireTime) {
      this.updateWalletList();
    }
  }

  private updateWalletList(): void {
    this.loadTime = 0;
    this.creditApiService.getCreditWallets().subscribe((response) => {
      this.loadTime = +new Date();
      this.walletList.next({
        wallets: response.creditWallets || [],
        volunteers: response.creditVolunteers || [],
      });
      response.creditWallets.forEach((item: CreditWallet) => {
        this.cachedWallet[item.creditId] = item;
      });
    });
  }
}

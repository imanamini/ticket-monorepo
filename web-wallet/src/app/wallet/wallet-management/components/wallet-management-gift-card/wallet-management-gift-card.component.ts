import { Component, inject, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AddGiftCardComponent } from './add-gift-card/add-gift-card.component';
import { GiftInterface } from './gift.interface';
import { walletManagementBalanceApiService } from '../../../../api/services/wallet-management/balance-api.service';
import {
  BalancesInterface,
  GiftCardsResponseInterface
} from '../../../../api/models/wallet-management/balance.interface';
import { TokenService } from '../../services/token.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-wallet-management-gift-card',
  templateUrl: './wallet-management-gift-card.component.html',
  styleUrls: ['./wallet-management-gift-card.component.scss']
})
export class WalletManagementGiftCardComponent implements OnInit {
  private bottomSheet = inject(MatBottomSheet);
  private balanceApiService = inject(walletManagementBalanceApiService);
  private tokenService = inject(TokenService);
  public balances: BalancesInterface[] = [];

  ngOnInit() {
    this.getGiftCards();
  }

  public openAddGiftCardBottomSheet(): void {
    this.bottomSheet.open(AddGiftCardComponent, {
      panelClass: 'add-gift-card-bottom-sheet'
    })
      .afterDismissed();
  }

  private getGiftCards(): void {
    this.balanceApiService.getBalances(this.tokenService.get())
      .pipe(map((result: GiftCardsResponseInterface) => result.balances))
      .subscribe((balances: BalancesInterface[]) => this.balances = balances);
  }
}

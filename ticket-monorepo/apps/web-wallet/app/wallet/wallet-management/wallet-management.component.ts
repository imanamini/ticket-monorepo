import { Component, inject, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ExpirationOfGiftCardComponent } from './components/expiration-of-gift-card/expiration-of-gift-card.component';
import { walletManagementBalanceApiService } from '../../api/services/wallet-management/balance-api.service';
import { BalanceInformationResponseInterface } from '../../api/models/wallet-management/balance.interface';
import { TokenService } from './services/token.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wallet-management',
  templateUrl: './wallet-management.component.html',
  styleUrls: ['./wallet-management.component.scss']
})
export class WalletManagementComponent implements OnInit {
  public balanceInformation: BalanceInformationResponseInterface;
  private bottomSheet = inject(MatBottomSheet);
  private balanceApiService = inject(walletManagementBalanceApiService);
  private tokenService = inject(TokenService);
  private activatedRoute = inject(ActivatedRoute);

  async ngOnInit(): Promise<void> {
    this.scrollToTop();
    this.tokenService.set(this.activatedRoute.snapshot.params['token']);
    this.getBalanceInformation();
    // this.checkExpiration();
  }

  private checkExpiration(): void {
    this.bottomSheet.open(ExpirationOfGiftCardComponent, {
      panelClass: 'expire-gift-card-bottom-sheet'
    })
      .afterDismissed().subscribe(() => {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    });
  }

  private getBalanceInformation(): void {
    this.balanceApiService.getBalanceInformation(this.tokenService.get())
      .subscribe((response: BalanceInformationResponseInterface) => this.balanceInformation = response);
  }

  private scrollToTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}

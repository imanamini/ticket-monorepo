import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NgIf } from '@angular/common';
import { UiButtonComponent } from '../ui-button/ui-button.component';

@Component({
  selector: 'app-ui-pay-buttons',
  templateUrl: './ui-pay-buttons.component.html',
  styleUrls: ['./ui-pay-buttons.component.scss'],
  standalone: true,
  imports: [UiButtonComponent, NgIf],
})
export class UiPayButtonsComponent implements OnChanges {
  @Input()
  enableWallet = true;

  @Input()
  isLoggedIn = false;

  @Input()
  enableIpg = true;

  @Output()
  walletClick = new EventEmitter();

  @Output()
  ipgClick = new EventEmitter();

  @Input()
  sufficientBalance = true;

  walletButtonTitle = '';

  ngOnChanges(changes: SimpleChanges): void {
    this.makeWalletButtonTitle();
  }

  onIpgClick(): void {
    this.ipgClick.emit();
  }

  onWalletClick(): void {
    if (this.enableWallet) {
      this.walletClick.emit();
    }
  }

  private makeWalletButtonTitle(): void {
    if (this.isLoggedIn && this.sufficientBalance) {
      this.walletButtonTitle = 'برای پرداخت با کیف پول کلیک کنید';
    }
    if (this.isLoggedIn && !this.sufficientBalance) {
      this.walletButtonTitle = 'موجودی کافی نیست';
    }
    if (!this.isLoggedIn) {
      this.walletButtonTitle = 'برای استفاده از کیف پول وارد حساب کاربری خود شوید';
    }
  }
}

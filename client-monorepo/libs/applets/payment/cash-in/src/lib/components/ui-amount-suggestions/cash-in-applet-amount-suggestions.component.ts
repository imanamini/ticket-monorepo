import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';
import { CurrencyComponent } from './currency/currency.component';
import { WALLET_GTM_TAG, WalletGtmService } from '@client-monorepo/payment/wallet';

@Component({
  selector: 'cash-in-applet-amount-suggestions',
  templateUrl: './cash-in-applet-amount-suggestions.component.html',
  styleUrls: ['./cash-in-applet-amount-suggestions.component.scss'],
  standalone: true,
  imports: [NgClass, NgForOf, CurrencyComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmountSuggestionsComponent {
  @Input()
  suggestions: Array<string> = [];

  @Input()
  selectedValue = '';

  @Output()
  selected = new EventEmitter<string>();

  private walletGtm = inject(WalletGtmService);

  onClick(amount: string, index: number): void {
    this.walletGtm.publishEvent(`${WALLET_GTM_TAG.CASHIN_AMOUNT}${index + 1}`);
    this.selectedValue = amount;
    this.selected.emit(amount);
  }
}

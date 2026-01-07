import { EWalletActivation, ISwapWallet } from '../../models';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { GetWalletImage } from '../../../wallet/services/get-wallet-image';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgxAlert } from '@digipay/ngx-alert';

@Component({
  selector: 'wealth-applet-investment-swap',
  standalone: true,
  imports: [CommonModule, PipesModule, NgxButtonComponent, NgxAlert],
  templateUrl: './investment-swap.component.html',
  styleUrl: './investment-swap.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentSwapComponent {
  getImage = GetWalletImage;
  swapData = input.required<ISwapWallet>();
  isOrigin = input.required<boolean>();
  maximunSwap = output<Event>();
  activeWallet = output<ISwapWallet>();

  EWalletActivation = EWalletActivation;

  onMaximunSwap(event: Event) {
    event.stopPropagation();
    this.maximunSwap.emit(event);
  }

  amountText = computed(() => {
    return this.swapData().isOrigin ? 'قابل تبدیل' : 'موجودی';
  });

  onActiveWallet(event: Event) {
    event.stopPropagation();
    this.activeWallet.emit(this.swapData());
  }
}

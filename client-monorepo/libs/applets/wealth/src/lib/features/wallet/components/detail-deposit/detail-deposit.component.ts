import { NgClass } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const WALLET_LOGO_MAP = {
  WALLET_FX: './wealth-assets/images/deposit/fixed-guid.svg',
  WALLET_GOLD: './wealth-assets/images/deposit/gold-guid.svg',
} as const;

type WalletType = keyof typeof WALLET_LOGO_MAP;

@Component({
  selector: 'wealth-applet-detail-deposit',
  standalone: true,
  imports: [PipesModule, NgClass],
  templateUrl: './detail-deposit.component.html',
  styleUrl: './detail-deposit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailDepositComponent {
  walletTitle = input.required<string>();
  walletName = input.required<WalletType>();
  walletBalance = input.required<number>();
  walletDescriptions = input<string>();
  goldPricePerGram = input<number>();

  walletLogo = computed<string>(() => WALLET_LOGO_MAP[this.walletName()] ?? WALLET_LOGO_MAP.WALLET_GOLD);
}

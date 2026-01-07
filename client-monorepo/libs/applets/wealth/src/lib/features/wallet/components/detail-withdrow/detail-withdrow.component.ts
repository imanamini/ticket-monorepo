import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';

const WALLET_LOGO_MAP = {
  WALLET_FX: './wealth-assets/images/deposit/fixed-guid.svg',
  WALLET_GOLD: './wealth-assets/images/deposit/gold-guid.svg',
} as const;

type WalletType = keyof typeof WALLET_LOGO_MAP;

@Component({
  selector: 'wealth-applet-detail-withdrow',
  standalone: true,
  imports: [PipesModule, NgClass],
  templateUrl: './detail-withdrow.component.html',
  styleUrl: './detail-withdrow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailWithdrowComponent {
  walletTitle = input.required<string>();
  walletName = input.required<WalletType>();
  walletBalance = input.required<number>();
  walletDescriptions = input<string>();
  goldPricePerGram = input<number>();

  walletLogo = computed<string>(() => WALLET_LOGO_MAP[this.walletName()] ?? WALLET_LOGO_MAP.WALLET_GOLD);
}

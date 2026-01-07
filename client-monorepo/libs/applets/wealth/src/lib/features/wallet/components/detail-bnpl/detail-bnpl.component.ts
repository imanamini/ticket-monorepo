import { NgClass } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxIcon } from '@digipay/ngx-icon';
import { toSignal } from '@angular/core/rxjs-interop';
import { WalletService } from '../../services/wallet.service';

const WALLET_LOGO_MAP = {
  WALLET_FX: './wealth-assets/images/deposit/fixed-guid.svg',
  WALLET_GOLD: './wealth-assets/images/deposit/gold-guid.svg',
  WALLET_MIX: './wealth-assets/images/deposit/mix-bnpl.svg',
} as const;

type WalletType = keyof typeof WALLET_LOGO_MAP;

@Component({
  selector: 'wealth-applet-detail-bnpl',
  standalone: true,
  imports: [PipesModule, NgClass, NgxDividerComponent, NgxIcon],
  templateUrl: './detail-bnpl.component.html',
  styleUrl: './detail-bnpl.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailBnplComponent {
  walletTitle = input.required<string>();
  walletName = input.required<WalletType>();
  walletBalance = input<number>();
  fxBalance = input<number>();
  goldBalance = input<number>();
  walletDescriptions = input<string>();
  goldPricePerGram = input<number>();

  private walletService = inject(WalletService);
  private goldPricePublisher = toSignal(this.walletService.goldPricingPublisher$, { initialValue: null });

  walletLogo = computed<string>(() => WALLET_LOGO_MAP[this.walletName()] ?? WALLET_LOGO_MAP.WALLET_GOLD);
  metaData = computed(() => {
    const goldPublisher = this.goldPricePublisher();
    if (this.walletName() === 'WALLET_MIX') {
      return [
        {
          title: 'موجودی طرح درامد ثابت',
          subTitle: 'دریافت اعتبار تا ۱۰۰٪ موجودی',
          value: this.fxBalance(),
          type: 'amount',
        },
        {
          title: 'موجودی طرح طلا',
          subTitle: 'دریافت اعتبار تا ۶۰٪ موجودی',
          value: goldPublisher?.balance || 0,
          type: 'amount',
        },
      ];
    }
    return [
      {
        title: 'موجودی',
        subTitle: this.walletDescriptions(),
        value: this.walletName() === 'WALLET_GOLD' ? goldPublisher?.balance : this.walletBalance(),
        type: 'amount',
      },
    ];
  });

  readonly BorderColorsEnum = BorderColorsEnum;
}

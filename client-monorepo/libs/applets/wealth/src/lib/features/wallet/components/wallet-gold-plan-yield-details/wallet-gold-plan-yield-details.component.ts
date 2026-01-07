import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { WalletService } from '../../services/wallet.service';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IGoldPricePublisher } from '../../models/gold-price-publisher.interface';
import { IWallet } from '../../models/wallet.interface';

@Component({
  selector: 'wealth-applet-wallet-gold-plan-yield-details',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './wallet-gold-plan-yield-details.component.html',
  styleUrl: './wallet-gold-plan-yield-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletGoldPlanYieldDetailsComponent {
  wallet = input.required<IWallet>();
  walletService = inject(WalletService);
  goldPricePublisher = toSignal<IGoldPricePublisher | null>(this.walletService.goldPricingPublisher$, {
    initialValue: null,
  });
}

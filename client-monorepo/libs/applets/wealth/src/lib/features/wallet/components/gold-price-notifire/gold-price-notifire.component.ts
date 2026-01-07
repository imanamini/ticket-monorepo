import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletService } from '../../services/wallet.service';
import { take } from 'rxjs';

@Component({
  selector: 'wealth-applet-gold-price-notifire',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gold-price-notifire.component.html',
  styleUrl: './gold-price-notifire.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoldPriceNotifireComponent implements OnInit {
  readonly walletService = inject(WalletService);

  ngOnInit(): void {
    this.walletService.goldPricingPublisher$.pipe(take(1)).subscribe((value) => {
      if (!value) {
        this.walletService.getWalletIndexValueStream('WALLET_GOLD').pipe(take(1)).subscribe();
      }
    });
  }
}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { ECreditStatus } from '../../../../models/credit-status.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'wealth-applet-wallet-credit-detail',
  standalone: true,
  imports: [CommonModule, PipesModule, NgxBadgeModule],
  templateUrl: './wallet-credit-detail.component.html',
  styleUrl: './wallet-credit-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletCreditDetailComponent {
  creditStatusEnum = input<ECreditStatus>();
  creditAmount = input<number>();
  protected readonly ECreditStatus = ECreditStatus;

  badgeState = computed(() => {
    return (
      this.creditStatusEnum() === ECreditStatus.InProgress ||
      this.creditStatusEnum() === ECreditStatus.InClosure ||
      this.creditStatusEnum() === ECreditStatus.Closed ||
      this.creditStatusEnum() === ECreditStatus.Failed
    );
  });

  waitingBadge = computed(() => {
    return (
      this.creditStatusEnum() === ECreditStatus.InProgress ||
      this.creditStatusEnum() === ECreditStatus.InClosure ||
      this.creditStatusEnum() === ECreditStatus.Closed
    );
  });

  badgeTitle = computed(() => {
    return this.creditStatusEnum() === ECreditStatus.InProgress
      ? 'در حال بررسی'
      : this.creditStatusEnum() === ECreditStatus.InClosure
        ? 'در حال بررسی لغو اعتبار'
        : this.creditStatusEnum() === ECreditStatus.Closed
          ? 'اعتبار لغو شد'
          : 'درخواست رد شد';
  });
}

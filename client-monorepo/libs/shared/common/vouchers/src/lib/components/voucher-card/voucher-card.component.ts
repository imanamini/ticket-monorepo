import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxIcon } from '@digipay/ngx-icon';
import { VoucherType } from '../../data-access/models/voucher.model';
import { StoreCategoryToDefaultVoucherImageMapper } from '../../data-access/constants/vouchers.const';
import { PipesModule } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'common-vouchers-voucher-card',
  standalone: true,
  imports: [CommonModule, ApiImageModule, NgxIcon, PipesModule],
  templateUrl: './voucher-card.component.html',
  styleUrl: './voucher-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoucherCardComponent {
  // Inputs
  merchantLogo = input<string>();
  merchantName = input<string>();
  title = input<string>();
  subtitle = input<string>();
  expirationDate = input<number>();
  iconName = input<string>('tag');
  codeText = input<string>();
  bgMode = input<'surface-elevated' | 'surface-back'>('surface-elevated');
  type = input.required<VoucherType>();
  value = input.required<string>();
  previewAmountValue = signal<string>('');
  previewAmountUnit = signal<string>('');
  image = input<string>('');
  cardMode = input<'single' | 'in-carousel'>('in-carousel');
  category = input('ONLINE_SHOP');
  defaultImage = computed(
    () => 'assets/stores/store-categories/default-voucher/' + StoreCategoryToDefaultVoucherImageMapper[this.category()],
  );
  VoucherType = VoucherType;

  constructor() {
    effect(
      () => {
        this.setAmountValueAndUnit();
      },
      { allowSignalWrites: true },
    );
  }

  setAmountValueAndUnit(): void {
    if (Number(this.value()) >= 1000000) {
      let amount = (Number(this.value()) / 1000000).toFixed(1);
      amount = amount.replace('.0', '');
      this.previewAmountValue.set(amount);
      this.previewAmountUnit.set('میلیون تومان');
    } else if (Number(this.value()) >= 1000) {
      let amount = (Number(this.value()) / 1000).toFixed(0);
      amount = amount.replace('.0', '');
      this.previewAmountValue.set(amount);
      this.previewAmountUnit.set('هزار تومان');
    } else {
      this.previewAmountValue.set(this.value());
      this.previewAmountUnit.set('تومان');
    }
  }
}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';
import { StorePaymentMethod } from '../../data-access/models/store.type';

@Component({
  selector: 'common-stores-payment-method-badges',
  standalone: true,
  imports: [CommonModule, NgxIcon],
  templateUrl: './payment-method-badges.component.html',
  styleUrl: './payment-method-badges.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodBadgesComponent {
  paymentMethods = input<StorePaymentMethod[]>([]);
  hasBnpl = computed(() => this.paymentMethods()?.includes(StorePaymentMethod.BNPL));
  hasCredit = computed(() => this.paymentMethods()?.includes(StorePaymentMethod.C_CREDIT));
  backgroundMode = input<'elevated' | 'back'>('elevated');
}

import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { NgxIcon } from '@digipay/ngx-icon';
import {
  PaymentLinkHeaderConfig,
  PaymentLinkHeaderStatus,
  PaymentLinkHeaderStatusIcon,
} from '../../data-access/model/payment-link-status-header.model';

@Component({
  selector: 'escrow-payment-link-status-header',
  standalone: true,
  imports: [CommonModule, NgxIcon],
  templateUrl: './payment-link-status-header.component.html',
  styleUrl: './payment-link-status-header.component.scss',
})
export class PaymentLinkStatusHeaderComponent {
  readonly status = input<PaymentLinkHeaderStatus>('success');
  readonly config = input<PaymentLinkHeaderConfig>();
  readonly cellNumber = input<string>();

  readonly hasError = computed(() => this.status() === 'error');
  readonly isSucceed = computed(() => this.status() === 'success');
  readonly hasWarning = computed(() => this.status() === 'warning');

  readonly icon = computed(() => PaymentLinkHeaderStatusIcon[this.status()]);
}

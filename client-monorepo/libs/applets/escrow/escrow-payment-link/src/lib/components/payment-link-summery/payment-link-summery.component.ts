import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { PaymentLinkCreateResult, PaymentLinkRequestInfo, PaymentLinkResult } from '../../data-access/model/payment-link-create.model';

@Component({
  selector: 'escrow-payment-link-summery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-link-summery.component.html',
  styleUrl: './payment-link-summery.component.scss',
})
export class PaymentLinkSummeryComponent {
  data = input<PaymentLinkResult>();
  time = computed(() => {
    return (this.data()?.requestInfo.ttl ?? 0) / 60000;
  });
}

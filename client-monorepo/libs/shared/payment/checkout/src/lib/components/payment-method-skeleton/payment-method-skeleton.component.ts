import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'payment-checkout-payment-method-skeleton',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoadingComponent],
  templateUrl: './payment-method-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodSkeletonComponent {}

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { AdSummeryDetailComponent } from '../../components/ad-summery-detail/ad-summery-detail.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PaymentLinkSummeryComponent } from '../../components/payment-link-summery/payment-link-summery.component';
import { PaymentLinkStatusHeaderComponent } from '../../components/payment-link-status-header/payment-link-status-header.component';
import { ActivatedRoute } from '@angular/router';
import { PaymentLinkHeaderConfig, PaymentLinkHeaderStatus } from '../../data-access/model/payment-link-status-header.model';
import { PaymentLinkResult } from '../../data-access/model/payment-link-create.model';
import { REDIRECT_URL_DIVAR } from '../../data-access/contracts/redirect-divar.const';
import { EscrowStorageService } from '@client-monorepo/escrow/utils';

@Component({
  selector: 'escrow-payment-link-result',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    AdSummeryDetailComponent,
    NgxButtonComponent,
    PaymentLinkSummeryComponent,
    PaymentLinkStatusHeaderComponent,
  ],
  templateUrl: './payment-link-result.component.html',
  styleUrl: './payment-link-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentLinkResultComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly storage = inject(EscrowStorageService);
  status = signal<PaymentLinkHeaderStatus>(this.route.snapshot.params['status']);
  config = computed<PaymentLinkHeaderConfig>(() =>
    this.status() === 'success'
      ? {
          title: 'عملیات موفق',
          description: () => 'لینک پرداخت برای خریدار در چت دیوار ارسال شد.',
        }
      : {
          title: 'عملیات ناموفق',
          description: () => 'برای ساخت لینک پرداخت، دوباره تلاش کنید.',
        },
  );

  public get paymentLinkData(): PaymentLinkResult {
    return this.storage.getEscrowPaymentLinkDetail();
  }

  onNavigate() {
    window.location.replace(REDIRECT_URL_DIVAR);
  }
}

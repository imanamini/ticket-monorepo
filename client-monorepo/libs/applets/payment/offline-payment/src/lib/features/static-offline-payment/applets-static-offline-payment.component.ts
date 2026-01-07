import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OfflinePaymentApiService } from '../../data-access/services/offline-payment-api.service';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import {
  PayClientApiService,
  PaymentDataInterface,
  PaymentService,
  PaymentUrlService
} from '@client-monorepo/payment/purchase';
import { MessageService } from '@client-monorepo/common/utilities';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { MerchantDetailResponse } from '../../data-access/models/merchant-detail.response';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormsModule } from '@angular/forms';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'offline-payment-applet-static',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    ApiImageModule,
    PipesModule,
    DpIconComponent,
    UiFormFieldBuilderModule,
    FormsModule,
    NgxButtonComponent
  ],
  templateUrl: './applets-static-offline-payment.component.html',
  styleUrl: './applets-static-offline-payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppletsStaticOfflinePaymentComponent implements OnInit {
  trackingCode!: string;
  items!: MerchantDetailResponse;
  isSubmitting = false;
  gettingData = signal(false);
  amount?: number;

  constructor(
    private paymentUrlService: PaymentUrlService,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private messageService: MessageService,
    private payClientApiService: PayClientApiService,
    private offlinePaymentApiService: OfflinePaymentApiService,
  ) {}

  ngOnInit(): void {
    this.trackingCode = this.route.snapshot.queryParams['trackingCode'];
    this.gettingData.set(true);
    this.offlinePaymentApiService.getMerchantDetail(this.trackingCode).subscribe((data) => {
      this.items = data;
      this.gettingData.set(false);
    });
  }

  getPayApiParams() {
    const apiParams = {
      uniqueNumber: this.items.merchantUniqueId,
      amount: this.amount,
      redirectUrl: this.paymentUrlService.setPaymentUrl('offline-payment', true),
    };

    return {
      ...apiParams,
    };
  }

  pay(): void {
    this.isSubmitting = true;
    this.payClientApiService.dynamicGetTicket('digipay/api/payment/marketplace/tickets', this.getPayApiParams()).subscribe({
      next: (result) => {
        const paymentData: PaymentDataInterface = {
          ticket: result?.ticket,
          amount: this.amount || 0,
          homeUrl: 'offline-payment',
          redirectUrl: result?.redirectUrl,
        };
        try {
          this.paymentService.processPayment(paymentData);
        } catch (error) {
          this.isSubmitting = false;
        }
      },
      error: (error: any) => {
        this.isSubmitting = false;
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }
}

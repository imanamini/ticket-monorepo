import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OfflinePaymentApiService } from '../../data-access/services/offline-payment-api.service';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { PayClientApiService, PaymentDataInterface, PaymentService, PaymentUrlService } from '@client-monorepo/payment/purchase';
import { MessageService } from '@client-monorepo/common/utilities';
import { JalaliDatePipe, PipesModule } from '@digipay/ng-lib-pipes';
import { InvoicePaymentResponse } from '../../data-access/models/invoice-payment.response';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'offline-payment-applet',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, ApiImageModule, PipesModule, DpIconComponent, NgxButtonComponent],
  templateUrl: './applets-offline-payment.component.html',
  styleUrl: './applets-offline-payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppletsOfflinePaymentComponent implements OnInit {
  trackingCode!: string;
  items!: InvoicePaymentResponse;
  isSubmitting = false;
  gettingData = signal(false);
  date = '';
  time = '';

  constructor(
    private paymentUrlService: PaymentUrlService,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private messageService: MessageService,
    private payClientApiService: PayClientApiService,
    private offlinePaymentApiService: OfflinePaymentApiService,
    private datePipe: JalaliDatePipe,
  ) {}

  ngOnInit(): void {
    this.trackingCode = this.route.snapshot.queryParams['trackingCode'];
    this.gettingData.set(true);
    this.offlinePaymentApiService.getInvoiceDetail(this.trackingCode).subscribe((data) => {
      this.date = this.datePipe.transform(data.creationDate, 'YYYY/MM/DD');
      this.time = this.datePipe.transform(data.creationDate, 'HH:mm');
      this.items = data;
      this.gettingData.set(false);
    });
  }

  getPayApiParams() {
    const apiParams = {
      uniqueNumber: this.items.uniqueInvoiceNumber,
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
          amount: this.items.totalAmount,
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

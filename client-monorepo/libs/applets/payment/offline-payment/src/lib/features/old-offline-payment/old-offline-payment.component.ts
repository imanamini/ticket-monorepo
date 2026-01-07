import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PayClientApiService,
  PaymentDataInterface,
  PaymentService,
  PaymentUrlService,
  TicketTypes
} from '@client-monorepo/payment/purchase';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@client-monorepo/common/utilities';
import { JalaliDatePipe, PipesModule } from '@digipay/ng-lib-pipes';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { OfflinePaymentApiService } from '../../data-access/services/offline-payment-api.service';
import { OldOfflinePaymentResponse } from '../../data-access/models/old-offline-payment-response.model';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'offline-payment-applet-old-offline-payment',
  standalone: true,
  imports: [CommonModule, ApiImageModule, PageLayoutComponent, PipesModule, NgxButtonComponent],
  templateUrl: './old-offline-payment.component.html',
  styleUrl: './old-offline-payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OldOfflinePaymentComponent implements OnInit {
  trackingCode!: string;
  items!: OldOfflinePaymentResponse;
  isSubmitting = false;

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
    this.offlinePaymentApiService.getOldInvoiceDetail(this.trackingCode).subscribe((data) => {
      data.date = this.datePipe.transform(data.creationDate, 'YYYY/MM/DD');
      data.time = this.datePipe.transform(data.creationDate, 'HH:mm');
      const obj: Array<any> = [];
      Object.values(data.details).map((item) => {
        obj.push({
          key: Object.keys(item)[0],
          value: Object.values(item)[0],
        });
      });
      data.details = obj;
      this.items = data;
    });
  }

  getPayApiParams() {
    const apiParams = {
      trackingCode: this.trackingCode,
      redirectUrl: this.paymentUrlService.setPaymentUrl('offline-payment', true),
    };

    return {
      ...apiParams,
    };
  }

  pay(): void {
    this.isSubmitting = true;
    this.payClientApiService.getTicket(TicketTypes.OFFLINE_PAYMENT, this.getPayApiParams()).subscribe({
      next: (result) => {
        const paymentData: PaymentDataInterface = {
          ticket: result?.ticket,
          amount: this.items.amount,
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

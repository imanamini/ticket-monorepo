import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { AdSummeryDetailComponent } from '../../components/ad-summery-detail/ad-summery-detail.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PaymentLinkApiService } from '../../data-access/api/payment-link-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { PaymentLinkDetail } from '../../data-access/model/payment-link-create.model';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { EscrowStorageService } from '@client-monorepo/escrow/utils';
import { PayClientApiService, PaymentChannel, PayMethodPickerService, TicketParams } from '@client-monorepo/payment/purchase';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { PaymentLinkCustomError, PaymentLinkError } from '../../data-access/model/payment-link-status-header.model';
import { MessageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'escrow-payment-link-detail',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    AdSummeryDetailComponent,
    NgxButtonComponent,
    NgxSpinnerModule,
    NgxCalloutComponent,
    NgxAppBarComponent,
  ],
  templateUrl: './payment-link-detail.component.html',
  styleUrl: './payment-link-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PaymentLinkApiService, EscrowStorageService],
})
export class PaymentLinkDetailComponent implements OnInit {
  private api = inject(PaymentLinkApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private message = inject(MessageService);
  storageService = inject(EscrowStorageService);
  payClientApi = inject(PayClientApiService);
  paymentMethodPicker = inject(PayMethodPickerService);
  data = signal<PaymentLinkDetail | undefined>(undefined);
  loading = computed(() => !this.data());

  ngOnInit(): void {
    this.getLinkDetails();
  }

  getLinkDetails(): void {
    this.route.queryParams.pipe(switchMap((param) => this.api.linkDetail(param['linkId']))).subscribe({
      next: (data) => {
        this.data.set(data);
        this.storageService.setItem('link-item', this.data()?.saleAdInfo);
      },
      error: () => {
        this.router.navigate(['payment-link/error'], { queryParams: { errorCode: PaymentLinkError.DEFAULT } });
      },
    });
  }

  gotToUPG(): void {
    const passToServer: TicketParams = {
      uniqueNumber: this.data()?.linkId as string,
      redirectUrl: window.location.origin + '/payment/result/payment-link',
      paymentChannel: PaymentChannel.PAYMENT_LINK,
    };
    this.payClientApi.dynamicGetTicket('digipay/api/payment/marketplace/tickets', passToServer).subscribe({
      next: (res) => {
        this.paymentMethodPicker.goToUpg(res.redirectUrl);
      },
      error: (err) => {
        // if (err.result.status === PaymentLinkCustomError.MARKETPLACE_LINK_EXPIRED) {
        //   this.router.navigate(['payment-link/error'], { queryParams: { errorCode: PaymentLinkError.LINK_EXPIRED } });
        // } else {
        //   this.message.showErrorMessage(err.result.message ?? 'خطایی رخ داده است');
        // }
      },
    });
  }
}

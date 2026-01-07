import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { BillValidationService } from '../../data-access/services/bill-validation.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { Router } from '@angular/router';
import { BillApiService } from '@client-monorepo/applets/bill';
import {
  AppPayFeaturesBody,
  DetailCardDataInterface,
  DetailCardEnum,
  PaymentCheckoutComponent,
  TicketInfoService,
} from '@client-monorepo/payment/checkout';
import { BillParams, PaymentUrlService, TicketTypes } from '@client-monorepo/payment/purchase';
import { finalize } from 'rxjs';
import { BillTypeEnum } from '@client-monorepo/daily-fintech/bill';
import { BillInfoResponse } from '../../data-access/models/bill-info-response.model';

@Component({
  selector: 'bill-applet-bill-confirm',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, PaymentCheckoutComponent],
  templateUrl: './bill-confirm.component.html',
  styleUrl: './bill-confirm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillConfirmComponent implements OnInit {
  ticketInfoService = inject(TicketInfoService);
  private paymentUrlService = inject(PaymentUrlService);
  private router = inject(Router);
  private billValidationService = inject(BillValidationService);
  private billApiService = inject(BillApiService);
  private messageService = inject(MessageService);

  appPayFeatureBody = signal<AppPayFeaturesBody>({} as AppPayFeaturesBody);
  paymentCardData = signal<DetailCardDataInterface>({} as DetailCardDataInterface);
  ticket = signal('');
  isDataCached = signal(false);
  isLoadingPage = signal(true);
  isSubmitting = false;
  payUrl = signal<string | null>(null);

  payMode = computed(() => {
    return BillTypeEnum.MTN_MOBILE === (this.appPayFeatureBody()?.additionalInfo as BillParams)?.billType ? 'sdk-v1' : 'app-pay';
  });
  billInfo = computed<BillInfoResponse | null>(() => this.billValidationService.billInfo());

  ngOnInit(): void {
    this.checkCacheData();
    if (this.isDataCached()) return;
    this.handlePreProcessingPage();
    this.billValidationService.isFastInquiry.set(false);
  }
  private handlePreProcessingPage(): void {
    if (this.billInfo()) {
      this.makeCardData();
      this.getBillConfig();
    } else {
      this.router.navigateByUrl('/bill', { replaceUrl: true }).then();
      return;
    }
  }

  private getBillConfig() {
    this.billApiService
      .getBillConfig()
      .pipe(finalize(() => this.isLoadingPage.set(false)))
      .subscribe({
        next: (result) => {
          this.payUrl.set(result.configs.filter((c) => c.type == this.billInfo()?.billType)[0].payUrl);
          this.setAppPayFeatureBody(); // We need both billInfo & payUrl to set appPayFeatureBody
        },
        error: (error: any) => {
          this.messageService.showErrorOfErrorResponse(error);
        },
      });
  }

  private checkCacheData(): void {
    const cachedData = this.ticketInfoService.getCachedTicketData();
    if (cachedData) {
      const { ticket, cardData, featureBody } = cachedData;
      this.isDataCached.set(true);
      this.appPayFeatureBody.set(featureBody);
      this.paymentCardData.set(cardData);
      this.ticket.set(ticket);
      this.isLoadingPage.set(false);
    }
  }
  setAppPayFeatureBody() {
    this.appPayFeatureBody.set({
      type: TicketTypes.BILL,
      homeUrl: 'bill',
      payUrl: this.payUrl() || '',
      amount: this.billInfo()?.amount ?? 0,
      additionalInfo: this.getPayApiParams(),
    });
  }
  getPayApiParams(): BillParams {
    const apiParams = {
      billId: this.billInfo()?.billId,
      payId: this.billInfo()?.payId,
      redirectUrl: this.paymentUrlService.setPaymentUrl('bill', true),
      billType: this.billInfo()?.billType,
      cashInCallbackUrl: this.paymentUrlService.setCashInCallBackUrl('bill'),
    };
    return {
      ...apiParams,
    } as BillParams;
  }
  private makeCardData(): void {
    this.paymentCardData.set({
      title: this.billInfo()?.name ?? '',
      imageId: this.billInfo()?.imageId ?? '',
      details: [
        { label: 'شناسه قبض', value: this.billInfo()?.billId, type: DetailCardEnum.NUMBER },
        { label: 'شناسه پرداخت', value: this.billInfo()?.payId, type: DetailCardEnum.NUMBER },
      ],
    });
  }
}

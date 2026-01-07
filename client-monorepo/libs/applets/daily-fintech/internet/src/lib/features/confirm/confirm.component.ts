import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { Router } from '@angular/router';
import { InternetService } from '@client-monorepo/applets/internet';
import { InternetConfirm } from '../../data-access/models/internet-confirm.model';
import { InternetPackage } from '../../data-access/models/internet-purchase.response';
import { PayClientApiService, PaymentService, PaymentUrlService, TicketTypes } from '@client-monorepo/payment/purchase';
import { MessageService } from '@client-monorepo/common/utilities';
import {
  AppPayFeaturesBody,
  DetailCardDataInterface,
  DetailCardEnum,
  PaymentCheckoutComponent,
  TicketInfoService,
} from '@client-monorepo/payment/checkout';

@Component({
  selector: 'internet-applet-confirm',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, PaymentCheckoutComponent],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmComponent implements OnInit {
  isSubmitting = signal<boolean>(false);
  paymentCardData = signal<DetailCardDataInterface>({} as DetailCardDataInterface);
  appPayFeatureBody = signal<AppPayFeaturesBody>({} as AppPayFeaturesBody);
  ticket = signal('');
  isLoadingPage = signal(true);
  isDataCached = signal(false);
  ticketInfoService = inject(TicketInfoService);
  package!: InternetPackage;
  confirmModel: InternetConfirm = new InternetConfirm();
  router = inject(Router);
  internetService = inject(InternetService);
  payClientApiService = inject(PayClientApiService);
  paymentUrlService = inject(PaymentUrlService);
  paymentService = inject(PaymentService);
  messageService = inject(MessageService);
  ngOnInit(): void {
    this.checkCacheData();
    if (this.isDataCached()) return;
    this.internetService.getConfirmData().subscribe((data) => {
      if (data === null) {
        this.router.navigateByUrl('/internet').then();
        return;
      } else {
        this.confirmModel = {
          simType: data?.simType,
          bundleTitle: data?.bundleTitle,
          cellNumber: data?.cellNumber,
          operatorId: data?.operatorId,
          operatorName: data?.operatorName,
          operator: data?.operator,
        };

        this.internetService.getPackageData().subscribe((result) => {
          if (result !== null) {
            this.package = result;
          }
        });
      }
    });
    this.makeCardData();
    this.setAppPayFeatureBody();
    this.isLoadingPage.set(false);
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
  getPayApiParams() {
    const apiParams = {
      targetedCellNumber: this.confirmModel.cellNumber,
      operatorId: Number(this.confirmModel.operatorId ?? 0),
      redirectUrl: this.paymentUrlService.setPaymentUrl('internet', true),
      cashInCallbackUrl: this.paymentUrlService.setCashInCallBackUrl('internet'),
      internetPackage: {
        bundleId: this.package.bundleId,
        amount: this.package.amount,
        description: this.package.description,
        duration: this.package.duration,
      },
    };

    return {
      ...apiParams,
    };
  }
  setAppPayFeatureBody() {
    this.appPayFeatureBody.set({
      type: TicketTypes.INTERNET_PACKAGE,
      homeUrl: 'internet',
      amount: this.package?.amount,
      additionalInfo: this.getPayApiParams(),
    });
  }
  private makeCardData(): void {
    this.paymentCardData.set({
      title: `بسته اینترنت ${this.confirmModel.operator.name}`,
      imageId: this.confirmModel.operator.imageId || '',
      details: [
        { label: 'جزییات بسته', value: this.package.description, type: DetailCardEnum.STRING },
        { label: 'شماره همراه', value: this.confirmModel.cellNumber, type: DetailCardEnum.PHONE_NUMBER },
      ],
    });
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as Sentry from '@sentry/angular-ivy';
import { PageManagementService } from '../data-access/services/page-management.service';
import { TicketInfoService } from '../data-access/services/ticket-info.service';
import { FactoryService } from '../data-access/services/factory.service';
import { CommonModule } from '@angular/common';
import { PaymentMethodComponent } from '../components/payment-method/payment-method.component';
import { CardFooterComponent } from '../components/card/components/card-footer/card-footer.component';
import { PAYMENT_METHOD_DEFAULT_CARD_CONFIG } from '../data-access/consts/payment-method-card-config';
import { CardConfigInterface } from '../data-access/models/card-config.interface';
import { PaymentMethodService } from '../data-access/services/payment-method.service';
import { APP_ACTIONS } from '@client-monorepo/common/action-handler';
import { PaymentMethodStrategyInterface } from '../data-access/models/payment-method-strategy.interface';
import { PaymentWallet } from '../components/payment-method/utiles/payment-wallet';
import { PaymentIpg } from '../components/payment-method/utiles/payment-ipg';
import { PaymentCpg } from '../components/payment-method/utiles/payment-cpg';
import { PaymentBpg1Pay } from '../components/payment-method/utiles/payment-bpg-1pay';
import { PaymentBpg4Pay } from '../components/payment-method/utiles/payment-bpg-4pay';
import { PaymentCashInAndPay } from '../components/payment-method/utiles/payment-cash-in-and-pay';
import { PaymentIcp } from '../components/payment-method/utiles/payment-icp';
import { PaymentCreditCard } from '../components/payment-method/utiles/payment-credit-card';
import { PaymentCashOut } from '../components/payment-method/utiles/payment-cash-out';
import { AppPayFeaturesBody } from '../data-access/models/app-pay-features-body.interface';
import { MessageService, StorageService } from '@client-monorepo/common/utilities';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { PaymentMethodSkeletonComponent } from '../components/payment-method-skeleton/payment-method-skeleton.component';
import { PaymentDetailCardComponent } from '../components/payment-detail-card/payment-detail-card.component';
import { DetailCardDataInterface } from '../data-access/models/detail-card-data.interface';
import { PayModeType } from '../data-access/models/pay-mode.type';
import { PayClientApiService, PaymentDataInterface, PaymentService, TicketTypes } from '@client-monorepo/payment/purchase';
import { AutoSubmitService } from '../data-access/services/auto-submit.service';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { map } from 'rxjs/operators';
import { TicketInfoStatus } from '../data-access/models/ticket-info-status.enum';
import { PayMethodMapper } from '../data-access/models/pay-method-mapper';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';

@Component({
  selector: 'payment-checkout-main',
  standalone: true,
  imports: [CommonModule, PaymentMethodComponent, CardFooterComponent, PaymentMethodSkeletonComponent, PaymentDetailCardComponent],
  templateUrl: './checkout-main.component.html',
  styleUrls: ['./checkout-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentCheckoutComponent implements OnInit {
  methodStrategy: Partial<Record<APP_ACTIONS, PaymentMethodStrategyInterface>> = {
    [APP_ACTIONS.PAYMENT_WALLET]: new PaymentWallet(),
    [APP_ACTIONS.PAYMENT_IPG]: new PaymentIpg(),
    [APP_ACTIONS.PAYMENT_CPG]: new PaymentCpg(),
    [APP_ACTIONS.PAYMENT_BPG_1PAY]: new PaymentBpg1Pay(),
    [APP_ACTIONS.PAYMENT_BPG_4PAY]: new PaymentBpg4Pay(),
    [APP_ACTIONS.WALLET_CASH_IN_IPG]: new PaymentCashInAndPay(),
    [APP_ACTIONS.PAYMENT_ICP]: new PaymentIcp(),
    [APP_ACTIONS.PAYMENT_CAPG]: new PaymentCreditCard(),
    [APP_ACTIONS.CASH_OUT]: new PaymentCashOut(),
  };
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;
  public cardConfig: CardConfigInterface = PAYMENT_METHOD_DEFAULT_CARD_CONFIG;
  paymentCardData = input<DetailCardDataInterface>({} as DetailCardDataInterface);
  appPayFeatureBody = input<AppPayFeaturesBody>({} as AppPayFeaturesBody);
  cachedTicket = input<string>();
  payMode = input<PayModeType>('app-pay');
  submitText = computed(() => {
    const selectedFeature = this.paymentMethodService.selectedFeature();
    const activeCardConfig = selectedFeature
      ? (this.methodStrategy[selectedFeature.method]!.config() as CardConfigInterface)
      : this.cardConfig;

    return selectedFeature?.quick ? activeCardConfig.quickSubmitText : activeCardConfig.submitText;
  });
  fallbackFunction = output();
  showPaymentMethod = computed(() => this.payMode() === 'app-pay');
  isButtonDisabled = computed(() => {
    if (this.payMode() !== 'app-pay') {
      return false;
    }
    return (
      !this.paymentMethodService?.selectedFeature() || this.paymentMethodService?.selectedFeature()?.status === TicketInfoStatus.INACTIVE
    );
  });
  hasCustomBack = input<boolean>(false);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private pageManagementService = inject(PageManagementService);
  public ticketInfoService = inject(TicketInfoService);
  public paymentMethodService = inject(PaymentMethodService);
  public storageService = inject(StorageService);
  public messageService = inject(MessageService);
  public payClientApiService = inject(PayClientApiService);
  public paymentService = inject(PaymentService);
  public autoSubmitService = inject(AutoSubmitService);
  private backHandlerSerivce = inject(BackHandlerService);
  public loadingApis = signal(true);
  public loadingSubmit = signal(false);
  footerLoading = computed(() => this.payMode() === 'app-pay' && this.loadingApis());
  private eventService = inject(NgxEventTrackerService);

  constructor() {
    this.ticketInfoService.revisingCachedTickets();
    Sentry.setTag('module', 'UPG-Front-Module');
  }

  ngOnInit() {
    this.handlePreProcessingPage();
  }

  private handlePreProcessingPage(): void {
    // in other modes all the things handle in upg
    if (this.payMode() !== 'app-pay') {
      return;
    }
    if (this.cachedTicket()) {
      this.ticketInfoService.ticket.set(this.cachedTicket() as string);
      this.getFeatures();
      return;
    }
    this.getAppPayTicket().subscribe();
  }

  /**
   * Get Features From Api (For payMode === app-pay)
   */
  private getFeatures() {
    this.ticketInfoService
      .getAppPayFeatures(this.appPayFeatureBody())
      .pipe(
        finalize(() => {
          this.loadingApis.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.autoSubmitService.setConfigToAutoSubmit(
            this.autoSubmitService.autoSubmitFrom(this.activatedRoute, this.ticketInfoService.state.features)!,
          );
          this.initiatePage();
          this.ticketInfoService.appPayFeaturesBody.set(this.appPayFeatureBody());
          this.loadingApis.set(false);
        },
        error: (error) => {
          this.messageService.showErrorOfErrorResponse(error);
          this.ticketInfoService.removeCachedTicket();
          if (this.hasCustomBack()) {
            this.fallbackFunction.emit();
            return;
          }
          this.backHandlerSerivce.goBack();
        },
      });
  }

  private getAppPayTicket(): Observable<string> {
    return this.ticketInfoService.getAppPayTicket(this.appPayFeatureBody()).pipe(
      tap((response) => {
        this.getFeatures();
        this.ticketInfoService.cacheTicketData(response.ticket, this.paymentCardData(), this.appPayFeatureBody());
        setTimeout(() => this.addTicketToQueryParams(response.ticket), 100);
      }),
      map((response) => response.ticket),
      catchError((error) => {
        this.messageService.showErrorOfErrorResponse(error);
        if (this.hasCustomBack()) {
          this.fallbackFunction.emit();
        } else {
          this.backHandlerSerivce.goBack();
        }
        return throwError(() => error); // Rethrow error if needed
      }),
    );
  }

  private initiatePage(): void {
    this.setComponentLoadedContainer();
    this.getPageQueryParam().then();
  }

  private async getPageQueryParam() {
    const page = this.activatedRoute.snapshot.queryParams['page'];
    if (!page) {
      return;
    }
    this.pageManagementService.implement(page);
  }

  private addTicketToQueryParams(ticket: string) {
    this.router.navigate([], { queryParams: { ticket }, queryParamsHandling: 'merge', replaceUrl: true });
  }

  private activeSelectedFeatureName() {
    const featureName = this.paymentMethodService.selectedFeature()?.method;
    this.methodStrategy[featureName!]?.next().finally(() => {
      this.loadingSubmit.set(false);
    });
  }

  private setComponentLoadedContainer(): void {
    FactoryService.container = this.container;
  }

  private payByAppPayVersion() {
    if (this.appPayFeatureBody().type === TicketTypes.INTERNET_PACKAGE) {
      this.sendIntrackEvent();
    }
    this.activeSelectedFeatureName();
  }

  private sendIntrackEvent() {
    const eventData = {
      eventName: 'internet-checkout',
      eventData: {
        final_price: this.appPayFeatureBody()?.amount,
        payment_way: PayMethodMapper[Number(this.paymentMethodService.selectedFeature()?.method)],
      },
    };
    // this.eventService.sendEvent(eventData);
  }

  private payByOldVersions(): void {
    const { type, amount, additionalInfo, payUrl, homeUrl } = this.appPayFeatureBody();
    const getTicketFunction =
      this.payMode() === 'sdk-v1'
        ? this.payClientApiService.dynamicGetTicket(payUrl as string, additionalInfo)
        : this.payClientApiService.getTicket(type, additionalInfo);
    getTicketFunction.pipe(finalize(() => this.loadingSubmit.set(false))).subscribe({
      next: (result) => {
        const paymentData: PaymentDataInterface = {
          ticket: result?.ticket,
          amount: amount,
          homeUrl: homeUrl as string,
          redirectUrl: result?.redirectUrl,
        };
        try {
          this.paymentService.processPayment(paymentData);
        } catch (error) {
          this.messageService.showErrorOfErrorResponse(error);
        }
      },
      error: (error: any) => {
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  public submit(): void {
    this.loadingSubmit.set(true);
    switch (this.payMode()) {
      case 'app-pay':
        this.payByAppPayVersion();
        break;
      case 'sdk-v1':
      case 'sdk-v2':
        this.payByOldVersions();
        break;
    }
  }

  public handleTtlExpiration() {
    this.getAppPayTicket().subscribe({
      next: () => setTimeout(() => window.location.reload(), 500),
    });
  }
}

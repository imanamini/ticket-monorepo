import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { PAYMENT_METHOD_DEFAULT_CARD_CONFIG } from '../../data-access/consts/payment-method-card-config';
import { ActivatedRoute } from '@angular/router';
import { PaymentMethodStrategyInterface } from '../../data-access/models/payment-method-strategy.interface';
import { PaymentMethodService } from '../../data-access/services/payment-method.service';
import { FeatureInformationService } from '../../data-access/services/feature-information.service';
import { CashInRedirectHandling } from '../redirect-cash-in/cash-in-redirect-handling';
import * as Sentry from '@sentry/angular-ivy';
import { CardConfigInterface } from '../../data-access/models/card-config.interface';
import { PaymentUnknown } from './utiles/payment-unknown';
import { CreditFeatureService } from '../../data-access/services/credit-feature.service';
import { WalletBalanceService } from '../../data-access/services/wallet-balance.service';
import { TicketInfoService } from '@client-monorepo/payment/checkout';
import { AutoSubmitService } from '../../data-access/services/auto-submit.service';
import { APP_ACTIONS } from '@client-monorepo/common/action-handler';
import { HandleStyle } from '../../utils/handle-style';
import { FlagEnum } from '../../data-access/models/flag.enum';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CommonModule } from '@angular/common';
import { TicketInfoStatus } from '../../data-access/models/ticket-info-status.enum';
import { PageEnum } from '../../data-access/models/page.enum';
import { TicketInfoFeature } from '../../data-access/models/app-pay-features.response';
import { NgxRadioButtonComponent } from '@digipay/ngx-radio-button';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { filter, takeWhile } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxCountDownComponent } from '@digipay/ngx-count-down';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';

@Component({
  selector: 'payment-checkout-payment-method',
  standalone: true,
  imports: [
    PipesModule,
    CommonModule,
    NgxRadioButtonComponent,
    ApiImageModule,
    NgxCountDownComponent,
    NgxButtonComponent,
    NgxTooltipDirective,
  ],
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodComponent implements OnInit {
  public cardConfig: CardConfigInterface = PAYMENT_METHOD_DEFAULT_CARD_CONFIG;
  methodStrategy = input<Partial<Record<APP_ACTIONS, PaymentMethodStrategyInterface>>>();
  expiredTtl = output();
  time = computed(() => Math.floor(this.ticketInfoService.ttl() / 1000)); // time should be in seconds
  public loadingPage = signal(true);
  public loadingSubmit = signal(false);
  public hasExistHiddenFeatures = signal(false);
  public ticket = '';
  public TicketInfoStatusEnum = TicketInfoStatus;

  public creditFeatureService = inject(CreditFeatureService);
  public paymentMethodService = inject(PaymentMethodService);
  public walletBalanceService = inject(WalletBalanceService);
  public ticketInfoService = inject(TicketInfoService);
  public featureInformationService = inject(FeatureInformationService);
  private activatedRoute = inject(ActivatedRoute);
  private autoSubmitService = inject(AutoSubmitService);
  private PaymentUnknownClass = new PaymentUnknown();

  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module');
  }

  ngOnInit(): void {
    this.ticket = this.activatedRoute.snapshot.queryParams['ticket'];
    this.handleCashInRedirect();
    this.getStates().then();
  }

  public onSelectFeature(element: HTMLElement, item: TicketInfoFeature): void {
    const inactiveFeature = this.TicketInfoStatusEnum[item.status] === 'INACTIVE';
    if (inactiveFeature) {
      new HandleStyle().animate(element);
      return;
    }
    this.paymentMethodService.selectFeature(item);
    this.isKnownUpgFeatureName(item.name);
    this.updateCardConfig();
  }

  public async submit(): Promise<void> {
    this.loadingSubmit.set(true);
    const featureName = this.paymentMethodService.selectedFeature()?.method;
    if (featureName) {
      this.methodStrategy()
        ?.[featureName]?.next()
        .finally(() => {
          this.loadingSubmit.set(false);
        });
    } else {
      this.loadingSubmit.set(false);
    }
  }

  private async handleAutoSelect() {
    const isPaymentPageForceToAutoSubmit = Boolean(this.autoSubmitService.getState());
    const queryParamsSub = this.activatedRoute.queryParams
      .pipe(
        map((params) => params['page']),
        filter((page) => page === PageEnum.PAYMENT_METHOD),
      )
      .subscribe(async () => {
        if (isPaymentPageForceToAutoSubmit && this.autoSubmitService.isRedirectCashIn()) {
          queryParamsSub.unsubscribe();
          this.autoSubmitService.isRedirectCashIn.set(false);
          await this.autoSelect();
          this.submit().then();
          return;
        }
      });
  }
  private async getStates(): Promise<void> {
    await this.handleAutoSelect();
    this.ticketInfoService.state.features = this.paymentMethodService.sortFeatures(this.ticketInfoService?.state?.features);
    const hasHiddenFeatures = this.paymentMethodService.checkIfThereIsAHiddenFeature(this.ticketInfoService.state.features);
    this.hasExistHiddenFeatures.set(hasHiddenFeatures);
    this.initialSelectedMethod();
    this.isKnownUpgFeatureName(this.paymentMethodService?.selectedFeature()?.method ?? 0);
    this.updateCardConfig();
    this.loadingPage.set(false);
  }

  private updateCardConfig(): void {
    if (this.paymentMethodService.selectedFeature()) {
      this.cardConfig = this.methodStrategy()?.[this.paymentMethodService.selectedFeature()!.method]!.config() as CardConfigInterface;
    }
  }

  private initialSelectedMethod(): void {
    const selectedMethod: string = this.activatedRoute.snapshot.queryParams['method'];
    this.paymentMethodService.updateSelectedFeature(this.ticketInfoService.state.features, selectedMethod);
  }

  private autoSelect(): void {
    switch (this.autoSubmitService.getState()) {
      case 'PREFERRED_GATEWAY': {
        const itemWithTruePreferredGateway: TicketInfoFeature = this.ticketInfoService.state.features.filter(
          (item: TicketInfoFeature) => item.isPreferredGateway,
        )[0];
        this.paymentMethodService.selectFeature(itemWithTruePreferredGateway);
        break;
      }

      case 'REDIRECT_CASH_IN': {
        this.ticketInfoService.state.features = new CashInRedirectHandling().mapperFeatures(this.ticketInfoService.state.features);
        // we have the redirect cash in feature in the callback of wallet feature, so we have to get that and replace with wallet feature.
        const callbackFeature: TicketInfoFeature = this.ticketInfoService.state.features.filter(
          (item: TicketInfoFeature) => Number(item.name) === APP_ACTIONS.PAYMENT_WALLET,
        )[0];
        this.paymentMethodService.selectFeature(callbackFeature);
        break;
      }

      case 'SINGLE_FEATURE':
        this.paymentMethodService.selectFeature(this.ticketInfoService.state.features[0]);
        break;
    }
  }

  private handleCashInRedirect() {
    this.activatedRoute.queryParams
      .pipe(
        map((params) => params['flag']),
        filter((flag) => flag === FlagEnum.CASH_IN_REDIRECT),
        takeWhile(() => !this.autoSubmitService.isRedirectCashIn(), true), // Continue until isRedirectCashIn() is true
      )
      .subscribe(async () => {
        if (this.autoSubmitService.isRedirectCashIn()) {
          this.callBalance();
          this.mapperFeatureForRedirectFromCashing();
        }
      });
  }

  private callBalance(): void {
    // We need balance value when user come back after cashing, because balance of wallet of ticket info api does not update!
    this.walletBalanceService.get().then();
  }

  private mapperFeatureForRedirectFromCashing(): void {
    this.ticketInfoService.state.features = new CashInRedirectHandling().mapperFeatures(this.ticketInfoService.state.features);
  }

  private isKnownUpgFeatureName(featureName: any) {
    if (!featureName) {
      return;
    }
    const featureExistsInStrategy: boolean = Object.prototype.hasOwnProperty.call(this.methodStrategy, featureName);
    if (featureExistsInStrategy) {
      return;
    }
    this.addUnknownPaymentActionToMethodStrategy(featureName);
  }

  private addUnknownPaymentActionToMethodStrategy(unknownFeatureName: number): void {
    const unknownPaymentAction: Record<number, PaymentMethodStrategyInterface> = {};
    unknownPaymentAction[unknownFeatureName] = this.PaymentUnknownClass;
    Object.assign(this.methodStrategy, unknownPaymentAction);
  }

  protected readonly APP_ACTIONS = APP_ACTIONS;
}

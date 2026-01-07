import {Component, inject, OnInit} from '@angular/core';
import {PAYMENT_METHOD_DEFAULT_CARD_CONFIG} from './consts/payment-method-card-config';
import {TicketInfoFeature} from '../../../../api/models/tgs-ticket-info.response';
import {ActivatedRoute} from '@angular/router';
import {UpgFeatureName} from '../../../../api/emuns/upg-feature-name.emun';
import {TicketInfoStatus} from '../../../../api/emuns/ticket-info-status.enum';
import {WalletBalanceService} from '../../services/wallet-balance.service';
import {TicketInfoService} from '../../services/ticket-info.service';
import {CreditFeatureService} from '../../services/credit-feature.service';
import {PaymentMethodStrategyInterface} from './models/payment-method-strategy.interface';
import {PaymentWallet} from './utiles/payment-wallet';
import {PaymentIpg} from './utiles/payment-ipg';
import {PaymentCpg} from './utiles/payment-cpg';
import {PaymentBpg} from './utiles/payment-bpg';
import {PaymentCashInAndPay} from './utiles/payment-cash-in-and-pay';
import {PaymentMethodService} from './services/payment-method.service';
import {HandleStyle} from '../../utils/handle-style';
import {FeatureInformationService} from './services/feature-information.service';
import {AutoSubmitService} from '../../services/auto-submit.service';
import {PageEnum} from '../../enums/page.enum';
import {FlagEnum} from '../../enums/flag.enum';
import {CashInRedirectHandling} from '../redirect-cash-in/cash-in-redirect-handling';
import {PaymentCreditCard} from './utiles/payment-credit-card';
import * as Sentry from "@sentry/angular-ivy";
import {CardConfigInterface} from "../card/card-config.interface";
import {PaymentUnknown} from "./utiles/payment-unknown";
import {PaymentIcp} from "./utiles/payment-icp";
import { PaymentCashOut } from './utiles/payment-cash-out';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent implements OnInit {
  public cardConfig: CardConfigInterface = PAYMENT_METHOD_DEFAULT_CARD_CONFIG;
  currencyText = "قابل پرداخت";
  public loadingPage: boolean = true;
  public loadingSubmit: boolean = false;
  public hasExistHiddenFeatures: boolean = false;
  public ticket: string;
  public TicketInfoStatusEnum = TicketInfoStatus;
  public UpgFeatureName = UpgFeatureName;

  public creditFeatureService = inject(CreditFeatureService);
  public paymentMethodService = inject(PaymentMethodService);
  public walletBalanceService = inject(WalletBalanceService);
  public ticketInfoService = inject(TicketInfoService);
  public featureInformationService = inject(FeatureInformationService);
  private activatedRoute = inject(ActivatedRoute);
  private autoSubmitService = inject(AutoSubmitService);
  private PaymentUnknownClass = new PaymentUnknown();

  // @ts-ignore
  private methodStrategy: Record<Partial<UpgFeatureName>, PaymentMethodStrategyInterface> = {
    [UpgFeatureName.PAYMENT_WALLET]: new PaymentWallet(),
    [UpgFeatureName.PAYMENT_IPG]: new PaymentIpg(),
    [UpgFeatureName.PAYMENT_CPG]: new PaymentCpg(),
    [UpgFeatureName.PAYMENT_BPG]: new PaymentBpg(),
    [UpgFeatureName.WALLET_CASH_IN_IPG]: new PaymentCashInAndPay(),
    [UpgFeatureName.PAYMENT_ICP]: new PaymentIcp(),
    [UpgFeatureName.PAYMENT_CAPG]: new PaymentCreditCard(),
    [UpgFeatureName.CASH_OUT]: new PaymentCashOut(),
  };

  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module')
  }

  ngOnInit(): void {
    this.ticket = this.activatedRoute.snapshot.params['ticket'];
    this.callBalance();
    this.mapperFeatureForRedirectFromCashing();
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
    this.loadingSubmit = true;
    this.methodStrategy[this.paymentMethodService.selectedFeature.name].next()
      .finally(()=>{
        this.loadingSubmit = false;
      })
  }

  private async getStates(): Promise<void> {
    const isPaymentPageForceToAutoSubmit: boolean = Boolean(this.autoSubmitService.getState());
    const isActivatedRoutePaymentMethod: boolean = this.activatedRoute.snapshot.queryParams['page'] === PageEnum.PAYMENT_METHOD;
    if (isPaymentPageForceToAutoSubmit && isActivatedRoutePaymentMethod) {
      await this.autoSelect();
      this.submit().then();
      return;
    }
    this.ticketInfoService.state.features = this.paymentMethodService.sortFeatures(this.ticketInfoService.state.features);
    this.hasExistHiddenFeatures = this.paymentMethodService.checkIfThereIsAHiddenFeature(this.ticketInfoService.state.features);
    this.initialSelectedMethod();
    this.isKnownUpgFeatureName(this.paymentMethodService?.selectedFeature?.name);
    this.updateCardConfig();
    this.loadingPage = false;
  }

  private updateCardConfig(): void {
    if (this.paymentMethodService.selectedFeature) {
      this.cardConfig = this.methodStrategy[this.paymentMethodService.selectedFeature.name].config();
    }
  }

  private initialSelectedMethod(): void {
    const selectedMethod: string = this.activatedRoute.snapshot.queryParams['method'];
    this.paymentMethodService.updateSelectedFeature(this.ticketInfoService.state.features, selectedMethod);
  }

  private autoSelect(): void {
    switch (this.autoSubmitService.getState()) {
      case 'PREFERRED_GATEWAY':
        const itemWithTruePreferredGateway: TicketInfoFeature = this.ticketInfoService.state.features.filter((item: TicketInfoFeature) => item.isPreferredGateway === true)[0];
        this.paymentMethodService.selectFeature(itemWithTruePreferredGateway);
        break;

      case 'REDIRECT_CASH_IN':
        this.ticketInfoService.state.features = new CashInRedirectHandling().mapperFeatures(this.ticketInfoService.state.features);
        // we have the redirect cash in feature in the callback of wallet feature, so we have to get that and replace with wallet feature.
        const callbackFeature: TicketInfoFeature = this.ticketInfoService.state.features.filter((item: TicketInfoFeature) => Number(item.name) === UpgFeatureName.PAYMENT_WALLET)[0];
        this.paymentMethodService.selectFeature(callbackFeature);
        break;

      case 'SINGLE_FEATURE':
        this.paymentMethodService.selectFeature(this.ticketInfoService.state.features[0]);
        break;
    }
  }

  private callBalance(): void {
    if (this.activatedRoute.snapshot.queryParams['flag'] === FlagEnum.CASH_IN_REDIRECT) {
      // We need balance value when user come back after cashing, because balance of wallet of ticket info api does not update!
      this.walletBalanceService.get().then();
    }
  }

  private mapperFeatureForRedirectFromCashing(): void {
    if (this.activatedRoute.snapshot.queryParams['flag'] === FlagEnum.CASH_IN_REDIRECT) {
      this.ticketInfoService.state.features = new CashInRedirectHandling().mapperFeatures(this.ticketInfoService.state.features);
    }
  }

  private isKnownUpgFeatureName(featureName: number): featureName is UpgFeatureName {
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
}

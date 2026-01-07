import {PaymentMethodService} from './../payment-method/services/payment-method.service';
import {Component, inject, OnInit, signal, ViewChild} from '@angular/core';
import {ApiResult} from '../../../../api/models/api-result';
import {CardConfigInterface} from '../card/card-config.interface';
import {PIN_CARD_CONFIG, PIN_PAYMENT_WALLET_CARD_CONFIG} from './consts/pin-card-config';
import {WalletApiService} from '../../../../api/wallet-api.service';
import {UpgFeatureName} from '../../../../api/emuns/upg-feature-name.emun';
import {TicketInfoService} from '../../services/ticket-info.service';
import {finalize} from 'rxjs';
import {PayByWalletService} from '../wallet-pay/pay-by-wallet.service';
import {ActivatedRoute} from '@angular/router';
import {UserInformationService} from '../../services/user-information.service';
import {UserDetail} from '../../../../api/models/tac.response';
import {HandleErrorService} from '../../services/handle-error.service';
import {ErrorStatus} from '../../enums/error-status.enum';
import {TgsSelectFeatureResponse} from '../../../../api/models/tgs-select-feature-response';
import {FeatureInformationService} from '../payment-method/services/feature-information.service';
import * as Sentry from '@sentry/angular-ivy';
import {UiPinInputComponent} from 'src/app/user-interface/components/new-pin-otp/ui-pin-input/ui-pin-input.component';
import {PaymentMethodStrategyInterface} from '../payment-method/models/payment-method-strategy.interface';
import {PaymentWallet} from '../payment-method/utiles/payment-wallet';
import {PaymentIpg} from '../payment-method/utiles/payment-ipg';
import {PaymentCpg} from '../payment-method/utiles/payment-cpg';
import {PaymentBpg} from '../payment-method/utiles/payment-bpg';
import {PaymentCashInAndPay} from '../payment-method/utiles/payment-cash-in-and-pay';
import {PaymentIcp} from '../payment-method/utiles/payment-icp';
import {PaymentCreditCard} from '../payment-method/utiles/payment-credit-card';
import {WalletBalanceService} from '../../services/wallet-balance.service';
import {parseFaNum} from 'src/app/utils/parse-fa-num';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss']
})
export class PinComponent implements OnInit {
  public walletApiService = inject(WalletApiService);
  protected ticketInfoService = inject(TicketInfoService);
  private payByWalletService = inject(PayByWalletService);
  protected activatedRoute = inject(ActivatedRoute);
  private userService = inject(UserInformationService);
  protected handleErrorService = inject(HandleErrorService);
  @ViewChild('otp') otpComponent: UiPinInputComponent;

  public cardConfig: CardConfigInterface = PIN_PAYMENT_WALLET_CARD_CONFIG;
  public user: UserDetail;
  public loadingSubmit: boolean = false;
  public invalidMessage: string;
  protected selectedFeatureName: number;
  protected selectedFeatureMethod: string;
  protected featureInformationService = inject(FeatureInformationService);
  public paymentMethodService = inject(PaymentMethodService);
  public creditBalance = signal<number>(0);

  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module');
  }

  async ngOnInit() {
    this.getSelectedFeatureMethod();
    this.getSelectedFeatureName();
    this.updateCardConfig();

    if (!this.paymentMethodService.selectedFeature) {
      this.paymentMethodService.updateSelectedFeature(this.ticketInfoService.state.features, this.selectedFeatureMethod);
    }

    this.creditBalance.set(parseFaNum(this.paymentMethodService.selectedFeature.description));

    this.user = await this.userService.get();
  }

  public login(pin: string): void {
    if (pin.length < 4) {
      return;
    }
    this.loadingSubmit = true;
    this.invalidMessage = null;
    this.walletApiService
      .loginUser(this.user.userId, pin, [this.selectedFeatureName], this.ticketInfoService.ticket)
      .pipe(finalize(() => (this.loadingSubmit = false)))
      .subscribe({
        next: async () => {
          const info = await this.featureInformationService.getLatestSelectedFeatureInfo(this.selectedFeatureName);
          switch (this.selectedFeatureName) {
            case UpgFeatureName.PAYMENT_WALLET:
            case UpgFeatureName.WALLET_CASH_IN_IPG:
            case UpgFeatureName.PAYMENT_ICP:
              this.payByWalletService.completePaymentProcess(info).then();
              break;

            default:
              document.location.replace(info.payUrl);
              break;
          }
        },
        error: (errorResponse: ApiResult) => {
          if (this.invalidPin(errorResponse) === false) {
            this.handleErrorService.check(errorResponse);
          }
        }
      });
  }

  private getSelectedFeatureName(): void {
    this.selectedFeatureName = Number(UpgFeatureName[this.selectedFeatureMethod]);
  }

  private getSelectedFeatureMethod(): void {
    this.selectedFeatureMethod = this.activatedRoute.snapshot.queryParams['method'];
  }

  private updateCardConfig(): void {
    if (this.selectedFeatureName && PIN_CARD_CONFIG[this.selectedFeatureName]) {
      this.cardConfig = PIN_CARD_CONFIG[this.selectedFeatureName];
    }
  }

  protected invalidPin(errorResponse: ApiResult): boolean {
    if (
      errorResponse?.error?.result?.status === ErrorStatus.INVALID_PIN ||
      errorResponse?.error?.result?.status === ErrorStatus.INVALID_PIN_2
    ) {
      this.invalidMessage = 'رمز عبور وارد شده اشتباه است. دوباره تلاش کنید.';
      this.otpComponent.clearInputs();
      this.otpComponent.clearValue();
      this.otpComponent.focusOnFirstInput();
      return true;
    }
    return false;
  }
}

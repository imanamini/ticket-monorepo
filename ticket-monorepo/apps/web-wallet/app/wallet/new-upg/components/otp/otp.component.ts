import {Component, inject, OnInit, signal, ViewChild} from '@angular/core';
import {CardConfigInterface} from '../card/card-config.interface';
import {TicketInfoService} from '../../services/ticket-info.service';
import {PayByWalletService} from '../wallet-pay/pay-by-wallet.service';
import {TgsSelectFeatureResponse} from '../../../../api/models/tgs-select-feature-response';
import {OTP_CARD_CONFIG, OTP_PAYMENT_WALLET_CARD_CONFIG} from './consts/otp-card-config';
import {PERSISTENT_STORAGE_KEYS} from '../../../../core/constants';
import {ApiResult} from '../../../../api/models/api-result';
import {VerificationService} from '../../../auth/verification.service';
import {UpgFeatureName} from '../../../../api/emuns/upg-feature-name.emun';
import {TimerService} from './timer.service';
import {ActivatedRoute} from '@angular/router';
import {UserInformationService} from '../../services/user-information.service';
import {UserDetail} from '../../../../api/models/tac.response';
import {HandleErrorService} from '../../services/handle-error.service';
import {ErrorStatus} from '../../enums/error-status.enum';
import {FeatureInformationService} from '../payment-method/services/feature-information.service';
import {UiPinInputComponent} from 'src/app/user-interface/components/new-pin-otp/ui-pin-input/ui-pin-input.component';
import * as Sentry from '@sentry/angular-ivy';
import {ErrorStatusEnum} from '../../../../api/emuns/error-status.enum';
import {WalletBalanceService} from '../../services/wallet-balance.service';
import {PaymentMethodService} from '../payment-method/services/payment-method.service';
import {parseFaNum} from 'src/app/utils/parse-fa-num';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {
  public cardConfig: CardConfigInterface = OTP_PAYMENT_WALLET_CARD_CONFIG;
  public loadingSubmit: boolean = false;
  public invalidMessage: string;
  public enableResendButton = false;
  public user: UserDetail;
  protected selectedFeatureName: number;
  protected selectedFeatureMethod: string;
  @ViewChild('otp') otpComponent: UiPinInputComponent;

  public timerService = inject(TimerService);
  public ticketInfoService = inject(TicketInfoService);
  private payByWalletService = inject(PayByWalletService);
  protected verificationService = inject(VerificationService);
  protected activatedRoute = inject(ActivatedRoute);
  private userService = inject(UserInformationService);
  protected handleErrorService = inject(HandleErrorService);
  protected featureInformationService = inject(FeatureInformationService);
  protected walletBalanceService = inject(WalletBalanceService);
  public paymentMethodService = inject(PaymentMethodService);
  public creditBalance = signal<number>(0);

  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module');
  }

  async ngOnInit() {
    this.reloadTimer();
    this.getSelectedFeatureMethod();
    this.getSelectedFeatureName();
    this.updateCardConfig();

    if (!this.paymentMethodService.selectedFeature) {
      this.paymentMethodService.updateSelectedFeature(this.ticketInfoService.state.features, this.selectedFeatureMethod);
    }

    this.creditBalance.set(parseFaNum(this.paymentMethodService.selectedFeature.description));

    this.user = await this.userService.get();
  }

  public requestNewCode(): void {
    this.reloadTimer();
    this.enableResendButton = false;
  }

  public onFinishedResendRemaining(): void {
    localStorage.removeItem(PERSISTENT_STORAGE_KEYS.OTP_START_TIME + '_' + this.ticketInfoService.ticket);
    this.enableResendButton = true;
  }

  public reloadTimer(): void {
    this.timerService.initial(PERSISTENT_STORAGE_KEYS.OTP_START_TIME + '_' + this.ticketInfoService.ticket, 2);
    if (this.timerService.timer !== 0) {
      this.sendSms();
    }
  }

  private sendSms(): void {
    this.invalidMessage = null;
    this.verificationService.ticket = this.ticketInfoService.ticket;
    this.verificationService.sendOtp().subscribe(
      () => {
        this.enableResendButton = false;
      },
      (error: ApiResult) => {
        if (error.status === ErrorStatusEnum.NOT_FOUND && error.error.result.title === 'UAA_OTP_ALREADY_SENT') {
          return;
        }
        this.handleErrorService.check(error);
      }
    );
  }

  public verifyingCode(otp: string): void {
    if (otp.length < 6) {
      return;
    }
    this.invalidMessage = null;
    this.verificationService.verifyOtp(otp, [this.selectedFeatureName]).then(
      async () => {
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
      (error: ApiResult) => {
        if (this.invalidOtp(error) === false) {
          this.handleErrorService.check(error);
        }
      }
    );
  }

  private getSelectedFeatureName(): void {
    this.selectedFeatureName = Number(UpgFeatureName[this.selectedFeatureMethod]);
  }

  private getSelectedFeatureMethod(): void {
    this.selectedFeatureMethod = this.activatedRoute.snapshot.queryParams['method'];
  }

  private updateCardConfig(): void {
    if (this.selectedFeatureName && OTP_CARD_CONFIG[this.selectedFeatureName]) {
      this.cardConfig = OTP_CARD_CONFIG[this.selectedFeatureName];
    }
  }

  protected invalidOtp(errorResponse: ApiResult): boolean {
    if (errorResponse?.error?.result?.status === ErrorStatus.INVALID_OTP) {
      this.invalidMessage = 'کد وارد شده اشتباه است. دوباره تلاش کنید.';
      this.otpComponent.clearValue();
      this.otpComponent.focusOnFirstInput();
      return true;
    }
    return false;
  }
}

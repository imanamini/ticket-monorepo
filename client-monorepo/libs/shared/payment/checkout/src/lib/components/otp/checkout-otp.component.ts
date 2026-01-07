import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CardConfigInterface } from '../../data-access/models/card-config.interface';
import { PayByWalletService } from '../../data-access/services/pay-by-wallet.service';
import { OTP_PAYMENT_WALLET_CARD_CONFIG } from '../../data-access/consts/otp-card-config';
import { ActivatedRoute } from '@angular/router';
import { FeatureInformationService } from '../../data-access/services/feature-information.service';
import * as Sentry from '@sentry/angular-ivy';
import { PaymentMethodService } from '../../data-access/services/payment-method.service';
import { ProfileInterface, UserApiService, VerificationService } from '@client-monorepo/common/user';
import { TicketInfoService } from '@client-monorepo/payment/checkout';
import { APP_ACTIONS } from '@client-monorepo/common/action-handler';
import { CardComponent } from '../card/card.component';
import { AmountLabelBarComponent } from '../amount-label-bar/ui-amount-label-bar.component';
import { parseFaNum } from '../../utils/parse-fa-num';
import { CommonModule } from '@angular/common';
import { FillOtpComponent } from '@client-monorepo/common/otp';
import { FEATURE_NAMES, FEATURES } from '@client-monorepo/payment/purchase';
import { PIN_CARD_CONFIG } from '../../data-access/consts/pin-card-config';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'payment-checkout-otp',
  standalone: true,
  imports: [CommonModule, CardComponent, AmountLabelBarComponent, FillOtpComponent],
  templateUrl: './checkout-otp.component.html',
  styleUrls: ['./checkout-otp.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutOtpComponent implements OnInit {
  public cardConfig: CardConfigInterface = OTP_PAYMENT_WALLET_CARD_CONFIG;
  protected selectedFeatureMethod!: string;

  public ticketInfoService = inject(TicketInfoService);
  private payByWalletService = inject(PayByWalletService);
  protected verificationService = inject(VerificationService);
  protected activatedRoute = inject(ActivatedRoute);
  protected featureInformationService = inject(FeatureInformationService);
  public paymentMethodService = inject(PaymentMethodService);
  userApiService = inject(UserApiService);

  creditBalance = signal<number>(0);
  user = signal<ProfileInterface | null>(null);
  selectedFeatureName = signal<number>(0);
  loadingSubmit = signal<boolean>(false);
  messageService = inject(MessageService);
  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module');
  }

  async ngOnInit() {
    this.setVerificationTicket();
    this.sendSms(true);
    this.getSelectedFeatureMethod();
    this.getSelectedFeatureName();
    this.updateCardConfig();
    if (!this.paymentMethodService.selectedFeature()) {
      this.paymentMethodService.updateSelectedFeature(this.ticketInfoService.state.features, this.selectedFeatureMethod);
    }
    this.setUserBalance();
    this.setUserProfileInfo();
  }

  private setVerificationTicket() {
    this.verificationService.startNewFlow({
      ticket: this.ticketInfoService.ticket(),
    });
  }

  private setUserProfileInfo() {
    this.userApiService.getProfile().subscribe({
      next: (result) => {
        this.user.set(result);
      },
    });
  }

  private setUserBalance() {
    this.creditBalance.set(parseFaNum(this.paymentMethodService.selectedFeature()?.description || ''));
  }

  sendSms(isRetryOtp: boolean): void {
    if (!isRetryOtp) {
      return;
    }
    this.verificationService.sendOtp().subscribe({
      error: (error: HttpErrorResponse) => {
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  async otpFilled() {
    this.verificationService.clearFlowData();
    this.verificationService.clearVerificationData();
    const info = await this.featureInformationService.getLatestSelectedFeatureInfo(this.selectedFeatureName());
    switch (this.selectedFeatureName()) {
      case APP_ACTIONS.PAYMENT_WALLET:
      case APP_ACTIONS.WALLET_CASH_IN_IPG:
      case APP_ACTIONS.PAYMENT_ICP:
        this.payByWalletService.completePaymentProcess(info).then();
        break;

      default:
        document.location.replace(info.payUrl);
        break;
    }
  }

  private getSelectedFeatureName(): void {
    this.selectedFeatureName.set(Number(APP_ACTIONS[this.selectedFeatureMethod as keyof typeof APP_ACTIONS]));
  }

  private getSelectedFeatureMethod(): void {
    this.selectedFeatureMethod = this.activatedRoute.snapshot.queryParams['method'];
  }

  private updateCardConfig(): void {
    if (this.selectedFeatureName() && PIN_CARD_CONFIG[this.selectedFeatureName()]) {
      this.cardConfig = PIN_CARD_CONFIG[this.selectedFeatureName()];
    }
  }

  protected readonly FEATURES = FEATURES;
  protected readonly FEATURE_NAMES = FEATURE_NAMES;
}

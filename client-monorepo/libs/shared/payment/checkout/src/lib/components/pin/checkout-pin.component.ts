import { PaymentMethodService } from '../../data-access/services/payment-method.service';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CardConfigInterface } from '../../data-access/models/card-config.interface';
import { PIN_CARD_CONFIG, PIN_PAYMENT_WALLET_CARD_CONFIG } from '../../data-access/consts/pin-card-config';
import { PayByWalletService } from '../../data-access/services/pay-by-wallet.service';
import { ActivatedRoute } from '@angular/router';
import { FeatureInformationService } from '../../data-access/services/feature-information.service';
import * as Sentry from '@sentry/angular-ivy';
import { TicketInfoService } from '@client-monorepo/payment/checkout';
import { HandleErrorService } from '../../data-access/services/handle-error.service';
import { ProfileInterface, UserApiService } from '@client-monorepo/common/user';
import { APP_ACTIONS } from '@client-monorepo/common/action-handler';
import { CardComponent } from '../card/card.component';
import { AmountLabelBarComponent } from '../amount-label-bar/ui-amount-label-bar.component';
import { PinComponent } from '@client-monorepo/common/pin';
import { CommonModule } from '@angular/common';
import { parseFaNum } from '../../utils/parse-fa-num';
import { PinStatus } from '@digipay/ngx-pin';

@Component({
  selector: 'payment-checkout-pin',
  standalone: true,
  imports: [CommonModule, CardComponent, AmountLabelBarComponent, PinComponent],
  templateUrl: './checkout-pin.component.html',
  styleUrls: ['./checkout-pin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentCheckoutPinComponent implements OnInit, OnDestroy {
  protected ticketInfoService = inject(TicketInfoService);
  private payByWalletService = inject(PayByWalletService);
  protected activatedRoute = inject(ActivatedRoute);
  protected handleErrorService = inject(HandleErrorService);

  public cardConfig: CardConfigInterface = PIN_PAYMENT_WALLET_CARD_CONFIG;

  public invalidMessage: string | null = null;
  protected selectedFeatureName = signal<number>(0);
  protected selectedFeatureMethod!: string;
  protected featureInformationService = inject(FeatureInformationService);
  public paymentMethodService = inject(PaymentMethodService);
  userApiService = inject(UserApiService);

  creditBalance = signal<number>(0);
  user = signal<ProfileInterface | null>(null);
  loadingSubmit = signal<boolean>(false);

  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module');
  }

  async ngOnInit() {
    this.getSelectedFeatureMethod();
    this.getSelectedFeatureName();
    this.updateCardConfig();
    if (!this.paymentMethodService.selectedFeature()) {
      this.paymentMethodService.updateSelectedFeature(this.ticketInfoService.state.features, this.selectedFeatureMethod);
    }
    this.creditBalance.set(parseFaNum(this.paymentMethodService.selectedFeature()?.description || ''));
    this.userApiService.getProfile().subscribe({
      next: (result) => {
        this.user.set(result);
      },
    });
  }

  public async login(status: PinStatus) {
    if (status === PinStatus.SUCCESS) {
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
    } else if (status === PinStatus.FAILED) {
      // todo handle error
      // this.handleErrorService.check('errorResponse');
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

  ngOnDestroy(): void {
    this.paymentMethodService.resetCheckoutData();
  }
}

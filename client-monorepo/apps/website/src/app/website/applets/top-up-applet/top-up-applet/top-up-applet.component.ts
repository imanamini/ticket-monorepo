import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { TopUpAppletService } from './top-up-applet.service';
import { UiCarrier } from '../../../../ui/models/ui-carrier';
import { TopUpPackagesResponse } from '../../../../api/digipay/models/top-up/top-up-packages.response';
import { PaymentService } from '../../../../core/services/payment.service';
import { TopUpApiService } from '../../../../api/digipay/top-up-api.service';
import { ScreenSize } from '../../../../api/digipay/models/common/screen-size';
import { convertNonEnglishDigits } from '@digipay/strings';
import { TOP_UP_CHARGE_TYPES } from '../../../../api/digipay/models/top-up/top-up-types';
import { CreateTopUpRequest } from '../../../../api/digipay/models/top-up/create-top-up.request';
import { CampaignCapResponse } from '../../../../api/clients/models/templates/campaign/cap/campaign-cap.response';
import { RecommendationResponse } from '../../../../api/digipay/models/recommendation/recommendation.response.model';
import { BaseRecommendation } from '../../../../api/digipay/models/recommendation/base-recommendation';
import { MessageService } from '@client-monorepo/common/utilities';
import { Subscription } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { GuestUserService } from '../../../../core/services/guest-user.service';
import { SimType } from '../../../../api/digipay/models/common/sim-type';
import { CreateTopUpResponse } from '../../../../api/digipay/models/top-up/create-top-up.response';
import { LayoutService } from '../../../services/layout.service';
import { StorageInterface } from '@digipay/ng-storage';
import { StorageSchema } from '../../../../core/models/storage-schema';
import { UiSectionComponent } from '../../../../ui/ui-components/ui-section/ui-section/ui-section.component';
import { Router } from '@angular/router';
import { UiSpinnerComponent } from '../../../../ui/ui-components/ui-loading/ui-spinner/ui-spinner.component';
import { UiPayButtonsComponent } from '../../../../ui/ui-components/ui-button/ui-pay-buttons/ui-pay-buttons.component';
import { UiWarningMessageComponent } from '../../../../ui/ui-components/ui-message-box/ui-warning-message/ui-warning-message.component';
import { UiAmountSuggestionsComponent } from '../../../../ui/ui-components/ui-amount-input/ui-amount-suggestions/ui-amount-suggestions.component';
import { UiFormHintComponent } from '../../../../ui/ui-components/ui-hint-text/ui-form-hint/ui-form-hint.component';
import { UiAmountInputComponent } from '../../../../ui/ui-components/ui-amount-input/ui-amount-input/ui-amount-input.component';
import { UiSwitchBoxComponent } from '../../../../ui/ui-components/ui-switch/ui-switch-box/ui-switch-box.component';
import { UiHrLineComponent } from '../../../../ui/ui-components/ui-separator/ui-hr-line/ui-hr-line.component';
import { UiRecommendationsListComponent } from '../../../../ui/ui-components/ui-recommendation/ui-recommendations-list/ui-recommendations-list.component';
import { UiSimTypeSwitchComponent } from '../../../../ui/ui-components/ui-cell-number-field/ui-sim-type-switch/ui-sim-type-switch.component';
import { UiCellNumberFieldComponent } from '../../../../ui/ui-components/ui-cell-number-field/ui-cell-number-field/ui-cell-number-field.component';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-top-up-applet',
  templateUrl: './top-up-applet.component.html',
  styleUrls: ['./top-up-applet.component.scss'],
  standalone: true,
  imports: [
    UiSectionComponent,
    NgIf,
    NgClass,
    UiButtonComponent,
    UiCellNumberFieldComponent,
    UiSimTypeSwitchComponent,
    UiRecommendationsListComponent,
    UiHrLineComponent,
    UiSwitchBoxComponent,
    UiAmountInputComponent,
    UiFormHintComponent,
    UiAmountSuggestionsComponent,
    UiWarningMessageComponent,
    UiPayButtonsComponent,
    NgFor,
    UiSpinnerComponent,
  ],
})
export class TopUpAppletComponent implements OnInit, OnDestroy {
  @Input()
  boxTitle: string;

  @Input()
  standalone = false;

  @Input()
  campaignCap: CampaignCapResponse;

  @Output()
  purchaseComplete = new EventEmitter<any>();

  @Input()
  templateData: any;

  isMobile = false;

  selectedCarrier: UiCarrier = null;

  initialized = false;

  suggestions: string[] = [];

  topUpPackagesResponse: TopUpPackagesResponse = null;

  isFascinating = false;

  isValid = false;

  cellNumber = '';

  serviceMessage = '';

  amount = '';

  gettingTicket = false;

  supportFascinating: {
    description: string;
    subDescription: string;
    enableCustomAmount: boolean;
  } = null;

  recommendations: RecommendationResponse;

  formValidnessDetails: {
    cellNumber?: string;
    amount?: string;
    amountRange?: string;
    amountFactor?: string;
  } = {};

  subscriptions: Subscription[] = [];

  gettingPackages = false;

  isLoggedIn = false;

  cachedNumbers: BaseRecommendation[] = [];

  simType: SimType;

  walletBalance: number;

  walletBalanceIsSufficient = false;

  state = 1;

  @ViewChild(UiSectionComponent) uiSectionChild: UiSectionComponent;

  constructor(
    @Inject('StorageInterface') public storage: StorageInterface<StorageSchema>,
    private layoutService: LayoutService,
    public service: TopUpAppletService,
    private paymentService: PaymentService,
    private topUpApi: TopUpApiService,
    private messageService: MessageService,
    private userService: UserService,
    private guestUserService: GuestUserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.router.navigate([]);
    this.service.initialize();
    const auth = this.storage.get('auth.access', '');
    if (auth) {
      this.paymentService.getWalletBalance();
    }

    this.subscriptions[0] = this.service.initialized.asObservable().subscribe((initialized) => {
      this.initialized = initialized;
    });

    this.subscriptions[1] = this.service.topUpPackagesResponse.asObservable().subscribe((response) => {
      this.topUpPackagesResponse = response;
    });

    this.subscriptions[2] = this.layoutService.screenSizeChanged.subscribe((size) => {
      this.isMobile = size === ScreenSize.isMobile;
    });

    this.subscriptions[3] = this.service.cellNumber.asObservable().subscribe((cellNumber) => {
      this.cellNumber = cellNumber;
    });

    this.subscriptions[4] = this.service.amount.asObservable().subscribe((amount) => {
      this.amount = amount;
    });

    this.subscriptions[5] = this.service.selectedCarrier.asObservable().subscribe((carrier) => {
      this.selectedCarrier = carrier;
    });

    this.subscriptions[6] = this.service.suggestions.asObservable().subscribe((suggestions) => {
      this.suggestions = suggestions;
    });

    this.subscriptions[7] = this.service.fascinating.asObservable().subscribe((fascinating) => {
      this.isFascinating = fascinating;
    });

    this.subscriptions[8] = this.service.supportFascinating.asObservable().subscribe((supportFascinating) => {
      this.supportFascinating = supportFascinating;
    });

    this.subscriptions[9] = this.service.formValidness.asObservable().subscribe((formValidness) => {
      this.isValid = formValidness;
    });

    this.subscriptions[10] = this.service.recommendations.asObservable().subscribe((recommendations) => {
      this.recommendations = recommendations;
    });

    this.subscriptions[11] = this.service.formValidnessDetails.asObservable().subscribe((details) => {
      this.formValidnessDetails = details;
    });

    this.subscriptions[12] = this.service.gettingPackages.asObservable().subscribe((gettingPackages) => {
      this.gettingPackages = gettingPackages;
    });

    this.subscriptions[13] = this.userService.isLoggedIn.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.cachedNumbers = [];
      } else {
        this.cachedNumbers = this.guestUserService.getNumbers();
      }
    });

    this.subscriptions[14] = this.service.serviceMessage.subscribe((message) => {
      this.serviceMessage = message;
    });

    this.subscriptions[15] = this.service.selectedSimType.subscribe((simType) => {
      this.simType = simType;
    });

    this.subscriptions[16] = this.paymentService.walletBalance.asObservable().subscribe((walletBalance) => {
      this.walletBalance = walletBalance;
      this.checkBalanceSufficiency();
    });

    this.subscriptions[17] = this.service.amount.subscribe(() => {
      this.checkBalanceSufficiency();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }

  onCellNumberChange(cellNumber: string): void {
    this.service.cellNumber.next(cellNumber);
  }

  onSuggestionSelect(amount: string): void {
    this.service.amount.next(amount);
  }

  onCarrierChange(carrier: UiCarrier): void {
    this.service.selectedCarrier.next(carrier);
  }

  onAmountChange(value: string): void {
    let amount = '';
    if (value) {
      amount = convertNonEnglishDigits(value);
      amount = amount.replace(/[^\d]/g, '');
    }
    this.service.amount.next(amount);
  }

  onFascinatingSwitchChange(value: boolean): void {
    this.service.fascinating.next(value);
  }

  walletPay(): void {
    this.getTicket()
      .then((createTopUpResponse: CreateTopUpResponse) => {
        this.paymentService
          .payByWallet(createTopUpResponse.ticket)
          .then((response) => {
            this.gettingTicket = false;
            // nothing to do. services shows result dialog itself
            this.purchaseComplete.emit(response);
            this.state = 1;
          })
          .catch((e) => {
            this.gettingTicket = false;
            if (typeof e === 'string') {
              this.messageService.showErrorMessage(e);
            } else {
              this.messageService.showErrorOfErrorResponse(e.error);
            }
          });
      })
      .catch((e) => {
        this.gettingTicket = false;
        this.messageService.showErrorOfErrorResponse(e.error);
      });
  }

  ipgPay(): void {
    this.getTicket().then(
      (createTopUpResponse: CreateTopUpResponse) => {
        if (this.paymentService.payUsingTheNativeSdk(createTopUpResponse)) {
          return;
        }

        this.paymentService.payByIpg(createTopUpResponse.ticket).catch((e) => {
          this.gettingTicket = false;
          this.messageService.showErrorOfErrorResponse(e.error);
        });
      },
      (e) => {
        this.gettingTicket = false;
        this.messageService.showErrorOfErrorResponse(e.error);
      },
    );
  }

  getTicket(): Promise<any> {
    const amount = parseInt(convertNonEnglishDigits(this.service.amount.getValue()), 10);
    const cellNumber = convertNonEnglishDigits(this.service.cellNumber.getValue());

    const url = this.paymentService.generatePaymentUrl(this.standalone ? null : 'top-up');

    const request = {
      chargePackage: {
        amount,
      },
      chargeType: this.isFascinating ? TOP_UP_CHARGE_TYPES.FASCINATING : TOP_UP_CHARGE_TYPES.REGULAR,
      operatorId: this.selectedCarrier.value,
      redirectUrl: url,
      targetedCellNumber: cellNumber,
      cellNumberType: this.simType,
    } as CreateTopUpRequest;

    const insiderBody = {
      event_name: 'topUpResult',
      parameters: {
        status: '', // موفق | ناموفق
        amount: amount,
        type: this.isFascinating ? 'شگفت انگیز' : 'عادی', // عادی | شگفت انگیز
        phone: cellNumber,
        operator: this.selectedCarrier.label, // ایرانسل | همراه اول | رایتل
        pay: '', // Pay by: wallet | ipg
      },
    };

    this.storage.patch({
      insiderBody: insiderBody,
    });

    if (this.gettingTicket) {
      return;
    }

    this.gettingTicket = true;
    return new Promise((resolve, error) => {
      this.topUpApi.createTopUp(request).subscribe(
        (response) => {
          if (!this.isLoggedIn) {
            // cache the entered number
          }
          resolve(response);
        },
        (e) => {
          this.gettingTicket = false;
          console.log(e, 'error');
          error(e);
        },
      );
    });
  }

  recommendationItemClicked(item: BaseRecommendation): void {
    this.service.cellNumber.next(item.id);
  }

  onSimTypeChange(type: SimType): void {
    this.service.selectedSimType.next(type);
  }

  changeState(state: number) {
    this.state = state;
    this.uiSectionChild.bodyHeightChange();
  }

  private checkBalanceSufficiency(): void {
    const amount = this.service.amount.getValue();
    if (amount) {
      const n = parseInt(amount, 10);
      if (!isNaN(n)) {
        this.walletBalanceIsSufficient = n <= this.walletBalance;
      }
    }
  }
}

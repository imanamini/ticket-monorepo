import { Component, OnDestroy, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedRenewalService } from '../services/shared-renewal.service';
import { RenewalApiService } from '../../../api/services/renewal/renewal-api.service';
import { isDesktop, isMobileOrTablet, MessageService } from '@client-monorepo/common/utilities';
import { Observable, Subscription, tap } from 'rxjs';
import { StepIconSetModel } from '../partials/renewal-stepper/models/step-icon-set.model';
import { JourneyNamesModel } from '../../../shared-steps/models/journey-names.model';
import { RenewalHeaderComponent } from '../partials/renewal-header/renewal-header.component';
import { AsyncPipe, Location, NgClass, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { HealthCheckComponent } from '../../../shared-steps/health-check/health-check.component';
import { RenewalOrderInfoComponent } from '../steps/renewal-order-info/renewal-order-info.component';
import { RenewalPricingComponent } from '../steps/renewal-pricing/renewal-pricing.component';
import { RenewalPrePaymentComponent } from '../steps/renewal-pre-payment/renewal-pre-payment.component';
import { RenewalPaymentResultComponent } from '../steps/renewal-payment-result/renewal-payment-result.component';
import {
  RenewalCompleteInformationComponent
} from '../steps/renewal-complete-information/renewal-complete-information.component';
import { RenewalIssuePolicyComponent } from '../steps/renewal-issue-policy/renewal-issue-policy.component';
import { LocationTrapComponent } from '../../../../../components/location-trap/location-trap.component';
import { RenewalStepperComponent } from '../partials/renewal-stepper/renewal-stepper.component';
import { StateModel } from '../../../api/models/renewal/state.model';
import { ReferrerService } from '../../../../../data-access/services/referrer.service';
import { UiButtonComponent } from '../../../../../components/ui-button/ui-button/ui-button.component';
import { INSURANCE_APP_PREFIX } from '../../../../../data-access/constants/insurance-app-prefix.constant';
import { InsuranceUrlsEnum } from '../../../../../data-access/enums/insurance-urls.enum';

@Component({
  selector: 'renewal-layout',
  templateUrl: './renewal-layout.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    RenewalHeaderComponent,
    NgClass,
    NgIf,
    NgSwitch,
    AsyncPipe,
    NgSwitchCase,
    HealthCheckComponent,
    RenewalOrderInfoComponent,
    RenewalPricingComponent,
    RenewalPrePaymentComponent,
    RenewalPaymentResultComponent,
    RenewalCompleteInformationComponent,
    RenewalIssuePolicyComponent,
    LocationTrapComponent,
    RenewalStepperComponent,
    UiButtonComponent,
  ],
  styleUrls: ['./renewal-layout.component.scss'],
})
export class RenewalLayoutComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private location: Location,
    private renewalApiService: RenewalApiService,
    private sharedService: SharedRenewalService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private referrerService: ReferrerService,
  ) {
  }

  readonly JourneyNamesModel = JourneyNamesModel;

  // Subscriptions
  subscriptions: Subscription[] = [];

  // Vars
  uniqueCode: string;
  stateData: StateModel[];
  state$: Observable<StateModel[]>;
  activeStepIndex: number;
  showHealthCheck: boolean;
  isMobile = isMobileOrTablet() || !isDesktop();
  showBackBtn: boolean;
  showPaymentResult: boolean;
  stepsIconSet: StepIconSetModel[] = [
    {
      activeIcon: 'insurance-assets/icons/insurance-info-white.svg',
      deActiveIcon: 'insurance-assets/icons/insurance-info-gray.svg',
    },
    {
      activeIcon: 'insurance-assets/icons/pricing-white.svg',
      deActiveIcon: 'insurance-assets/icons/pricing-gray.svg',
    },
    {
      activeIcon: 'insurance-assets/icons/payment-white.svg',
      deActiveIcon: 'insurance-assets/icons/payment-gray.svg',
    },
    {
      activeIcon: 'insurance-assets/icons/health-check-white.svg',
      deActiveIcon: 'insurance-assets/icons/health-check-gray.svg',
    },
    {
      activeIcon: 'insurance-assets/icons/complete-information-white.svg',
      deActiveIcon: 'insurance-assets/icons/complete-information-gray.svg',
    },
    {
      activeIcon: 'insurance-assets/icons/issue-policy-white.svg',
      deActiveIcon: 'insurance-assets/icons/issue-policy-gray.svg',
    },
  ];

  errorPageText = signal<string | null>(null);
  canBack = signal<boolean>(false);

  ngOnInit(): void {
    this.sharedService.setJourney(JourneyNamesModel.RENEWAL);
    this.getUrlParams();
    this.subscribeToStepChange();
    this.getShowHealthCheck();
    this.subscribeToActiveIndex();
    this.subscribeToGetState();
  }

  getShowHealthCheck(): void {
    const subscription = this.sharedService.getShowHealthCheckSubject().subscribe({
      next: (val) => {
        this.showHealthCheck = val;
      },
    });
    this.subscriptions.push(subscription);
  }

  getUrlParams(): void {
    const params = this.route.snapshot.queryParams;
    if (params.code) {
      this.uniqueCode = params.code;
      if (this.uniqueCode) {
        this.sharedService.setUniqueCode(this.uniqueCode);
        this.getRenewalState();
      }
    }
    if (params.providerId) {
      this.sharedService.setProviderId(params.providerId);
      this.showPaymentResult = true;
    } else {
      this.sharedService.setProviderId(null);
      this.showPaymentResult = false;
    }
  }

  subscribeToStepChange(): void {
    const subscription = this.sharedService.getStepChangeSubject().subscribe({
      next: (data) => {
        switch (data) {
          case 'NEXT':
            this.getRenewalState();
            break;
          case 'PREVIOUS':
            const state = this.stateData[this.activeStepIndex]?.state;
            if (state <= 3 && state > 0) {
              this.activeStepIndex = this.activeStepIndex - 1;
              this.sharedService.setActiveIndex(this.activeStepIndex);
            }
            break;
        }
      },
    });
    this.subscriptions.push(subscription);
  }

  getRenewalState(): void {
    const subscription = this.renewalApiService
      .getState(this.uniqueCode)
      .pipe(
        tap(() => {
          this.errorPageText.set(null);
          this.canBack.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.sharedService.setStateData(res.data);
          this.checkHealthCheckDone();
          this.errorPageText.set(null);
        },
        error: (e) => {
          this.canBack.set(true);
          this.errorPageText.set(e.error.result.message || e.error.message || 'خطا در دریافت اطلاعات');
        },
      });
    this.subscriptions.push(subscription);
  }

  subscribeToActiveIndex(): void {
    const subscription = this.sharedService.getActiveIndex().subscribe({
      next: (index) => {
        if (index !== this.activeStepIndex) {
          this.activeStepIndex = index;
        }
      },
    });
    this.subscriptions.push(subscription);
  }

  subscribeToGetState(): void {
    this.state$ = this.sharedService.getStateData();
    const subscription = this.sharedService.getStateData().subscribe({
      next: (data) => {
        this.stateData = data;
      },
    });
    this.subscriptions.push(subscription);
  }

  checkHealthCheckDone(): void {
    this.stateData.forEach((state) => {
      if (state.state > 4 && state.stepState > 0) {
        this.showPaymentResult = false;
        this.removeProviderIdFromUrl();
        return;
      }
    });
  }

  removeProviderIdFromUrl(): void {
    const queryParams = {...this.route.snapshot.queryParams};
    delete queryParams.providerId;
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: Object.assign({}, queryParams),
      })
      .then();
  }

  handleBackClick(getState = false): void {
    if (this.activeStepIndex === 0) {
      this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.PolicyList}`]);
    }
    this.sharedService.setStepChangeSubject('PREVIOUS');
    if (getState) {
      this.getRenewalState();
    }
  }

  handleProfileClick(): void {
    this.router
      .navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.PolicyList}`], {
        queryParams: {
          referrer: this.referrerService.referrer,
          status: '0',
        },
      })
      .then();
  }

  showStepper(): boolean {
    return !this.showPaymentResult && this.stateData !== undefined;
  }

  public goToBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
  }
}

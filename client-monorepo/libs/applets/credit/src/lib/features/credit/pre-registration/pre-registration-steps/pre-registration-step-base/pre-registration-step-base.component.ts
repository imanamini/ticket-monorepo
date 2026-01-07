import { ChangeDetectionStrategy, Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { SliderSelectOption } from '../../../components/credit-slider-select/models/slider-select-option.interface';
import { CreditButtonSelectOption } from '../../components/credit-button-select/credit-button-select-option';
import { PreRegistrationService } from '../../services/pre-registration.service';
import { PlanGroup } from '../../../data-access/models/credit/pre-registration/credit-plan-group';
import { ActivatedRoute, Router } from '@angular/router';
import { CREDIT_WALLET_STATUS } from '../../../data-access/models/credit/wallet/credit-wallet.model';
import { FUND_PROVIDER_CODE } from '../../../data-access/models/credit/fund-provider/fund-provider-code';
import { Subscription } from 'rxjs';
import { WalletCardService } from '../../../data-access/services/wallet-card.service';
import { CreditUrlService } from '../../../data-access/utils/url';
import { CreditSelectFundProviderEventModel } from './credit-select-fund-provider-event.model';
import { SERVICE_TYPE } from '../../../data-access/models/credit/service-type/service-type.model';
import { PreRegistrationFilter } from '../../services/pre-registration-filter';
import { PRE_REGISTRATION_STEP_TYPE } from '../../services/pre-registration-step';
import { PAYMENT_METHOD } from '../../../data-access/models/credit/pre-registration/payment-method.model';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { FormsModule } from '@angular/forms';
import { CreditButtonSelectComponent } from '../../components/credit-button-select/credit-button-select.component';
import { CreditFundProviderGroupsListComponent } from '../../components/credit-fund-provider-groups-list/credit-fund-provider-groups-list.component';
import { CreditNumberToStringPipe } from '../../../data-access/pipes/credit-number-to-string.pipe';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditSliderSelectComponent } from '../../../components/credit-slider-select/credit-slider-select.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { PreRegistrationStepBaseSkeletonComponent } from './pre-registration-step-base-skeleton/pre-registration-step-base-skeleton.component';
import { CreditFundProviderGroupsCardSkeletonComponent } from '../../components/credit-fund-provider-groups-card-skeleton/credit-fund-provider-groups-card-skeleton.component';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';

@Component({
  selector: 'app-pre-registration-step-base',
  templateUrl: './pre-registration-step-base.component.html',
  styleUrls: ['./pre-registration-step-base.component.scss'],
  imports: [
    FormsModule,
    NgxDividerComponent,
    CreditButtonSelectComponent,
    CreditFundProviderGroupsListComponent,
    CreditNumberToStringPipe,
    CreditScrollableViewComponent,
    CreditSliderSelectComponent,
    CreditAppBarComponent,
    PreRegistrationStepBaseSkeletonComponent,
    CreditFundProviderGroupsCardSkeletonComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreRegistrationStepBaseComponent implements OnInit {
  amountOptions = signal<SliderSelectOption[]>([]);
  installmentCountOptions = signal<CreditButtonSelectOption[]>([]);
  selectedAmount = signal<number | null>(null);
  selectedInstallmentCount = signal<number | null>(null);
  collapseHeader = signal(false);
  plans: PlanGroup[] = [];
  filteredPlans = signal<PlanGroup[]>([]);
  dataTree: { [key: number]: { [key: number]: PlanGroup[] } } = {};
  defaultData: {
    amount?: number;
    installmentCount?: number;
    fundProviderCode?: number;
    source?: string;
  } = {};
  getWalletSubscription!: Subscription;
  filterPlansType = signal<'CREDIT' | 'BNPL'>('CREDIT');
  creditAmountSlideTemplate = viewChild('creditAmountSlideTemplate');

  protected readonly BorderColorsEnum = BorderColorsEnum;

  private preRegistrationService = inject(PreRegistrationService);
  private activatedRoute = inject(ActivatedRoute);
  private walletCardService = inject(WalletCardService);
  private router = inject(Router);
  private creditUrlService = inject(CreditUrlService);
  private hybridService = inject(NgxHybridService);

  ngOnInit(): void {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    if (queryParams) {
      if (queryParams['utm_source']) {
        this.defaultData.source = queryParams['utm_source'];
      }
      if (queryParams['fundProviderCode']) {
        this.defaultData.fundProviderCode = +queryParams['fundProviderCode'];
      }
      if (queryParams['amount']) {
        this.defaultData.amount = +queryParams['amount'];
      }
      if (queryParams['installmentCount']) {
        this.defaultData.installmentCount = +queryParams['installmentCount'];
      }
    }
    if (this.defaultData.source === 'website' || this.defaultData.source === 'digikala') {
      this.checkCreditWallets().then();
    }
    this.preRegistrationService.unsetFilters([
      'allocationPrepaymentAmount',
      'creditAmount',
      'installmentCount',
      'fundProviderCode',
      'userEntryPoint',
    ]);
    this.preRegistrationService.resetSteps();
    this.preRegistrationService.setCollateralType('');
    this.plans = this.preRegistrationService.filteredPlans;
    this.initiateData();
    this.selectDefaultValues();
  }

  checkCreditWallets() {
    return new Promise<boolean>((resolve, reject) => {
      this.getWalletSubscription = this.walletCardService.getRawWalletList().subscribe(({ wallets }) => {
        for (const wallet of wallets) {
          const walletFundProviderCode = wallet.fundProviderCode;
          const walletInProgressActive =
            wallet.status === CREDIT_WALLET_STATUS.INACTIVE ||
            wallet.status === CREDIT_WALLET_STATUS.START_ACTIVATION ||
            wallet.status === CREDIT_WALLET_STATUS.OPERATION_PROCESS ||
            wallet.status === CREDIT_WALLET_STATUS.IN_PROGRESS ||
            wallet.status === CREDIT_WALLET_STATUS.COMPLETED;

          if (
            walletFundProviderCode === FUND_PROVIDER_CODE.DIGIPAY &&
            walletInProgressActive &&
            this.defaultData.fundProviderCode === FUND_PROVIDER_CODE.DIGIPAY
          ) {
            this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/overview'));
            resolve(true);
          }

          if (
            walletFundProviderCode !== FUND_PROVIDER_CODE.DIGIPAY &&
            walletInProgressActive &&
            this.defaultData.fundProviderCode !== FUND_PROVIDER_CODE.DIGIPAY
          ) {
            this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/overview'));
            resolve(true);
          }
        }
      });
    });
  }

  initiateData(): void {
    this.dataTree = {};
    const amountList = this.preRegistrationService.distinctFieldItems('creditAmount', this.plans);

    this.installmentCountOptions.set(
      this.preRegistrationService.distinctFieldItems('installmentCount', this.plans).map((installmentCount) => {
        return { value: +installmentCount, label: `${installmentCount} قسط` };
      }),
    );

    amountList.forEach((amount: any) => {
      this.dataTree[amount] = {};
      const installmentCountList = this.preRegistrationService.distinctFieldItems(
        'installmentCount',
        this.plans.filter((item) => +item.creditAmount === +amount),
      );
      installmentCountList.forEach((ic: any) => {
        this.dataTree[amount][ic] = this.plans.filter((item) => +item.creditAmount === +amount && +item.installmentCount === +ic);
      });
    });
  }

  selectDefaultValues(): void {
    // Filter plans that have priority field, then find the one with smallest priority (highest priority)
    // If multiple plans have same priority, select the one with highest creditAmount
    const plansWithPriority = this.plans.filter(
      (plan) => plan.hasOwnProperty('priority') && plan.priority !== undefined && plan.priority !== null,
    );

    const objectWithSmallestPriority =
      plansWithPriority.length > 0
        ? plansWithPriority
            .sort((a: PlanGroup, b: PlanGroup) => {
              // First sort by priority (ascending - lower priority value = higher priority)
              if (a.priority! !== b.priority!) {
                return a.priority! - b.priority!;
              }
              // If priorities are equal, sort by creditAmount (descending - higher amount first)
              return b.creditAmount - a.creditAmount;
            })[0]
        : ({ priority: Infinity, creditAmount: null } as unknown as PlanGroup);

    const amountList = this.preRegistrationService.distinctFieldItems('creditAmount', this.plans);

    if (!amountList[0]) {
      return;
    }

    if (this.defaultData.installmentCount) {
      this.selectedInstallmentCount.set(this.defaultData.installmentCount);

      const availableAmounts = amountList.filter((creditAmount) => {
        return (
          this.dataTree[+creditAmount]?.[this.defaultData.installmentCount!] &&
          this.dataTree[+creditAmount][this.defaultData.installmentCount!].length > 0
        );
      });

      this.amountOptions.set(
        availableAmounts.map((creditAmount) => {
          return {
            value: +creditAmount,
            template: this.creditAmountSlideTemplate(),
            templateContext: { amount: creditAmount },
          };
        }),
      );

      if (this.defaultData.amount && availableAmounts.find((item) => +item === this.defaultData.amount)) {
        // Delay to ensure carousel is initialized
        setTimeout(() => {
          this.selectedAmount.set(this.defaultData.amount);
        }, 600);
      } else if (availableAmounts.length > 0) {
        // Delay to ensure carousel is initialized
        setTimeout(() => {
          this.selectedAmount.set(+availableAmounts[0]);
        }, 600);
      }
    } else {
      const options = amountList.map((creditAmount) => {
        return {
          value: +creditAmount,
          template: this.creditAmountSlideTemplate(),
          templateContext: { amount: creditAmount },
        };
      });
      this.amountOptions.set(options);

      if (this.defaultData.amount && amountList.find((item) => +item === this.defaultData.amount)) {
        // Delay to ensure carousel is initialized before setting value
        setTimeout(() => {
          this.selectedAmount.set(this.defaultData.amount);
        }, 600);
      } else {
        if (typeof objectWithSmallestPriority.priority === 'number' && objectWithSmallestPriority.priority !== Infinity) {
          // Delay to ensure carousel is initialized before setting value with priority
          // Increased timeout to 600ms to ensure reverseOptions is populated
          setTimeout(() => {
            this.selectedAmount.set(objectWithSmallestPriority.creditAmount);
          }, 600);
        } else {
          setTimeout(() => {
            this.selectedAmount.set(+amountList[amountList.length - 1]);
          }, 600);
        }
      }
    }

    // Wait for amount to be set before filtering
    // Increased timeout to 650ms to run after amount is set (which happens at 600ms)
    setTimeout(() => {
      this.onChangeAmountFilter();

      if (!this.defaultData.installmentCount) {
        this.filterInstallmentCountByPriority(objectWithSmallestPriority);
      } else {
        this.onChangeFilters();
      }
    }, 650);
  }

  filterInstallmentCountByPriority(objectWithSmallestPriority: PlanGroup | null = null): void {
    if (!objectWithSmallestPriority) {
      // Collect all plans for the selected amount
      const allPlansForAmount: PlanGroup[] = [];
      Object.keys(this.dataTree[this.selectedAmount()!]).forEach((key: any) => {
        allPlansForAmount.push(...this.dataTree[this.selectedAmount()!][key]);
      });

      // Filter plans that have priority
      const plansWithPriority = allPlansForAmount.filter(
        (item) => item.hasOwnProperty('priority') && item.priority !== undefined && item.priority !== null,
      );

      // Find the plan with smallest priority (highest priority)
      // If multiple plans have same priority, select the one with highest creditAmount
      if (plansWithPriority.length > 0) {
        objectWithSmallestPriority = plansWithPriority
          .sort((a: PlanGroup, b: PlanGroup) => {
            // First sort by priority (ascending - lower priority value = higher priority)
            if (a.priority! !== b.priority!) {
              return a.priority! - b.priority!;
            }
            // If priorities are equal, sort by creditAmount (descending - higher amount first)
            return b.creditAmount - a.creditAmount;
          })[0];
      }
    }
    setTimeout(() => {
      if (
        this.defaultData.installmentCount &&
        this.installmentCountOptions().find((item) => item.value === this.defaultData.installmentCount)
      ) {
        this.selectedInstallmentCount.set(this.defaultData.installmentCount);
      } else {
        if (objectWithSmallestPriority && typeof objectWithSmallestPriority.priority === 'number' && objectWithSmallestPriority.priority !== Infinity) {
          this.selectedInstallmentCount.set(objectWithSmallestPriority.installmentCount);
        } else {
          const foundInstallmentCount = this.installmentCountOptions().find((item) => !item.disabled);
          this.selectedInstallmentCount.set(foundInstallmentCount ? foundInstallmentCount.value : null);
        }
      }
      this.onChangeFilters();
    }, 200);
  }

  back(): void {
    this.preRegistrationService.prevStep();
  }

  onSelectedAmountChange(selectedAmount: number): void {
    this.selectedAmount.set(selectedAmount);
    this.preRegistrationService.setFilters({
      creditAmount: this.selectedAmount()!,
    });
    this.onChangeAmountFilter();
    this.filterInstallmentCountByPriority();
    this.onChangeFilters();
  }

  onChangeAmountFilter(): void {
    const selectedAmount = this.selectedAmount();
    this.installmentCountOptions.set(
      this.preRegistrationService
        .distinctFieldItems('installmentCount', this.plans)
        .map((installmentCount) => {
          return { value: +installmentCount, label: `${installmentCount} قسط` };
        })
        .filter((item) => (this.defaultData.installmentCount ? item.value === this.defaultData.installmentCount : true))
        .filter((item) => {
          return this.dataTree[selectedAmount!]?.[item.value] && this.dataTree[selectedAmount!][item.value].length > 0;
        }),
    );

    const isCurrentInstallmentAvailable = this.installmentCountOptions().some((item) => item.value === this.selectedInstallmentCount());

    if (!isCurrentInstallmentAvailable && this.installmentCountOptions().length > 0) {
      this.selectedInstallmentCount.set(this.installmentCountOptions()[0].value);
    }
  }

  onSelectedInstallmentCountChange(selectedInstallmentCount: number) {
    this.selectedInstallmentCount.set(selectedInstallmentCount);
    this.preRegistrationService.setFilters({
      installmentCount: this.selectedInstallmentCount()!,
    });

    // NOTE: calling this method breaks the showing plans
    // this.filterAmountsByInstallmentCount();

    this.onChangeFilters();
  }

  filterAmountsByInstallmentCount(): void {
    const selectedInstallment = this.selectedInstallmentCount();

    const allAmounts = this.preRegistrationService.distinctFieldItems('creditAmount', this.plans);

    const availableAmounts = allAmounts.filter((creditAmount) => {
      return this.dataTree[+creditAmount]?.[selectedInstallment!] && this.dataTree[+creditAmount][selectedInstallment!].length > 0;
    });

    const currentAmount = this.selectedAmount();
    const needsAmountUpdate = availableAmounts.length > 0 && currentAmount && !availableAmounts.find((amount) => +amount === currentAmount);

    if (needsAmountUpdate) {
      this.selectedAmount.set(+availableAmounts[0]);
      this.preRegistrationService.setFilters({
        creditAmount: this.selectedAmount()!,
      });
    }

    this.amountOptions.set(
      availableAmounts.map((creditAmount) => {
        return {
          value: +creditAmount,
          template: this.creditAmountSlideTemplate(),
          templateContext: { amount: creditAmount },
        };
      }),
    );

    if (needsAmountUpdate) {
      setTimeout(() => {
        this.selectedAmount.set(this.selectedAmount());
      }, 100);
    }
  }

  onChangeFilters(): void {
    this.filterPlansType.set('CREDIT');
    const selectedAmount = this.selectedAmount();
    const selectedInstallment = this.selectedInstallmentCount();

    if (selectedAmount && selectedInstallment && this.dataTree[selectedAmount]?.[selectedInstallment]) {
      this.filteredPlans.set(this.dataTree[selectedAmount][selectedInstallment]);

      for (const plan of this.filteredPlans()) {
        if (plan.serviceType === SERVICE_TYPE.BNPL) {
          this.filterPlansType.set('BNPL');
          break;
        }
      }
    } else {
      this.filteredPlans.set([]);
    }
  }

  onScroll(event: any): void {
    const st = event.target.scrollTop;
    if (st === 0 && this.collapseHeader()) {
      this.collapseHeader.set(false);
    }
    if (st >= 150 && !this.collapseHeader()) {
      this.collapseHeader.set(true);
    }
  }

  selectFundProvider(event: CreditSelectFundProviderEventModel): void {
    const selectedPlanGroup: PlanGroup = this.filteredPlans().find(
      (item) => item.fundProvider.fundProviderCode === event.fundProviderCode && item.userEntryPoint === event.userEntryPoint,
    )!;
    this.goNextStep(selectedPlanGroup, event);
  }

  goNextStep(selectedPlanGroup: PlanGroup, event: CreditSelectFundProviderEventModel) {
    const filters: PreRegistrationFilter = {
      creditAmount: this.selectedAmount()!,
      installmentCount: this.selectedInstallmentCount()!,
      fundProviderCode: event.fundProviderCode,
      allocationPrepaymentAmount: event.allocationPrepaymentAmount,
      userEntryPoint: event.userEntryPoint,
    };
    if (selectedPlanGroup.serviceType === SERVICE_TYPE.BNPL) {
      this.preRegistrationService.changeSkipInNextStepByType(PRE_REGISTRATION_STEP_TYPE.CONDITIONS, true);
      this.preRegistrationService.changeSkipInPrevStepByType(PRE_REGISTRATION_STEP_TYPE.CONDITIONS, true);
    }
    if (selectedPlanGroup.paymentMethod === PAYMENT_METHOD.SUBSCRIPTION) {
      this.preRegistrationService.changeSkipInNextStepByType(PRE_REGISTRATION_STEP_TYPE.SUBSCRIPTION, false);
      this.preRegistrationService.changeSkipInPrevStepByType(PRE_REGISTRATION_STEP_TYPE.SUBSCRIPTION, false);
      this.preRegistrationService.changeSkipInNextStepByType(PRE_REGISTRATION_STEP_TYPE.PRE_SUBSCRIPTION, false);
      this.preRegistrationService.changeSkipInPrevStepByType(PRE_REGISTRATION_STEP_TYPE.PRE_SUBSCRIPTION, false);
      this.preRegistrationService.changeSkipInNextStepByType(PRE_REGISTRATION_STEP_TYPE.CONFIRM_PLAN, true);
      this.preRegistrationService.changeSkipInPrevStepByType(PRE_REGISTRATION_STEP_TYPE.CONFIRM_PLAN, true);
    }

    if (event.collaterals[0].type === 'BASED_ON_SCORE') {
      this.preRegistrationService.changeSkipInNextStepByType(PRE_REGISTRATION_STEP_TYPE.COLLATERAL, true);
      this.preRegistrationService.changeSkipInPrevStepByType(PRE_REGISTRATION_STEP_TYPE.COLLATERAL, true);
      this.preRegistrationService.changeSkipInPrevStepByType(PRE_REGISTRATION_STEP_TYPE.CONFIRM_PLAN, true);
      this.preRegistrationService.changeSkipInNextStepByType(PRE_REGISTRATION_STEP_TYPE.CONFIRM_PLAN, true);
      this.preRegistrationService.setCollateralType('BASED_ON_SCORE');
    }

    if (event.collaterals.length === 1 && event.collaterals[0].type === 'UN_PAYABLE') {
      this.preRegistrationService.changeSkipInNextStepByType(PRE_REGISTRATION_STEP_TYPE.COLLATERAL, true);
      this.preRegistrationService.changeSkipInPrevStepByType(PRE_REGISTRATION_STEP_TYPE.COLLATERAL, true);
      this.preRegistrationService.setCollateralType('UN_PAYABLE');
    }

    this.preRegistrationService.setFilters(filters);
    this.preRegistrationService.nextStep();
  }
}

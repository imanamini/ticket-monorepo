import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { SliderSelectOption } from '../../components/credit-slider-select/models/slider-select-option.interface';
import { CreditButtonSelectOption } from '../components/credit-button-select/credit-button-select-option';
import { PlanGroup } from '../../data-access/models/credit/pre-registration/credit-plan-group';
import { CreditPlanConditionsBottomSheetData } from '../components/credit-plan-conditions-bottom-sheet/credit-plan-conditions-bottom-sheet.data';
import { CreditPlanConditionsBottomSheetComponent } from '../components/credit-plan-conditions-bottom-sheet/credit-plan-conditions-bottom-sheet.component';
import { PreRegistrationByUnderwriterService } from './pre-registration-by-underwriter.service';
import { PreRegisterRequest } from '../../data-access/models/credit/volunteer/pre-register.request';
import { PreRegistrationSubmitterService } from '../services/pre-registration-submitter.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from '../../data-access/services/message.service';
import { CreditUrlService } from '../../data-access/utils/url';
import { CreditUserService } from '../../data-access/services/credit-user.service';
import { BaseApiService } from '../../data-access/services/base-api.service';
import { Subscription } from 'rxjs';
import { WalletCardService } from '../../data-access/services/wallet-card.service';
import { CREDIT_WALLET_STATUS, CreditWallet } from '../../data-access/models/credit/wallet/credit-wallet.model';
import { CreditSelectFundProviderEventModel } from '../pre-registration-steps/pre-registration-step-base/credit-select-fund-provider-event.model';
import { SERVICE_TYPE } from '../../data-access/models/credit/service-type/service-type.model';
import { FormsModule } from '@angular/forms';
import { CreditButtonSelectComponent } from '../components/credit-button-select/credit-button-select.component';
import { CreditFundProviderGroupsListComponent } from '../components/credit-fund-provider-groups-list/credit-fund-provider-groups-list.component';
import { CreditRegistrationByUnderwriterErrorComponent } from '../components/credit-registration-by-underwriter-error/credit-registration-by-underwriter-error.component';
import { CreditRegistrationByUnderwriterFormComponent } from '../components/credit-registration-by-underwriter-form/credit-registration-by-underwriter-form.component';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditNumberToStringPipe } from '../../data-access/pipes/credit-number-to-string.pipe';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { CreditScrollableViewComponent } from '../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditSliderSelectComponent } from '../../components/credit-slider-select/credit-slider-select.component';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';
import { CreditSwitchCellNumberComponent } from '../../components/credit-switch-cell-number/credit-switch-cell-number.component';

@Component({
  selector: 'app-pre-registration-by-underwriter',
  templateUrl: './pre-registration-by-underwriter.component.html',
  styleUrls: ['./pre-registration-by-underwriter.component.scss'],
  imports: [
    FormsModule,
    CreditButtonSelectComponent,
    CreditFundProviderGroupsListComponent,
    CreditRegistrationByUnderwriterErrorComponent,
    CreditRegistrationByUnderwriterFormComponent,
    NgxDividerComponent,
    CreditNumberToStringPipe,
    CreditPageLoadingComponent,
    CreditScrollableViewComponent,
    CreditSliderSelectComponent,
    CreditAppBarComponent,
    CreditSwitchCellNumberComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreRegistrationByUnderwriterComponent implements OnInit, AfterViewInit, OnDestroy {
  amountOptions = signal<SliderSelectOption[]>([]);
  installmentCountOptions = signal<CreditButtonSelectOption[]>([]);
  selectedAmount = signal<number | null>(null);
  selectedInstallmentCount = signal<number | null>(null);
  loadingCards = signal<boolean>(true);
  collapseHeader = signal(false);
  plans: PlanGroup[] = [];
  filteredPlans = signal<PlanGroup[]>([]);
  dataTree: { [key: number]: { [key: number]: PlanGroup[] } } = {};
  creditAmountSlideTemplate = viewChild('creditAmountSlideTemplate');
  gettingData = signal<boolean | null>(null);
  nationalCode!: string;
  birthDate!: number;
  orgId!: string;
  profileId!: string;
  fundProviderId!: string;
  cellNumber!: string;
  source!: string;
  submitting!: boolean;
  wrongCellNumber = signal<{
    userCellNumber: string;
    cellNumberInRequest: string;
  } | null>(null);
  errorMode = signal<'NOT_FOUND' | 'NO_PLAN' | 'WRONG_CELL_NUMBER' | null>(null);
  isForm = signal<boolean>(false);
  getWalletSubscription!: Subscription;
  wallets!: CreditWallet[];
  protected readonly BorderColorsEnum = BorderColorsEnum;

  private bottomSheetService = inject(NgxBottomSheetService);
  private preRegistrationService = inject(PreRegistrationByUnderwriterService);
  private activatedRoute = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private creditUrlService = inject(CreditUrlService);
  private router = inject(Router);
  private userService = inject(CreditUserService);
  private apiService = inject(BaseApiService);
  private preRegistrationSubmitterService = inject(PreRegistrationSubmitterService);
  private walletCardService = inject(WalletCardService);

  ngOnInit(): void {
    this.getDataFromQueryParams();
  }

  getDataFromQueryParams() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.nationalCode = params['nationalCode'];
      this.birthDate = params['birthDate'];
      this.orgId = params['org'];
      this.profileId = params['profile'];
      this.cellNumber = params['cellNumber'];
      this.fundProviderId = params['fpId'];
      this.source = params['utm_source'];
      if (!this.validateData()) {
        this.showValidationError();
        return;
      }
      this.gettingData.set(true);
      this.userService.currentUser().then((user) => {
        if (this.cellNumber === user.cellNumber) {
          this.getData()
            .then(() => {
              if (this.source === 'website') {
                this.checkCreditWallets();
              }
              this.initiateData();
              this.selectDefaultValues();
              this.gettingData.set(false);
            })
            .catch((error) => {
              this.errorMode.set(error);
              this.gettingData.set(false);
            });
        } else {
          this.wrongCellNumber.set({
            cellNumberInRequest: this.cellNumber,
            userCellNumber: user.cellNumber,
          });
          this.errorMode.set('WRONG_CELL_NUMBER');
          this.gettingData.set(false);
        }
      });
    });
  }

  checkCreditWallets() {
    this.getWalletSubscription = this.walletCardService.getRawWalletList().subscribe(({ wallets }) => {
      for (const wallet of wallets) {
        const walletInProgressActive =
          wallet.status === CREDIT_WALLET_STATUS.INACTIVE ||
          wallet.status === CREDIT_WALLET_STATUS.START_ACTIVATION ||
          wallet.status === CREDIT_WALLET_STATUS.OPERATION_PROCESS ||
          wallet.status === CREDIT_WALLET_STATUS.IN_PROGRESS ||
          wallet.status === CREDIT_WALLET_STATUS.COMPLETED;

        if (walletInProgressActive && wallet.serviceType !== SERVICE_TYPE.BNPL) {
          this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/overview'));
          return;
        }
      }
    });
  }

  validateData(): boolean {
    if (!this.birthDate || !this.orgId || !this.profileId || !this.fundProviderId || !this.cellNumber || !this.nationalCode) {
      return false;
    }
    if (!/^09\d{9}$/.test(this.cellNumber)) {
      return false;
    }
    return true;
  }

  getData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.preRegistrationService
        .getPlans({
          nationalCode: this.nationalCode,
          fundProviderId: this.fundProviderId,
          organizationId: this.orgId,
          profileId: this.profileId,
        })
        .subscribe({
          next: (response) => {
            if (!response || !response.length) {
              reject('NO_PLAN');
              return;
            }
            this.plans = response;
            resolve();
          },
          error: (error) => {
            if (error && error.result && error.result.status === 17005) {
              reject('NOT_FOUND');
              return;
            }
            this.messageService.showErrorOfErrorResponse(error);
            this.closeFlow();
          },
        });
    });
  }

  ngAfterViewInit(): void {
    const amountList = this.preRegistrationService.distinctFieldItems('creditAmount', this.plans);
    this.amountOptions.set(
      amountList.map((creditAmount) => {
        return {
          value: +creditAmount,
          template: this.creditAmountSlideTemplate(),
          templateContext: { amount: creditAmount },
        };
      }),
    );
  }

  initiateData(): void {
    this.dataTree = {};
    const amountList = this.preRegistrationService.distinctFieldItems('creditAmount', this.plans);
    this.amountOptions.set(
      amountList.map((creditAmount) => {
        if (this.creditAmountSlideTemplate()) {
          return {
            value: +creditAmount,
            template: this.creditAmountSlideTemplate(),
            templateContext: { amount: creditAmount },
          };
        }
        return { value: +creditAmount, label: `${creditAmount}` };
      }),
    );
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
    if (!this.amountOptions()[0]) {
      return;
    }
    this.selectedAmount.set(this.amountOptions()[0].value);
    this.onChangeAmountFilter();
    this.selectedInstallmentCount.set(this.installmentCountOptions()[0].value);
    this.onChangeFilters();
  }

  back(): void {
    this.closeFlow();
  }

  onSelectedAmountChange(selectedAmount: number): void {
    this.selectedAmount.set(selectedAmount);
    this.onChangeAmountFilter();
    this.onChangeFilters();
  }

  onChangeAmountFilter(): void {
    this.installmentCountOptions.update((items) =>
      items.map((item) => {
        const disabled = !(
          this.dataTree[this.selectedAmount()!][item.value] && Object.keys(this.dataTree[this.selectedAmount()!][item.value]).length > 0
        );
        return {
          ...item,
          disabled: disabled,
          tooltip: disabled ? 'این تعداد اقساط برای این مبلغ وام فعال نیست.' : '',
        };
      }),
    );

    if (this.dataTree[this.selectedAmount()!][this.selectedInstallmentCount()!]) {
      return;
    }
    this.selectedInstallmentCount.set(+Object.keys(this.dataTree[this.selectedAmount()!])[0]);
  }

  onSelectedInstallmentCountChange(selectedInstallmentCount: number) {
    this.selectedInstallmentCount.set(selectedInstallmentCount);
    this.onChangeFilters();
  }

  onChangeFilters(): void {
    this.filteredPlans.set(this.dataTree[this.selectedAmount()!][this.selectedInstallmentCount()!]);
    this.showLoadingOnCards();
  }

  showLoadingOnCards(): void {
    this.loadingCards.set(true);
    setTimeout(() => {
      this.loadingCards.set(false);
    }, 300);
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
    const conditions: { title: string; description?: string }[] = [];
    selectedPlanGroup.details.forEach((item) => {
      conditions.push({
        title: item.description.body,
        description: item.description.info && item.description.info.description,
      });
    });
    const data: CreditPlanConditionsBottomSheetData = {
      title: 'شرایط دریافت بسته اعتباری انتخاب شده',
      conditions,
      hintMessage: selectedPlanGroup.allocationPrepaymentAmount
        ? 'هزینه ‌خدمات و زیرساخت‌ این طرح در آخرین مرحله ثبت‌نام دریافت می‌شود.'
        : '',
    };

    this.bottomSheetService.openBottomSheet(CreditPlanConditionsBottomSheetComponent, data, { noPadding: true });
    const onCloseBottomSheet = this.bottomSheetService.onClose.subscribe(() => {
      onCloseBottomSheet.unsubscribe();
      const result: any = this.bottomSheetService.outputData();
      if (result && result.confirmed) {
        this.register(selectedPlanGroup.planId, selectedPlanGroup.groupId);
      }
    });
  }

  register(planId: string, groupId: string): void {
    const payload: PreRegisterRequest = {
      nationalCode: this.nationalCode,
      birthDate: this.birthDate,
      planId,
      groupId,
      organizationId: this.orgId,
    };
    this.preRegistrationSubmitterService
      .submit(payload)
      .then(() => {
        this.submitting = false;
      })
      .catch((errors) => {
        this.messageService.showErrorOfErrorResponse(errors);
        this.submitting = false;
      });
  }

  closeFlow(): void {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/resolve')).then();
  }

  showForm(): void {
    this.isForm.set(true);
  }

  updateUserDate(user: { nationalCode: string; birthDate: number }) {
    const queryParams: Params = {
      nationalCode: user.nationalCode,
      birthDate: user.birthDate,
    };
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
    this.isForm.set(false);
  }

  loginAgain() {
    this.apiService.post('users/logout', {}).subscribe(() => {
      this.userService.purgeAuth(false);
      window.location.reload();
    });
  }

  cancel() {
    this.closeFlow();
  }

  showValidationError(): void {
    this.messageService.showErrorMessage('اطلاعات ورود نامعتبر است.');
    this.closeFlow();
  }

  ngOnDestroy(): void {
    if (this.getWalletSubscription) {
      this.getWalletSubscription.unsubscribe();
    }
  }
}

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { SwiperOptions } from 'swiper/types';
import { PlanGroup } from '../../../models/credit/credit-plan-group';
import { CreditButtonSelectOption } from '../../../models/credit/credit-button-select-option';
import { SliderSelectOption } from '../../../models/credit/slider-select-option.interface';
import { CreditCalculatorService } from '../../../../api/clients/credit/credit-calculator/credit-calculator.service';
import { ActivatedRoute } from '@angular/router';
import { DialogBottomSheetService } from '../../../../core/services/dialog-bottom-sheet.service';
import {
  CCreditTejaratAdditionalData
} from '../../../../website/pages/credit/c-credit-club/c-credit-tejarat-additional.data';
import { CCreditStepsDialogComponent } from '../credit-steps-onboard-dialog/c-credit-steps-dialog.component';
import { PRE_REGISTRATION_STEP_TYPE } from '../../../../api/clients/credit/pre-registration-step';
import { UserService } from '../../../../core/services/user.service';
import { delay, of, Subscription } from 'rxjs';
import { CurrencyPipe } from '../../../ui-pipes/currency.pipe';
import {
  CreditFundProviderGroupsListComponent
} from './credit-fund-provider-groups-list/credit-fund-provider-groups-list.component';
import { CreditPlansLoadingComponent } from './credit-plans-loading/credit-plans-loading.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { SwiperDirective } from '../../../ui-directive/swiper.directive';
import { register } from 'swiper/element/bundle';
import { NgxIcon } from '@digipay/ngx-icon';
import { UserType } from '../../../../website/pages/credit/c-credit-club/models/user-type-model';

register();
@Component({
  selector: 'app-credit-calculator-v3',
  templateUrl: './credit-calculator-v3.component.html',
  styleUrls: ['./credit-calculator-v3.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    CreditPlansLoadingComponent,
    CreditFundProviderGroupsListComponent,
    CurrencyPipe,
    SwiperDirective,
    NgIf,
    NgForOf,
    NgxIcon,
  ],
})
export class CreditCalculatorV3Component implements OnInit, OnDestroy, AfterViewInit {
  index = 0;
  @Input() isEntekhab = false;

  @Input() certainFundProviderCode = null;

  @Input() certainCollateralType = '';

  @Input() certainPlan = false;

  @Input() title = '';

  @Input() showFundProviderIcon = true;

  @Input() isDetailPageCtaDisplayed = true;

  @Input() showInterestPercentage = true;

  @Input() userType: UserType;

  @Output() selectedCollateral = new EventEmitter<string>();

  @Output() selectedAmountChangeEmitter = new EventEmitter<number>();

  @Output() selectedInstallmentChangeEmitter = new EventEmitter<number>();

  @Output() selectedPlan = new EventEmitter<any>();

  amountOptions: SliderSelectOption[] = [];

  installmentCountOptions: CreditButtonSelectOption[] = [];

  selectedAmount: number;
  selectedPlanIndex = 0;

  selectedInstallmentCount: number;

  loadingCards = true;

  filteredPlans: PlanGroup[] = [];

  @Input() plans!: PlanGroup[];
  @Input() maxLoan!: number;

  @Input() detailTitle = 'طرح‌های موجود بر اساس مبلغ وام انتخابی شما';

  dataTree: {
    [key: number]: {
      [key: number]: PlanGroup[];
    };
  } = {};

  @ViewChild('mySwiper') mySwiper: any;

  swiperConfig: SwiperOptions = {
    allowTouchMove: true,
    slidesPerView: 1,
    centerInsufficientSlides: true,
    centeredSlidesBounds: true,
    loop: false,
    centeredSlides: true,
    slideToClickedSlide: true,
    watchSlidesProgress: true,
    updateOnWindowResize: true,
  };

  isUserLogedIn = false;
  isUserLogedIn$!: Subscription;
  estimate$!: Subscription;

  protected readonly Object = Object;

  constructor(
    private creditCalculatorService: CreditCalculatorService,
    private changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute,
    private dialogService: DialogBottomSheetService,
    private userService: UserService,
  ) {}

  get getBigestValue() {
    const stringArr = Object.keys(this.dataTree);
    stringArr.sort((a, b) => (a > b ? -1 : 1));
    return stringArr;
  }

  ngOnInit(): void {
    if (this.plans) {
      this.initiateData();
      this.selectDefaultValues();
    } else {
      this.creditCalculatorService.init(this.userType).then(() => {
        this.creditCalculatorService.unsetFilters(['allocationPrepaymentAmount', 'creditAmount', 'installmentCount', 'fundProviderCode']);
        this.plans = this.creditCalculatorService.filteredPlans;
        this.initiateData();
        this.selectDefaultValues();
        this.route.queryParams.subscribe((params) => {
          if (params.amount && params.installmentCount) {
            this.swipeToCertainPlan(params.amount, params.installmentCount);
          }
        });
      });
    }

    this.isUserLogedIn$ = this.userService.isLoggedIn.subscribe((isLogedIn) => {
      this.isUserLogedIn = isLogedIn;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.mySwiper && this.mySwiper.swiper) {
        this.mySwiper.swiper.on('slideChange', () => {
          this.changeCreditPlan();
        });
      }
    });
  }

  ngOnDestroy() {
    this.isUserLogedIn$?.unsubscribe();
    this.estimate$?.unsubscribe();
  }

  swipeToCertainPlan(selectedAmount, selectedInstallmentCount) {
    this.selectedAmount = parseInt(selectedAmount);
    this.selectedInstallmentCount = parseInt(selectedInstallmentCount);
    this.selectedPlanIndex = Object.keys(this.dataTree).findIndex((data) => data === selectedAmount);
    const swiperInterval = setInterval(() => {
      if (this.mySwiper && this.mySwiper.swiperRef) {
        this.mySwiper.swiperRef.slideTo(this.selectedPlanIndex);
        clearInterval(swiperInterval);
      }
    }, 1000);
    this.onChangeFilters();
  }

  initiateData(): void {
    this.dataTree = {};
    this.certainFundProviderCode ? this.filterBasedOnFundProvider() : '';
    this.certainCollateralType ? this.filterBasedOnCollateral() : '';

    const amountList = this.creditCalculatorService.distinctFieldItems('creditAmount', this.plans);
    if (amountList.length === 0) {
      this.loadingCards = false;
    }
    this.amountOptions = amountList.map((creditAmount) => {
      return { value: +creditAmount, label: `${creditAmount}` };
    });

    this.installmentCountOptions = this.creditCalculatorService
      .distinctFieldItems('installmentCount', this.plans)
      .map((installmentCount) => {
        return { value: +installmentCount, label: `${installmentCount} قسط` };
      });
    amountList.forEach((amount) => {
      this.dataTree[amount] = {};
      const installmentCountList = this.creditCalculatorService.distinctFieldItems(
        'installmentCount',
        this.plans.filter((item) => +item.creditAmount === +amount),
      );
      installmentCountList.forEach((ic) => {
        this.dataTree[amount][ic] = this.plans.filter((item) => +item.creditAmount === +amount && +item.installmentCount === +ic);
      });
    });
  }

  filterBasedOnFundProvider() {
    this.plans = this.plans.filter((plan) => +plan.fundProvider.fundProviderCode === this.certainFundProviderCode);
  }

  filterBasedOnCollateral() {
    this.plans = this.plans.filter((plan) => plan.collateralDto.type === this.certainCollateralType);
    if (this.certainFundProviderCode === 13) {
      for (const plan of CCreditTejaratAdditionalData) {
        this.plans.push(plan);
      }
    }
  }

  selectDefaultValues(): void {
    if (!this.amountOptions[0]) {
      return;
    }

    this.selectedAmount = this.amountOptions[0].value;

    this.onChangeAmountFilter();
    const selectedPlan = this.installmentCountOptions.find((element) => {
      return !element.disabled;
    });

    this.selectedInstallmentCount = selectedPlan.value;

    this.onChangeFilters();
  }

  onChangeAmountFilter(): void {
    this.installmentCountOptions.forEach((ic, index) => {
      this.installmentCountOptions[index].disabled = !(
        this.dataTree[this.selectedAmount][ic.value] && Object.keys(this.dataTree[this.selectedAmount][ic.value]).length > 0
      );
      this.installmentCountOptions[index].tooltip = this.installmentCountOptions[index].disabled
        ? 'این تعداد اقساط برای این مبلغ اعتبار فعال نیست.'
        : '';
    });
    if (this.dataTree[this.selectedAmount][this.selectedInstallmentCount]) {
      return;
    }
    this.selectedInstallmentCount = +Object.keys(this.dataTree[this.selectedAmount])[0];
  }

  onChangeFilters(): void {
    this.filteredPlans = this.dataTree[this.selectedAmount][this.selectedInstallmentCount];
    this.selectedAmountChangeEmitter.emit(this.selectedAmount);
    this.selectedInstallmentChangeEmitter.emit(this.selectedInstallmentCount);
    this.selectedPlan.emit(this.filteredPlans);
    this.showLoadingOnCards();
  }

  showLoadingOnCards(): void {
    this.loadingCards = true;
    this.changeDetector.detectChanges();
    of('')
      .pipe(delay(300))
      .subscribe({
        next: () => {
          this.loadingCards = false;
          this.changeDetector.detectChanges();
        },
      });
  }

  onSelectedInstallmentCountChange() {
    this.creditCalculatorService.setFilters({
      creditAmount: this.selectedInstallmentCount,
    });
    this.onChangeFilters();
  }

  onSelectedAmountChange(selectedAmount: number): void {
    this.selectedAmount = selectedAmount;
    this.creditCalculatorService.setFilters({ creditAmount: selectedAmount });
    this.onChangeAmountFilter();
    this.onChangeFilters();
  }

  changeCreditPlan() {
    this.selectedPlanIndex = this.mySwiper?.swiperInstance?.activeIndex;
    this.onSelectedAmountChange(+Object.keys(this.dataTree)[this.selectedPlanIndex]);
  }

  changeInstallmentAmount(installmentAmount: number) {
    this.selectedInstallmentCount = installmentAmount;
    this.onSelectedInstallmentCountChange();
  }

  openStepsDialog(selectedPlanGroup: PlanGroup) {
    this.initStepsDataForDialog(selectedPlanGroup);
  }

  initStepsDataForDialog(selectedPlanGroup: PlanGroup) {
    const conditions: {
      title: string;
      description?: string;
    }[] = [];
    selectedPlanGroup.details.forEach((item) => {
      conditions.push({
        title: item.description.body,
        description: item.description.info && item.description.info.description,
      });
    });
    const steps = [
      {
        type: PRE_REGISTRATION_STEP_TYPE.CHEQUE,
        navTitle: selectedPlanGroup.collateralDto.name,
        title: `شرایط ${selectedPlanGroup.collateralDto.name}`,
        skip: false,
        active: false,
        info: {
          conditions: {
            title: selectedPlanGroup.collateralDto.description.header,
            description: selectedPlanGroup.collateralDto.description.body,
          },
        },
      },
      {
        type: PRE_REGISTRATION_STEP_TYPE.ADDITIONAL_INFO,
        navTitle: 'اطلاعات تکمیلی',
        title: '',
        skip: false,
        active: false,
        info: {
          collateral: selectedPlanGroup.collateralDto,
        },
      },
      {
        type: PRE_REGISTRATION_STEP_TYPE.PLAN_INFO,
        navTitle: 'اطلاعات بسته انتخابی',
        title: 'اطلاعات بسته انتخابی',
        skip: false,
        active: false,
        info: {
          selectedPlanGroup: selectedPlanGroup,
          conditions,
        },
      },
    ];
    if (selectedPlanGroup.collateralDto.type === 'BASED_ON_SCORE') {
      steps.shift();
    }

    this.dialogService.open(CCreditStepsDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      fullHeightBottomSheet: true,
      selectedPlanGroup,
      steps,
      utmMedium: 'c-credit',
    });
  }

  selectFundProvider(plan: {
    allocationPrepaymentAmount: number;
    fundProviderCode: number;
    collaterals: { name: string; type: string }[];
  }): void {
    const selectedPlanGroup: PlanGroup = this.filteredPlans.find(
      (item) => item.fundProvider.fundProviderCode === plan.fundProviderCode && item.collateralDto.type === plan.collaterals[0].type,
    );
    this.openStepsDialog(selectedPlanGroup);
  }

  scrollToElement(element: string) {
    const El = document.getElementById(element);
    if (El) {
      El.scrollIntoView({ block: 'center', inline: 'end' });
    }
  }

  changeCollateral(collateral: string) {
    this.selectedCollateral.emit(collateral);
  }
}

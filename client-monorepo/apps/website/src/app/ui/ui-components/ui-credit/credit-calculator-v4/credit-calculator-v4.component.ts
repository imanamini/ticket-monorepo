import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  computed,
  Inject,
  inject,
  input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { SwiperOptions } from 'swiper/types';
import { PlanGroup } from '../../../models/credit/credit-plan-group';
import { SliderSelectOption } from '../../../models/credit/slider-select-option.interface';
import { ActivatedRoute } from '@angular/router';
import { DialogBottomSheetService } from '../../../../core/services/dialog-bottom-sheet.service';
import { UserService } from '../../../../core/services/user.service';
import { delay, of, Subscription } from 'rxjs';
import { CurrencyPipe } from '../../../ui-pipes/currency.pipe';
import { SwiperDirective } from '../../../ui-directive/swiper.directive';
import { register } from 'swiper/element/bundle';
import { CreditCalculatorV2Service } from '../../../../api/clients/credit/credit-calculator/credit-calculator-v2.service';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxChipComponent } from '@digipay/ngx-chip';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { CreditBestPlanCardComponent } from './credit-best-plan-card/credit-best-plan-card.component';
import { ApiImageComponent } from '@digipay/ng-ui-api-image';
import { NgxAlert } from '@digipay/ngx-alert';
import { DeviceDetectorService } from '../../../../core/services/device/deviceDetector.service';
import { isPlatformBrowser } from '@angular/common';
import { CreditNumberToStringPipe } from '../../../../../../../../libs/applets/credit/src/lib/features/credit/data-access/pipes/credit-number-to-string.pipe';
import { environment } from 'apps/website/src/environments/environment';

register();

@Component({
  selector: 'app-credit-calculator-v4',
  templateUrl: './credit-calculator-v4.component.html',
  styleUrls: ['./credit-calculator-v4.component.scss'],
  standalone: true,
  imports: [
    CurrencyPipe,
    SwiperDirective,
    NgxButtonComponent,
    NgxChipComponent,
    NgxSpinnerModule,
    CreditBestPlanCardComponent,
    ApiImageComponent,
    NgxAlert,
    CreditNumberToStringPipe,
  ],
})
export class CreditCalculatorV4Component implements OnInit, OnDestroy, AfterViewInit {
  certainFundProviderCode = input(null);

  certainCollateralType = input('');

  title = input('');

  amountOptions = signal<SliderSelectOption[]>([]);

  selectedAmount = signal<number | undefined>(undefined);

  selectedInstallmentCount = signal<number | undefined>(undefined);

  loadingCards = signal(false);

  gettingData = signal(false);

  plans = signal<PlanGroup[]>([]);

  dataTree = signal<{ [key: number]: { [key: number]: PlanGroup[] } }>({});

  selectedMerchantLogos = computed<{ logo: string; color: string }[]>(() => {
    const selectedPlans: PlanGroup[] = this.dataTree()?.[this.selectedAmount()]?.[this.selectedInstallmentCount()] || [];
    const output: { [key: number]: { logo: string; color: string } } = {};
    selectedPlans.forEach((plan: PlanGroup) => {
      output[plan.fundProvider.fundProviderCode] = {
        color: plan.fundProvider.color,
        logo: plan.fundProvider.icon,
      };
    });
    return Object.values(output);
  });

  @ViewChild('mySwiper') mySwiper: any;

  swiperConfig: SwiperOptions = {
    allowTouchMove: true,
    slidesPerView: 2.3,
    centerInsufficientSlides: true,
    centeredSlidesBounds: false,
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

  deviceDetector = inject(DeviceDetectorService);

  constructor(
    private creditCalculatorService: CreditCalculatorV2Service,
    private changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute,
    private dialogService: DialogBottomSheetService,
    private userService: UserService,
    @Inject(PLATFORM_ID) public platformId: string,
  ) {}

  ngOnInit(): void {
    this.gettingData.set(true);
    this.creditCalculatorService.init().then(() => {
      this.plans.set(this.creditCalculatorService.allPlans());
      if (this.plans().length > 0) {
        this.initiateData();
        this.selectDefaultValues();
      }
      this.gettingData.set(false);
    });

    this.isUserLogedIn$ = this.userService.isLoggedIn.subscribe((isLogedIn) => {
      this.isUserLogedIn = isLogedIn;
    });
  }

  ngAfterViewInit() {
    of('')
      .pipe(delay(0))
      .subscribe(() => {
        if (this.mySwiper && this.mySwiper.swiper) {
          this.mySwiper.swiper.on('slideChange', () => {
            this.onAmountChange();
          });
        }
      });
  }

  ngOnDestroy() {
    this.isUserLogedIn$?.unsubscribe();
    this.estimate$?.unsubscribe();
  }

  initiateData(): void {
    const dataTree = {};

    const amountList = this.creditCalculatorService.distinctFieldItems('creditAmount', this.plans());
    if (amountList.length === 0) {
      this.loadingCards.set(false);
    }
    this.amountOptions.set(
      amountList.map((creditAmount) => {
        return { value: +creditAmount, label: `${creditAmount}` };
      }),
    );

    amountList.forEach((amount) => {
      dataTree[amount] = {};
      const installmentCountList = this.creditCalculatorService.distinctFieldItems(
        'installmentCount',
        this.plans().filter((item) => +item.creditAmount === +amount),
      );
      installmentCountList.forEach((ic) => {
        dataTree[amount][ic] = this.plans().filter((item) => +item.creditAmount === +amount && +item.installmentCount === +ic);
      });
    });

    this.dataTree.set(dataTree);
  }

  findBestPlan(plans: PlanGroup[]): PlanGroup {
    return plans[0];
  }

  selectDefaultValues(): void {
    this.selectedAmount.set(+Object.keys(this.dataTree())[0]);
    this.selectedInstallmentCount.set(+Object.keys(this.dataTree()[this.selectedAmount()])[0]);
  }

  showLoadingOnCards(): void {
    this.loadingCards.set(true);
    of('')
      .pipe(delay(300))
      .subscribe({
        next: () => {
          this.loadingCards.set(false);
        },
      });
  }

  onAmountChange() {
    this.selectedAmount.set(+Object.keys(this.dataTree())[this.mySwiper?.swiperInstance?.activeIndex]);
    if (!this.dataTree()[this.selectedAmount()][this.selectedInstallmentCount()]) {
      this.selectedInstallmentCount.set(+Object.keys(this.dataTree()[this.selectedAmount()])[0]);
    }
    this.showLoadingOnCards();
  }

  changeInstallmentCount(installmentAmount: number): void {
    this.selectedInstallmentCount.set(installmentAmount);
    this.showLoadingOnCards();
  }

  onButtonClick(link: string) {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = environment.appUrl + link;
    }
  }

  protected readonly isPlatformBrowser = isPlatformBrowser;
  protected readonly environment = environment;
}

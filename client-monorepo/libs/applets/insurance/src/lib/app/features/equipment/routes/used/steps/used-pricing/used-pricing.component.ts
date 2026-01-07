import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  ViewEncapsulation
} from '@angular/core';
import { Observable, of, Subscription, switchMap } from 'rxjs';
import { JourneyNamesModel } from '../../../../shared-steps/models/journey-names.model';
import { LoadingService } from '../../../../../../data-access/services/loading.service';
import { UsedDeviceInfoService } from '../used-device-info/services/used-device-info.service';
import { SharedUsedService } from '../../services/shared-used.service';
import { UsedApiService } from '../../../../api/services/used/used-api.service';
import { AsyncPipe, Location } from '@angular/common';
import { JourneyButtonsComponent } from '../../../../partials/journey-buttons/journey-buttons.component';
import {
  UiLoadingSpinnerComponent
} from '../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';
import { UsedManualPricingComponent } from './partials/used-manual-pricing/used-manual-pricing.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { UsedHeaderButtonModes } from '../../partials/used-header/models/used-header-button.modes';
import { UsedPricingTypeModel } from './models/used-pricing-type-model';
import { UsedSelectedCardTypeModel } from './models/used-selected-card-type';
import { DeviceValuationGuideComponent } from './partials/device-valuation-guide/device-valuation-guide.component';
import { OrderModel } from '../../../../api/models/renewal/order.model';
import { ProductCategoryModel } from '../../../../api/models/policy/product-category.model';
import { SetPriceBodyModel } from '../../../../api/models/pricing/set-price-body.model';
import { AlertSizeEnum } from '../../../../../../data-access/enums/alert-size.enum';
import { InsAlertComponent } from '../../../../../../components/ins-alert/ins-alert.component';
import { AlertActionButtonTypeEnum } from '../../../../../../data-access/enums/alert-action-button-type.enum';
import { AlertActionButtonAlignEnum } from '../../../../../../data-access/enums/alert-action-button-align.enum';
import { AlertColorEnum } from '../../../../../../data-access/enums/alert-color.enum';
import { CampaignCalculationsService } from './services/campaign-calculations.service';
import { DiscountReserveBody } from '../../../../api/models/renewal/discount-reserve-body.model';
import { CampaignCalculationsModel } from './models/campaign-calculations.model';
import { UsedProductInfoModel } from './models/used-product-info.model';
import { map } from 'rxjs/operators';
import { IntrackService } from '../../../../../../data-access/services/intrack.service';
import { DpxService } from '../../../../../../data-access/services/dpx.service';
import { ActivatedRoute, Router } from '@angular/router';
import { isDesktop, isMobileOrTablet } from '@client-monorepo/common/utilities';
import { InsDigikalaService } from '../../../../../../data-access/services/ins-digikala.service';
import { INSURANCE_APP_PREFIX } from '../../../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'used-pricing',
  templateUrl: './used-pricing.component.html',
  standalone: true,
  imports: [AsyncPipe, JourneyButtonsComponent, UiLoadingSpinnerComponent, UsedManualPricingComponent, InsAlertComponent],
  styleUrls: ['./used-pricing.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UsedPricingComponent implements OnInit, OnDestroy {
  @Output() hasError: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private service: SharedUsedService,
    private apiService: UsedApiService,
    private loadingService: LoadingService,
    private deviceInfoService: UsedDeviceInfoService,
    private sheet: MatBottomSheet,
    private campaignCalculationsService: CampaignCalculationsService,
    private intrackService: IntrackService,
    private dpxService: DpxService,
    private router: Router,
    private digikalaService: InsDigikalaService,
    private location: Location,
  ) {
  }

  @Input()
  journey: JourneyNamesModel;

  // Subscriptions
  subscription: Subscription = new Subscription();
  // Vars
  uniqueCode: string;
  isMobile = isMobileOrTablet() || !isDesktop();
  loading$: Observable<boolean> = this.loadingService.getLoading();
  selectedCategory: string;
  orderInfo: OrderModel;
  isSubmitting = false;
  suggestedPrice: number;
  selectedCard: UsedSelectedCardTypeModel;
  pricingType: UsedPricingTypeModel;
  price: number;
  manualPrice = 0;
  // ENUMS
  protected readonly AlertSizeEnum = AlertSizeEnum;
  protected readonly AlertActionButtonTypeEnum = AlertActionButtonTypeEnum;
  protected readonly AlertActionButtonAlignEnum = AlertActionButtonAlignEnum;
  protected readonly AlertColorEnum = AlertColorEnum;
  protected readonly UsedSelectedCardTypeModel = UsedSelectedCardTypeModel;
  campaignCalculationItem = signal<CampaignCalculationsModel>(null);
  isManualPriceValid = signal<boolean>(null);
  disabledButton = computed(() => this.isManualPriceValid());
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    this.service.setJourney(this.journey);
    this.getUniqueCode();
    this.setHeaderData();
    this.subscribeToBackClick();
  }

  setHeaderData(): void {
    this.service.setHeaderData({
      showBackBtn: true,
      backClickHandler: () => {
        if (this.dpxService.IsEnteredFromDpx) {
          this.dpxService.goToDpxHome();
        } else if (this.digikalaService.isDigikala) {
          this.location.back();
        } else {
          this.router.navigate([INSURANCE_APP_PREFIX]).then();
        }
      },
      headerTitle: 'ارزش دستگاه',
      actionButtons: [{mode: UsedHeaderButtonModes.PROFILE}],
    });
  }

  subscribeToBackClick(): void {
    const subscription = this.service.getBackClick().subscribe(() => {
      this.deviceInfoService.setShowBrandPicker(true);
      this.service.setStepChangeSubject('PREVIOUS');
    });
    this.subscription.add(subscription);
  }

  getUniqueCode(): void {
    this.loadingService.setLoading(true);
    const subscription = this.service.getUniqueCode().subscribe({
      next: (code) => {
        if (code) {
          this.uniqueCode = code;
          this.getOrderInfo();
        }
      },
    });
    this.subscription.add(subscription);
  }

  getOrderInfo(): void {
    const subscription = this.apiService
      .getOrderInfo(this.uniqueCode)
      .pipe(
        switchMap((res) => {
          this.hasError.emit(false);
          this.selectedCategory = ProductCategoryModel[res.data.productCategory.toUpperCase()];
          this.orderInfo = res.data;
          const isManualBrandModelSelected = !this.orderInfo?.productBrandId && !this.orderInfo?.productModelId;
          if (!isManualBrandModelSelected) {
            return this.getProductInfo().pipe(
              switchMap((productInfo) => {
                this.suggestedPrice = productInfo.price;
                this.selectedCard =
                  res.data.announcedPrice > 0
                    ? res.data.pricingType === UsedPricingTypeModel.Price
                      ? UsedSelectedCardTypeModel.Manual
                      : UsedSelectedCardTypeModel.NotManual
                    : productInfo.price > 0
                      ? UsedSelectedCardTypeModel.NotManual
                      : UsedSelectedCardTypeModel.Manual;
                const price = res.data.announcedPrice || productInfo.price;
                if (price) {
                  return this.campaignCalculationsService.campaignCalculations(this.uniqueCode, price);
                } else {
                  return of(null);
                }
              }),
            );
          } else {
            this.loadingService.setLoading(false);
            this.selectedCard = UsedSelectedCardTypeModel.Manual;
          }
        }),
      )
      .subscribe({
        next: (response) => {
          this.campaignCalculationItem.set(response);
          this.loadingService.setLoading(false);
        },
        error: (e) => {
        },
      });
    this.subscription.add(subscription);
  }

  getProductInfo(): Observable<UsedProductInfoModel> {
    return this.apiService.getProductInfo(this.orderInfo.productBrandId, this.orderInfo.productModelId).pipe(map((res) => res.data));
  }

  setPricing(): void {
    this.isSubmitting = true;
    const price = this.suggestedPrice ? String(this.suggestedPrice) : null;
    if (this.selectedCard === UsedSelectedCardTypeModel.Manual) {
      this.pricingType = UsedPricingTypeModel.Price;
      this.price = this.manualPrice;
    } else {
      this.pricingType = UsedPricingTypeModel.SuggestedPrice;
      this.price = this.suggestedPrice;
    }
    const body: SetPriceBodyModel = {
      key: this.uniqueCode,
      price: this.price ? this.price : 0,
      pricingType: this.pricingType,
    };
    const subscription = this.apiService.setPrice(body).subscribe({
      next: (res) => {
        this.intrackService.sendIntrackEvent(this.selectedCard === UsedSelectedCardTypeModel.Manual ? 'I_MVS' : 'I_CCV', {
          DeviceModel: this.orderInfo.productBrand ?? '',
          DeviceBrand: this.orderInfo.productModel ?? '',
          DevicePrice: price ? price : '',
          ValuationMethod: this.selectedCard === UsedSelectedCardTypeModel.Manual ? 'MANUAL' : 'DEFAULT',
          uniquecode: this.uniqueCode ?? '',
          State: 'SUCCESS',
        });
        if (this.selectedCard === UsedSelectedCardTypeModel.Manual) {
          this.campaignCalculationsService.getCampaignDiscount().subscribe(() => this.setCampaignDiscount());
        } else {
          this.setCampaignDiscount();
        }
      },
      error: (err) => {
        this.intrackService.sendIntrackEvent(this.selectedCard === UsedSelectedCardTypeModel.Manual ? 'I_MVS' : 'I_CCV', {
          DeviceModel: this.orderInfo.productBrand ?? '',
          DeviceBrand: this.orderInfo.productModel ?? '',
          DevicePrice: price ? price : '',
          ValuationMethod: this.selectedCard === UsedSelectedCardTypeModel.Manual ? 'MANUAL' : 'DEFAULT',
          uniquecode: this.uniqueCode ?? '',
          State: 'FAILED',
          ErrorMessage: err.message ?? '',
        });
        this.isSubmitting = false;
      },
    });
    this.subscription.add(subscription);
  }

  goToNextStep(): void {
    this.setPricing();
  }

  private setCampaignDiscount(): void {
    if (
      this.campaignCalculationsService.campaignItem?.campaignDiscountCode &&
      this.campaignCalculationsService.campaignItem?.campaignDiscountCode !== this.orderInfo.discountCode
    ) {
      const body: DiscountReserveBody = {
        key: this.uniqueCode,
        discountCode: this.campaignCalculationsService.campaignItem.campaignDiscountCode,
      };
      this.apiService.reserveDiscount(body).subscribe(() => {
        this.service.setStepChangeSubject('NEXT');
      });
    } else {
      this.service.setStepChangeSubject('NEXT');
    }
  }

  handleActiveCard(ev: UsedSelectedCardTypeModel): void {
    if (this.suggestedPrice) {
      this.selectedCard = ev;
    }
  }

  handleManualPriceValueChange(val: string): void {
    this.price = undefined;
    this.manualPrice = +val * 10;
  }

  linkButtonClicked(): void {
    this.sheet.open(DeviceValuationGuideComponent);
  }

  setTextAlert(): string {
    return this.selectedCard === UsedSelectedCardTypeModel.Manual
      ? 'ارزش تخمینی دستگاه شما با توجه به اطلاعات موجود چند ماه اخیر و نوسانات بازار پیدا نشد.'
      : 'این ارزش با توجه به قیمت دستگاه شما در چند ماه اخیر و نوسانات قیمت بررسی و اعلام شده است.';
  }

  selectedColor(): AlertColorEnum {
    if (this.selectedCard === UsedSelectedCardTypeModel.Manual) {
      return AlertColorEnum.Red;
    } else {
      return AlertColorEnum.Blue;
    }
  }

  ngOnDestroy(): void {
    this.loadingService.setLoading(false);
    this.subscription.unsubscribe();
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { PlpEditInformationComponent } from '../../../../components/plp-edit-information/plp-edit-information.component';
import { SectionCardComponent } from '../../../../../../../../components/section-card/section-card.component';
import { BottomSheetBoxComponent } from '../../../../../../../../components/bottom-sheet-box/bottom-sheet-box.component';
import { InsButtonComponent } from '../../../../../../../../components/ins-button/ins-button.component';
import { CarInfoBoxComponent } from '../../../../components/car-info-box/car-info-box.component';
import { InsButtonStyleEnum } from '../../../../../../../../data-access/enums/ins-button-style.enum';
import { QueryParamService } from '../../../../../../../../data-access/services/query-param.service';
import { BaseComponent } from '../../../../../../../../components/base/base.component';
import { InsButtonModeEnum } from '../../../../../../../../data-access/enums/ins-button-mode.enum';
import { VehicleSharedService } from '../../../../../../data-access/services/vehicle-shared.service';
import { SectionCardModel } from '../../../../../../../../data-access/models/section-card.model';
import { MessageService } from '@client-monorepo/common/utilities';
import { BadgeStatusEnum } from '../../../../../../../../data-access/enums/badge-status.enum';
import { AlertColorEnum } from '../../../../../../../../data-access/enums/alert-color.enum';
import { QueryParamKeysEnum } from '../../../../../../../home/query-param-keys.enum';
import { AlertSizeEnum } from '../../../../../../../../data-access/enums/alert-size.enum';
import { ThirdPartyUrlsEnum } from '../../../../data-access/enums/third-party-urls.enum';
import { convertToPersianDate } from '../../../../../../util/persian-date';
import { IconEnum } from '../../../../../../../../data-access/enums/icon.enum';
import { ModalService } from '../../../../../../data-access/services/modal.service';
import { PlateService } from '../../../../data-access/services/plate.service';
import { PlateUtils } from '../../../../../../util/plate';
import { StoreService } from '../../../../data-access/services/store.service';
import { StoreModel } from '../../../../data-access/models/store.model';
import { Router } from '@angular/router';
import { EditSanhabModalEnum } from '../../../../../../data-access/enums/edit-sanhab-modal.enum';
import { ExtraInsurerForm } from '../../../../../../data-access/enums/extra-insurance-company-items.enum';
import { MetricService } from '../../../../../../../../data-access/services/metric.service';
import { InsuranceProductTypeEnum } from '../../../../../../../../data-access/enums/Insurance-product-type.enum';

@Component({
  selector: 'sanhab-car-info',
  standalone: true,
  imports: [InsButtonComponent, CarInfoBoxComponent, SectionCardComponent],
  templateUrl: './sanhab-car-info.component.html',
  styleUrl: './sanhab-car-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SanhabCarInfoComponent extends BaseComponent implements OnInit {
  constructor() {
    super();
  }

  private metricService = inject(MetricService);
  private sharedService = inject(VehicleSharedService);
  private messageService = inject(MessageService);
  private modalService = inject(ModalService);
  private plateService = inject(PlateService);
  private queryParamService = inject(QueryParamService);
  private storeService = inject(StoreService);
  private router = inject(Router);
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly InsButtonModeEnum = InsButtonModeEnum;
  readonly IconEnum = IconEnum;
  protected readonly extraInsurerForm = ExtraInsurerForm;
  private invalidData = false;
  nullData = '-';

  data = signal<StoreModel>(null);

  carInfo = computed<SectionCardModel>(() => {
    const item = {
      title: 'مشخصات خودرو',
      card: {
        title: (this.data()?.vehicleInfo?.carType?.title ?? '') + ' ' + (this.data()?.vehicleInfo?.carBrand?.title ?? ''),
        icon: this.data()?.vehicleInfo?.carBrand?.logo ? 'car-' + this.data()?.vehicleInfo?.carBrand?.logo : null,
        iconSize: 24,
        defaultIcon: IconEnum.DefaultCar,
        subtitle: PlateUtils.convertCarToText(this.plateService?.getPlateData()?.plate),
        border: true,
        expandable: true,
        expanded: true,
        alert: {
          text: 'این اطلاعات بر روی کارت خودرو قابل مشاهده است.',
          hasIcon: true,
          size: AlertSizeEnum.Small,
          color: AlertColorEnum.Blue,
        },
        details: [
          {
            type: 'text',
            title: 'تیپ',
            value: this.data()?.vehicleInfo?.carModel?.title ?? this.nullData,
          },
          {
            type: 'text',
            title: 'کاربری',
            value: this.data()?.vehicleInfo?.carUsage?.title ?? this.nullData,
          },
          {
            type: 'text',
            title: 'سال ساخت/ مدل',
            value: this.data()?.vehicleInfo?.buildYear ?? this.nullData,
          },
        ],
      },
    };
    if (this.data()?.vehicleInfo?.releaseDate && !!this.data()?.previousInsurance?.company?.id) {
      item.card.details.push({
        type: 'text',
        title: 'تاریخ ترخیص',
        value: Number.isInteger(this.data().vehicleInfo.releaseDate)
          ? convertToPersianDate(this.data().vehicleInfo.releaseDate)
          : this.data().vehicleInfo.releaseDate,
      });
    }
    return item as SectionCardModel;
  });

  insurerInfo = computed<SectionCardModel>(() => ({
    title: 'سابقه بیمه‌نامه قبلی',
    card: {
      title: this.data()?.previousInsurance?.company?.title ?? this.nullData,
      icon: this.data()?.previousInsurance?.company?.logo,
      iconSize: 24,
      defaultIcon: IconEnum.EmptyInsurance,
      border: true,
      expandable: true,
      expanded: true,
      alert: {
        text: 'اگر در مدت بیمه‌نامه تصادفی نداشته‌اید، هنگام تمدید بیمه شخص ثالث، تخفیف عدم خسارت برای شما اعمال می‌شود. این تخفیف هر سال ۵٪ افزایش می‌یابد و به تخفیف‌های بیمه‌نامه فعلی شما اضافه خواهد شد.',
        hasIcon: true,
        size: AlertSizeEnum.Small,
        color: AlertColorEnum.Blue,
      },
      badge:
        'انقضا: ' + (this.data()?.previousInsurance?.endsAt ? convertToPersianDate(this.data()?.previousInsurance?.endsAt) : this.nullData),
      badgeStatus: BadgeStatusEnum.Info,
      descriptions: [
        {
          type: 'text',
          title: 'تخفیف ثالث',
          value: this.data()?.previousInsurance?.thirdPartyDiscount?.title
            ? this.getTitleDiscountItem(this.data()?.previousInsurance?.thirdPartyDiscount?.title)
            : this.nullData,
        },
        {
          type: 'text',
          title: 'تخفیف حوادث راننده',
          value: this.data()?.previousInsurance?.driverDiscount?.title
            ? this.getTitleDiscountItem(this.data()?.previousInsurance?.driverDiscount?.title)
            : this.nullData,
        },
      ],
      details: [
        {
          type: 'text',
          title: 'تاریخ شروع',
          value: this.data()?.previousInsurance?.startsAt ? convertToPersianDate(this.data()?.previousInsurance?.startsAt) : this.nullData,
        },
        {
          type: 'text',
          title: 'تاریخ انقضا',
          value: this.data()?.previousInsurance?.endsAt ? convertToPersianDate(this.data()?.previousInsurance?.endsAt) : this.nullData,
        },
        {
          type: 'text',
          title: 'وضعیت مالکیت',
          value:
            this.data()?.vehicleInfo?.ownershipChanged !== null
              ? this.data()?.vehicleInfo?.ownershipChanged
                ? 'تغییر مالکیت داشته است'
                : 'تغییر مالکیت نداشته است'
              : this.nullData,
          ellipsis: true,
        },
        {
          type: 'text',
          title: 'تعداد خسارت مالی',
          value: this.data()?.previousInsurance?.propertyDamage?.title ?? this.nullData,
          ellipsis: true,
        },
        {
          type: 'text',
          title: 'تعداد خسارت جانی',
          value: this.data()?.previousInsurance?.healthDamage?.title ?? this.nullData,
          ellipsis: true,
        },
        {
          type: 'text',
          title: 'تعداد خسارت حوادث راننده',
          value: this.data()?.previousInsurance?.driverDamage?.title ?? this.nullData,
          ellipsis: true,
        },
      ],
    },
  }));

  ngOnInit(): void {
    this.initStoreData();
    this.getData();
  }

  getData(): void {
    super.addSubscription(
      this.storeService.getStoreDataAsObservable().subscribe({
        next: (data) => {
          if (!data) {
            return;
          }
          if (this.activatedRoute.snapshot.fragment?.includes('edit')) {
            this.invalidData = true;
            this.handleEditClick();
          }

          this.data.set(data);
        },
      }),
    );
  }

  handleActiveButtonClicked(): void {
    if (this.invalidData) {
      this.messageService.showErrorMessage('لطفا از طریق بخش ویرایش اطلاعات خودرو خود را تکمیل کنید.', 'vehicle-message');
      return;
    }
    this.sharedService.navigate(ThirdPartyUrlsEnum.PriceCardList, null, InsuranceProductTypeEnum.ThirdParty);
  }

  handleDeActiveButtonClicked(): void {
    this.queryParamService.deleteQueryParams([QueryParamKeysEnum.JourneyType]).then(() => {
      this.location.back();
    });
  }

  handleEditClick(isNullState = true): void {
    this.router
      .navigate([], {
        fragment: isNullState ? null : 'popup',
        replaceUrl: isNullState,
        queryParams: this.activatedRoute.snapshot.queryParams,
      })
      .then(() => {
        const dialogRef = this.modalService.open(
          BottomSheetBoxComponent,
          {
            component: PlpEditInformationComponent,
            name: 'PlpEditInformationModal',
            title: 'ویرایش اطلاعات',
            data: { activeTab: this.selectActiveTab() },
          },
          true,
        );

        super.addSubscription(
          dialogRef.afterClosed().subscribe((res) => {
            if (this.activatedRoute.snapshot.fragment === 'popup') {
              this.router.navigate([], {
                fragment: null,
                queryParams: this.activatedRoute.snapshot.queryParams,
              });
            }
            if (res) {
              this.invalidData = false;
            }
            this.getData();
            this.metricService.sendMetric('CloseSanhabEditInformationModal', null, null);
          }),
        );
      });
  }

  private selectActiveTab(): number | null {
    if (this.activatedRoute.snapshot.fragment?.includes('edit')) {
      const fragment = this.activatedRoute.snapshot.fragment as EditSanhabModalEnum;
      return fragment === EditSanhabModalEnum.editCar ? 1 : fragment === EditSanhabModalEnum.editInsurer ? 2 : null;
    }
    return null;
  }

  private getTitleDiscountItem(title: string): string {
    return !isNaN(+title) ? title + ' درصد ' : title;
  }

  initStoreData(): void {
    this.storeService.loadUnauthorizedApplicationData();
  }
}

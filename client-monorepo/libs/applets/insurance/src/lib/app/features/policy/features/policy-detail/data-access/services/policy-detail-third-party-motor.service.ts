import { inject, Injectable } from '@angular/core';
import { PolicyDetailService } from './policy-detail.service';
import { PolicyApiService } from '../../../../../vehicle/data-access/services/third-party/policy-api.service';
import {
  ApplicationFormGetResponseModel
} from '../../../../../vehicle/data-access/models/application-form/application-form-get-response.model';
import { VEHICLE_POLICY_STATE_ENUM } from '../../../../data-access/enums/vehicle-policy-state.enum';
import { AlertColorEnum } from '../../../../../../data-access/enums/alert-color.enum';
import { SectionDetailItemModel } from '../../../../../../data-access/models/section-detail-item.model';
import { PurchaseTicketTypeEnum } from '../../../../../vehicle/data-access/enums/purchase-ticket-type.enum';
import moment from 'jalali-moment';
import { IconEnum } from '../../../../../../data-access/enums/icon.enum';
import {
  MotorPolicyResultModel
} from '../../../../../vehicle/features/third-party-motor/data-access/models/motor-policy-result-model';
import { PlateUtils } from '../../../../../vehicle/util/plate';
import { getVehicleBadgeStatus } from '../../../../../../util/policy.utils';
import { PaymentRequestTypeEnum } from '../../../../../vehicle/data-access/enums/payment-request-type.enum';
import {
  MotorApplicationFormPaymentService
} from '../../../../../vehicle/features/third-party-motor/data-access/services/motor-application-form-payment.service';
import { BottomSheetBoxComponent } from '../../../../../../components/bottom-sheet-box/bottom-sheet-box.component';
import {
  CarEndorsementsBottomSheetComponent
} from '../../components/car-endorsements-bottom-sheet/car-endorsements-bottom-sheet.component';
import { BottomSheetService } from '../../../../../../data-access/services/bottom-sheet.service';
import {
  PolicyEndorsementModel
} from '../../../../../vehicle/data-access/models/application-form/policy-endorsement.model';
import { SectionCardModel } from '../../../../../../data-access/models/section-card.model';
import { INSURANCE_APP_PREFIX } from '../../../../../../data-access/constants/insurance-app-prefix.constant';
import { InsuranceUrlsEnum } from '../../../../../../data-access/enums/insurance-urls.enum';

@Injectable({
  providedIn: 'root',
})
export class PolicyDetailThirdPartyMotorService extends PolicyDetailService {
  private apiService = inject(PolicyApiService);
  private motorApplicationFormPaymentService = inject(MotorApplicationFormPaymentService);
  private bottomSheetService = inject(BottomSheetService);

  private endorsements: PolicyEndorsementModel[] = [];
  private state: VEHICLE_POLICY_STATE_ENUM;

  getPolicyDetail(id: string): Promise<SectionCardModel[]> {
    return new Promise((resolve, reject) => {
      this.apiService.getMotorPolicyDetail(id).subscribe({
        next: (response) => {
          const data: ApplicationFormGetResponseModel = response.result as unknown as ApplicationFormGetResponseModel;
          this.state = data.state.displayState;
          this.id = data.applicationFormId;
          this.setUiRelatedProperties(data);
          resolve(this.createPolicyDetails(data));
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  setUiRelatedProperties(data: ApplicationFormGetResponseModel): void {
    switch (data.state.displayState) {
      case VEHICLE_POLICY_STATE_ENUM.REFUSED:
        this.activeButtonText = 'خرید مجدد';
        this.infoText =
          'به علت عدم تکمیل مدارک طی ۷۲ ساعت پس از پرداخت، فرآیند خرید شما لغو شد. مبلغ خرید ظرف ۴۸ ساعت به کیف پول شما باز خواهد گشت.';
        this.alertColor = AlertColorEnum.Red;
        break;
      case VEHICLE_POLICY_STATE_ENUM.CANCELLED:
        this.activeButtonText = 'خرید مجدد';
        break;
      case VEHICLE_POLICY_STATE_ENUM.ISSUING:
        this.infoText =
          'بعد از بررسی و تایید کارشناسان بیمه دیجی‌پی، بیمه شما صادر خواهد شد. پیشرفت در فرآیند صدور از طریق پیامک اطلاع رسانی خواهد شد.';
        break;
      case VEHICLE_POLICY_STATE_ENUM.ISSUED:
        this.activeButtonText = 'دانلود بیمه‌نامه';
        break;
      case VEHICLE_POLICY_STATE_ENUM.DOCUMENTS_CONFLICT_RESOLVE_PENDING:
        this.activeButtonText = 'بارگذاری مدارک';
        this.infoText =
          'کاربر گرامی، به دلیل ناقص بودن اطلاعات خوداظهاری وارد شده توسط شما و بررسی آن توسط کارشناس بیمه دیجی‌پی، برای صدور بیمه‌نامه نهایی خود، تا ۷۲ ساعت مهلت دارید تا نسب به  بارگذاری مجدد مدارک موتورسیکت  خود اقدام کنید. در غیر اینصورت بیمه‌نامه شخص ثالث شما از سوی شرکت بیمه‌گر ثبت نهایی و صادر نمی‌شود. و مبلغ پرداخت شده به حساب دیجی‌پی‌تان (کیف پول یا اعتبار) برگشت داده خواهد شد.';
        this.alertColor = AlertColorEnum.Red;
        break;
      case VEHICLE_POLICY_STATE_ENUM.PRICE_CONFLICT_RESOLVE_PENDING:
        this.activeButtonText = 'تایید و پرداخت';
        this.infoText = `به دلیل مغایرت اطلاعات اولیه با مدارک بارگذاری شده، مبلغ حق بیمه اصلاح شده است. لطفاً مبلغ مابه التفاوت را پرداخت کنید؛ در غیر این صورت فرآیند صدور بیمه نامه لغو و مبلغ قبلی به کیف پول دیجی پی شما بازگردانده می شود.`;
        this.alertColor = AlertColorEnum.Red;
        break;
      case VEHICLE_POLICY_STATE_ENUM.WAITING_FOR_ADDRESS_REGISTRATION:
        this.activeButtonText = 'ثبت آدرس';
        break;
      case VEHICLE_POLICY_STATE_ENUM.EXPIRING:
        this.activeButtonText = 'تمدید';
        break;
      default:
        this.activeButtonText = 'ادامه فرآیند';
        this.infoText = null;
        this.alertColor = AlertColorEnum.Blue;
        break;
    }
  }

  showMajorActionButton(): boolean {
    return this.state !== VEHICLE_POLICY_STATE_ENUM.ISSUING && this.state !== VEHICLE_POLICY_STATE_ENUM.VERIFY_ADDRESS_REGISTRATION;
  }

  getMajorActionButtonText(): string {
    return this.activeButtonText;
  }

  majorActionButtonHandler(): void {
    switch (this.state) {
      case VEHICLE_POLICY_STATE_ENUM.REFUSED:
      case VEHICLE_POLICY_STATE_ENUM.EXPIRING:
      case VEHICLE_POLICY_STATE_ENUM.CANCELLED:
        this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.VehicleThirdPartyMotor}`]);
        break;
      case VEHICLE_POLICY_STATE_ENUM.PRICE_CONFLICT_RESOLVE_PENDING:
        this.motorApplicationFormPaymentService.postPaymentRequest(this.id, PaymentRequestTypeEnum.CONFLICT);
        break;
      case VEHICLE_POLICY_STATE_ENUM.DOCUMENTS_CONFLICT_RESOLVE_PENDING:
        this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.VehicleThirdPartyMotor}/additional-upload-document`], {
          queryParamsHandling: 'preserve',
        });
        break;
      case VEHICLE_POLICY_STATE_ENUM.ISSUED:
        this.downloadPolicy(this.id);
        break;
      case VEHICLE_POLICY_STATE_ENUM.WAITING_FOR_ADDRESS_REGISTRATION:
      default:
        this.router
          .navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.VehicleThirdPartyMotor}/order-state`], {
            queryParamsHandling: 'preserve',
          })
          .then();
        break;
    }
  }

  downloadPolicy(uniqueCode: string | number): void {
    this.apiService.downloadPolicyThirdpartyMotor(uniqueCode as string).subscribe({
      next: (data) => {
        window.open(data.result.url, '_blank');
      },
    });
  }

  hasMoreActions(): boolean {
    return this.hasEndorsements();
  }

  moreActionsHandler(): void {
    this.bottomSheetService.open(
      BottomSheetBoxComponent,
      {
        component: CarEndorsementsBottomSheetComponent,
        name: 'car-endorsements-bottom-sheet',
        title: 'لیست الحاقیه ها',
        data: {
          applicationFormId: this.id,
          endorsements: this.endorsements,
        },
      },
      {
        fullPage: false,
        showHolderIcon: false,
        closeOnNavigation: false,
      },
    );
  }

  hasEndorsements(): boolean {
    return this.endorsements.length > 0;
  }

  hasPriceConflict(): boolean {
    return this.state === VEHICLE_POLICY_STATE_ENUM.PRICE_CONFLICT_RESOLVE_PENDING;
  }

  createPolicyDetails(data: ApplicationFormGetResponseModel): SectionCardModel[] {
    const details: SectionCardModel[] = [];
    if (data.previousInsuranceDetail?.insurerParty?.insurerPartyId) {
      details.push(this.getVehicleDetails(data), this.getVehiclePolicyDetail(data), this.getPreviousPolicyDetail(data));
    } else {
      details.push(this.getVehicleDetails(data), this.getVehiclePolicyDetail(data));
    }
    if (this.doesShowPaymentDetail()) {
      const cardDetails: SectionDetailItemModel[] = [
        {
          type: 'text',
          title: 'حق بیمه اولیه',
          value: this.transformPrice(data?.price?.providerPrice),
        },
        {
          type: 'text',
          title: 'مجموع تخفیفات',
          value: this.transformPrice(data?.price?.totalDiscountAmount),
          class: 'text-oninvert-error',
        },
        {
          type: 'text',
          title: 'مبلغ پرداخت شده',
          value: this.transformPrice(data?.price?.temporaryPrice),
          dashed: true,
        },
      ];
      if (data.price?.paymentMethod === PurchaseTicketTypeEnum.BNPL) {
        cardDetails.push(
          ...([
            {
              type: 'text',
              title: 'سهم پرداخت نقدی',
              value: this.transformPrice(data.price?.cashAmount),
            },
            {
              type: 'text',
              title: 'سهم پرداخت اعتباری',
              value: this.transformPrice(data.price?.creditAmount),
            },
          ] as SectionDetailItemModel[]),
        );
      }
      if (data.price?.priceConflictAmount > 0) {
        this.payable = data.price?.priceConflictAmount;
        cardDetails.push(
          ...([
            {
              type: 'text',
              title: 'مبلغ مابه‌التفاوت',
              value: this.transformPrice(data.price?.priceConflictAmount),
            },
          ] as SectionDetailItemModel[]),
        );
      }
      cardDetails.push({type: 'text', title: 'مبلغ نهایی', value: this.transformPrice(data?.price?.finalPrice)});
      details.push({
        title: 'اطلاعات پرداخت',
        card: {
          title: data.price?.paymentMethod === PurchaseTicketTypeEnum.BNPL ? 'اعتباری' : 'نقدی',
          subtitle: data.price?.paidAt ? moment(data.price.paidAt).locale('fa').format('YYYY/MM/DD') : this.nullDate,
          icon: data.price?.paymentMethod === PurchaseTicketTypeEnum.BNPL ? IconEnum.BnplCard : IconEnum.BankCard,
          expandable: true,
          details: cardDetails,
        },
      });
    }
    return details;
  }

  doesShowPaymentDetail(): boolean {
    return this.state !== VEHICLE_POLICY_STATE_ENUM.PENDING_PAYMENT;
  }

  getPreviousPolicyDetail(data: ApplicationFormGetResponseModel): SectionCardModel {
    return {
      title: 'جزئیات بیمه‌نامه قبلی',
      card: {
        title: data.previousInsuranceDetail?.insurerParty?.insurerPartyName ?? this.nullDate,
        subtitle: data.previousInsuranceDetail?.endsAt
          ? moment(data.previousInsuranceDetail?.endsAt).locale('fa').format('YYYY/MM/DD')
          : undefined,
        icon: data.previousInsuranceDetail?.insurerParty?.insurerPartyLogo ?? IconEnum.EmptyInsurance,
        expandable: true,
        details: [
          {
            type: 'text',
            title: 'تخفیف ثالث',
            value: data.previousInsuranceDetail?.thirdPartyDiscount
              ? data.previousInsuranceDetail?.thirdPartyDiscount === '0'
                ? 'نداشته است'
                : data.previousInsuranceDetail?.thirdPartyDiscount + ' درصد'
              : this.nullDate,
          },
          {
            type: 'text',
            title: 'تخفیف راننده',
            value: data.previousInsuranceDetail?.driverDiscount
              ? data.previousInsuranceDetail?.driverDiscount === '0'
                ? 'نداشته است'
                : data.previousInsuranceDetail?.driverDiscount + ' درصد'
              : this.nullDate,
          },
          {
            type: 'text',
            title: 'تغییر مالکیت',
            value:
              data.vehicleInfo?.vehicleOwnerChanged !== null
                ? data.vehicleInfo?.vehicleOwnerChanged
                  ? 'داشته است'
                  : 'نداشته است'
                : this.nullDate,
            ellipsis: true,
          },
          {
            type: 'text',
            title: 'تعداد خسارت مالی',
            value: data.previousInsuranceDetail?.propertyDamage ? data.previousInsuranceDetail?.propertyDamage : this.nullDate,
            ellipsis: true,
          },
          {
            type: 'text',
            title: 'تعداد خسارت جانی',
            value: data.previousInsuranceDetail?.healthDamage ? data.previousInsuranceDetail?.healthDamage : this.nullDate,
            ellipsis: true,
          },
          {
            type: 'text',
            title: 'تعداد خسارت حوادث راننده',
            value: data.previousInsuranceDetail?.driverDamage ? data.previousInsuranceDetail?.driverDamage : this.nullDate,
            ellipsis: true,
          },
        ],
      },
    };
  }

  getVehiclePolicyDetail(data: ApplicationFormGetResponseModel): SectionCardModel {
    return {
      title: 'اطلاعات بیمه‌نامه',
      card: {
        title: data.currentInsurerParty?.insurerPartyName ?? this.nullDate,
        subtitle: 'بیمه شخص ثالث',
        icon: data.currentInsurerParty?.insurerPartyLogo ?? IconEnum.EmptyInsurance,
        badge: data.state?.displayStateTitle ?? this.nullDate,
        badgeStatus: getVehicleBadgeStatus(data.state?.displayState),
        expandable: true,
        details: [
          {type: 'text', title: 'شماره سفارش', value: data.trackingCode},
          {
            title: 'سطح پوشش',
            value: this.transformPrice(+data.coverageRate),
            type: 'text',
          },
          {title: 'مدت اعتبار', type: 'text', value: data.duration ?? this.nullDate},
        ],
      },
    };
  }

  getVehicleDetails(data: ApplicationFormGetResponseModel | MotorPolicyResultModel): SectionCardModel {
    const motorData: MotorPolicyResultModel = data as MotorPolicyResultModel;
    return {
      title: 'مشخصات موتورسیکلت',
      card: {
        title: motorData.vehicleInfo?.type ?? this.nullDate,
        subtitle: motorData?.license ? PlateUtils.convertMotorToText(data.license) : undefined,
        icon: 'motor',
        expandable: true,
        details: [
          {
            type: 'text',
            title: 'سال ساخت',
            value: motorData.vehicleInfo?.buildYear?.toString() ?? this.nullDate,
          },
        ],
      },
    };
  }

  showMinorActionButton(): boolean {
    return false;
  }

  getMinorActionButtonText(): string {
    return null;
  }

  minorActionButtonHandler(): void {
  }
}

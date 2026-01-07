import { Injectable } from '@angular/core';
import { PolicyDetailService } from './policy-detail.service';
import { InsuranceProductTypeEnum } from '../../../../../../data-access/enums/Insurance-product-type.enum';
import {
  ApplicationFormGetResponseModel
} from '../../../../../vehicle/data-access/models/application-form/application-form-get-response.model';
import { SectionDetailItemModel } from '../../../../../../data-access/models/section-detail-item.model';
import { PurchaseTicketTypeEnum } from '../../../../../vehicle/data-access/enums/purchase-ticket-type.enum';
import moment from 'jalali-moment';
import { IconEnum } from '../../../../../../data-access/enums/icon.enum';
import {
  MotorPolicyResultModel
} from '../../../../../vehicle/features/third-party-motor/data-access/models/motor-policy-result-model';
import { PlateUtils } from '../../../../../vehicle/util/plate';
import { getVehicleBadgeStatus } from '../../../../../../util/policy.utils';
import { VEHICLE_BODY_POLICY_STATE_ENUM } from '../../../../data-access/enums/vehicle-body-policy-state.enum';
import { AlertColorEnum } from '../../../../../../data-access/enums/alert-color.enum';
import { SectionCardModel } from '../../../../../../data-access/models/section-card.model';
import { INSURANCE_APP_PREFIX } from '../../../../../../data-access/constants/insurance-app-prefix.constant';
import { InsuranceUrlsEnum } from '../../../../../../data-access/enums/insurance-urls.enum';

@Injectable({
  providedIn: 'root',
})
export class PolicyDetailBodyService extends PolicyDetailService {
  state: VEHICLE_BODY_POLICY_STATE_ENUM;
  guid: string;

  getPolicyDetail(id: string): Promise<SectionCardModel[]> {
    return new Promise((resolve, reject) => {
      this.policyApiService.getPolicyDetail(id, InsuranceProductTypeEnum.Body).subscribe({
        next: (response) => {
          const data: ApplicationFormGetResponseModel = response.result;
          this.id = id;
          this.guid = response.result.applicationFormId;
          this.setUiRelatedProperties(data);
          this.state = data.state.stateTitle as VEHICLE_BODY_POLICY_STATE_ENUM;
          resolve(this.createPolicyDetails(response.result));
        },
        error: (err) => {
          reject(err);
        },
      });
    });
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
    return this.state !== VEHICLE_BODY_POLICY_STATE_ENUM.INQUIRY;
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
        subtitle: 'بیمه بدنه',
        icon: data.currentInsurerParty?.insurerPartyLogo ?? IconEnum.EmptyInsurance,
        badge: data.state?.displayStateTitle ?? this.nullDate,
        badgeStatus: getVehicleBadgeStatus(data.state?.displayState),
        expandable: true,
        details: [
          {type: 'text', title: 'شماره سفارش', value: this.id},
          {title: 'مدت اعتبار', type: 'text', value: data.duration ?? this.nullDate},
        ],
      },
    };
  }

  getVehicleDetails(data: ApplicationFormGetResponseModel | MotorPolicyResultModel): SectionCardModel {
    const bodyData: ApplicationFormGetResponseModel = data as ApplicationFormGetResponseModel;
    return {
      title: 'مشخصات خودرو',
      card: {
        title: bodyData.vehicleInfo?.carModel ?? this.nullDate,
        subtitle: bodyData?.license ? PlateUtils.convertCarToText(data.license) : undefined,
        icon: bodyData.vehicleInfo?.carBrandLogo ? 'car-' + bodyData.vehicleInfo?.carBrandLogo : IconEnum.DefaultCar,
        expandable: true,
        details: [
          {
            type: 'text',
            title: 'تیپ',
            value: bodyData.vehicleInfo?.carModel ?? this.nullDate,
            ellipsis: true,
          },
          {
            type: 'text',
            title: 'سال ساخت',
            value: bodyData.vehicleInfo?.carBuildYear?.toString() ?? this.nullDate,
          },
          {type: 'text', title: 'ارزش خودرو', value: bodyData.vehicleInfo?.propertyValue ?? this.nullDate},
        ],
      },
    };
  }

  showMajorActionButton(): boolean {
    switch (this.state.toString().toLowerCase()) {
      case VEHICLE_BODY_POLICY_STATE_ENUM.DEBTOR:
      case VEHICLE_BODY_POLICY_STATE_ENUM.DOCUMENTDEFECT:
      case VEHICLE_BODY_POLICY_STATE_ENUM.INQUIRY:
      case VEHICLE_BODY_POLICY_STATE_ENUM.VISITDOCUMENTDEFECT:
      case VEHICLE_BODY_POLICY_STATE_ENUM.ISSUED:
      case VEHICLE_BODY_POLICY_STATE_ENUM.WAITINGFORADDRESSREGISTRATION:
      case VEHICLE_BODY_POLICY_STATE_ENUM.REVIEWADDRESS:
      case VEHICLE_BODY_POLICY_STATE_ENUM.REVIEWFAILEDADDRESS:
        return true;
      default:
        return false;
    }
  }

  getMajorActionButtonText(): string {
    return this.activeButtonText;
  }

  majorActionButtonHandler(): void {
    switch (this.state) {
      case VEHICLE_BODY_POLICY_STATE_ENUM.ISSUED:
        this.downloadPolicy(this.id);
        break;
      case VEHICLE_BODY_POLICY_STATE_ENUM.REVIEWFAILEDADDRESS:
      case VEHICLE_BODY_POLICY_STATE_ENUM.REVIEWADDRESS:
      case VEHICLE_BODY_POLICY_STATE_ENUM.REJECTED:
      case VEHICLE_BODY_POLICY_STATE_ENUM.CANCELED:
        break;
      default:
        this.router.navigate([`${INSURANCE_APP_PREFIX}/${InsuranceUrlsEnum.Body}`], {
          queryParams: {
            id: this.guid,
            state: this.state,
          },
        });
        break;
    }
  }

  hasMoreActions(): boolean {
    return false;
  }

  moreActionsHandler(): void {
  }

  hasPriceConflict(): boolean {
    return this.state === VEHICLE_BODY_POLICY_STATE_ENUM.DEBTOR;
  }

  downloadPolicy(uniqueCode: string | number): void {
    this.policyApiService.downloadPolicyBody(uniqueCode as number).subscribe({
      next: (data) => {
        window.open(data.result, '_blank');
      },
    });
  }

  setUiRelatedProperties(data: ApplicationFormGetResponseModel): void {
    switch (data.state.stateTitle) {
      case VEHICLE_BODY_POLICY_STATE_ENUM.REJECTED:
        this.infoText =
          'به علت عدم تکمیل مدارک طی ۷۲ ساعت پس از پرداخت، فرآیند خرید شما لغو شد. مبلغ خرید ظرف ۴۸ ساعت به کیف پول شما باز خواهد گشت.';
        this.alertColor = AlertColorEnum.Red;
        break;
      case VEHICLE_BODY_POLICY_STATE_ENUM.PENDING:
        this.infoText =
          'بعد از بررسی و تایید کارشناسان بیمه دیجی‌پی، بیمه شما صادر خواهد شد. پیشرفت در فرآیند صدور از طریق پیامک اطلاع رسانی خواهد شد.';
        break;
      case VEHICLE_BODY_POLICY_STATE_ENUM.DOCUMENTDEFECT:
        this.activeButtonText = 'بارگذاری مدارک';
        this.infoText =
          'کاربر گرامی، به دلیل ناقص بودن اطلاعات خوداظهاری وارد شده توسط شما و بررسی آن توسط کارشناس بیمه دیجی‌پی، برای صدور بیمه‌نامه نهایی خود، تا ۷۲ ساعت مهلت دارید تا نسب به  بارگذاری مجدد مدارک خودرو خود اقدام کنید. در غیر اینصورت بیمه‌نامه شخص ثالث شما از سوی شرکت بیمه‌گر ثبت نهایی و صادر نمی‌شود. و مبلغ پرداخت شده به حساب دیجی‌پی‌تان (کیف پول یا اعتبار) برگشت داده خواهد شد.';
        this.alertColor = AlertColorEnum.Red;
        break;
      case VEHICLE_BODY_POLICY_STATE_ENUM.DEBTOR:
        this.activeButtonText = 'تایید و پرداخت';
        this.infoText = `کاربر گرامی، به دلیل مغایرت اطلاعات خوداظهاری وارد شده توسط شما با اطلاعات اسناد بارگذاری شده، و بررسی آن توسط کارشناس بیمه دیجی‌پی، برای صدور بیمه‌نامه نهایی خود، تا ۷۲ ساعت مهلت دارید تا نسب به پرداخت مبلغ مابه‌التفاوت به دلیل مغایرت اطلاعات اولیه با مدارک بارگذاری شده، مبلغ حق بیمه اصلاح شده است. لطفاً مبلغ مابه التفاوت را پرداخت کنید؛ در غیر این صورت فرآیند صدور بیمه نامه لغو و مبلغ قبلی به کیف پول دیجی پی شما بازگردانده می شود.`;
        this.alertColor = AlertColorEnum.Red;
        break;
      case VEHICLE_BODY_POLICY_STATE_ENUM.WAITINGFORADDRESSREGISTRATION:
        this.activeButtonText = 'در انتظار ثبت آدرس';
        this.infoText = null;
        break;
      case VEHICLE_BODY_POLICY_STATE_ENUM.ISSUED:
        this.activeButtonText = 'دانلود بیمه‌نامه';
        this.infoText = null;
        break;
      default:
        this.activeButtonText = 'ادامه فرآیند';
        this.infoText = null;
        this.alertColor = AlertColorEnum.Blue;
        break;
    }
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

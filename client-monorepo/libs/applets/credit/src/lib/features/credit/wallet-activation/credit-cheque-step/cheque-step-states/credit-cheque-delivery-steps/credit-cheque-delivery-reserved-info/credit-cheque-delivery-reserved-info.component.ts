import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditAppBarComponent } from '../../../../../components/credit-app-bar/credit-app-bar.component';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import {
  ChequeDeliveryData,
  ChequeStepDeliveryMethod,
  ChequeStepDeliveryReservedDetails,
  TranslateDeliveryMethod,
} from '../../../../../data-access/models/credit/activation/cheque-step/cheque-step-delivery.model';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { JalaliDatePipe } from '@digipay/ng-lib-pipes';
import { ChequeStatus } from '../../../../../data-access/models/credit/activation/cheque-step/cheque-status-response';
import { CreditChequeStepService } from '../../../services/credit-cheque-step.service';
import { CreditPageLoadingComponent } from '../../../../../components/credit-page-loading/credit-page-loading.component';

@Component({
  selector: 'app-credit-cheque-delivery-reserved-info',
  templateUrl: './credit-cheque-delivery-reserved-info.component.html',
  styleUrls: ['./credit-cheque-delivery-reserved-info.component.scss'],
  standalone: true,
  imports: [NgxBadgeModule, NgxStatusResultModule, CreditAppBarComponent, NgxDividerComponent, CreditPageLoadingComponent],
  providers: [JalaliDatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeDeliveryReservedInfoComponent {
  translateDeliveryMethod = TranslateDeliveryMethod;

  address = ' تهران، صندوق پستی: ۱۹۳۹۵۳۱۹۹ ،شرکت نوآوران پرداخت مجازی ایرانیان';

  chequeStatus = input<ChequeStatus>();

  chequeDeliveryData = input<ChequeDeliveryData>();

  showLoading = signal(false);

  close = output();
  backToFirstStep = output();

  private jalaliDatePipe = inject(JalaliDatePipe);
  private creditChequeStepService = inject(CreditChequeStepService);

  selectedDeliveryInfo = computed(() => this.creditChequeStepService.chequeStepDeliveryReserveInfo());
  statusType = computed(() => (this.chequeStatus() === ChequeStatus.PHYSICS_DELIVERY_RESERVED ? 'Status' : 'Waiting'));
  deliveryMethod = computed(() => this.creditChequeStepService.selectedChequeDeliveryMethod() || this.chequeDeliveryData()?.deliveryMethod);
  deliveryInfo = computed(() => {
    if (this.selectedDeliveryInfo()) {
      return {
        deliveryDate: this.selectedDeliveryInfo()?.selectedDate?.date,
        fromTime: this.selectedDeliveryInfo()?.selectedTime?.fromTime,
        toTime: this.selectedDeliveryInfo()?.selectedTime?.toTime,
        deliveryMethod: this.deliveryMethod(),
        branchName: this.selectedDeliveryInfo()?.selectedProvider?.deliveryProviderName,
        address:
          this.deliveryMethod() === ChequeStepDeliveryMethod.IN_PERSON
            ? this.selectedDeliveryInfo()?.selectedProvider?.deliveryProviderAddress.fullAddress
            : [
                this.selectedDeliveryInfo()?.pickupAddress?.provinceName,
                this.selectedDeliveryInfo()?.pickupAddress?.cityName,
                this.selectedDeliveryInfo()?.pickupAddress?.address,
                'واحد ' + this.selectedDeliveryInfo()?.pickupAddress?.addressUnit,
                'پلاک ' + this.selectedDeliveryInfo()?.pickupAddress?.addressNo,
              ].join('، '),
      };
    } else {
      return this.chequeDeliveryData();
    }
  });

  title = computed(() => {
    if (this.chequeStatus() === ChequeStatus.PHYSICS_RECEIVED) {
      return 'چک شما دریافت شد';
    }
    return 'در انتظار دریافت چک شما هستیم';
  });
  description = computed(() => {
    if (this.chequeStatus() === ChequeStatus.PHYSICS_DELIVERY_RESERVED) {
      return 'لطفاً چک را در زمان و روشی که انتخاب کرده‌اید تحویل دهید. در صورت نیاز، می‌توانید اطلاعات را ویرایش کنید.';
    }
    if (this.chequeStatus() === ChequeStatus.PHYSICS_DELIVERY_HANDLED) {
      return 'بعد از دریافت و بررسی اصل چک توسط کارشناسان، نتیجه از طریق پیامک به شما اطلاع داده خواهد شد.';
    }
    if (this.chequeStatus() === ChequeStatus.PHYSICS_RECEIVED) {
      return 'بعد از بررسی اصل چک توسط کارشناسان،طی ۷۲ ساعت کاری آینده نتیجه از طریق پیامک به شما اطلاع داده خواهد شد.';
    }
    return '';
  });
  reservedInfoDetails = computed(() => {
    const detailsInfo: ChequeStepDeliveryReservedDetails[] = [
      {
        title: 'روش تحویل',
        badge: this.translateDeliveryMethod[this.deliveryMethod() || ChequeStepDeliveryMethod.POST],
      },
    ];
    if (this.deliveryMethod() === ChequeStepDeliveryMethod.POST) {
      detailsInfo.push({ title: 'آدرس پستی', description: this.address });
      return detailsInfo;
    }
    if (this.deliveryMethod() === ChequeStepDeliveryMethod.IN_PERSON) {
      detailsInfo.push({
        title: 'تاریخ',
        badge: this.jalaliDatePipe.transform(this.deliveryInfo()?.deliveryDate, 'jD jMMMM'),
      });
      detailsInfo.push({
        title: 'زمان',
        badge: this.deliveryInfo()?.fromTime + ' الی ' + this.deliveryInfo()?.toTime,
      });
      detailsInfo.push({
        title: 'شعبه',
        badge: this.deliveryInfo()?.branchName,
        description: this.deliveryInfo()?.address,
      });
      return detailsInfo;
    }
    if (this.deliveryMethod() === ChequeStepDeliveryMethod.COURIER) {
      detailsInfo.push({
        title: 'تاریخ',
        badge: this.jalaliDatePipe.transform(this.deliveryInfo()?.deliveryDate, 'jD jMMMM'),
      });
      detailsInfo.push({
        title: 'زمان',
        badge: this.deliveryInfo()?.fromTime + ' الی ' + this.deliveryInfo()?.toTime,
      });
      detailsInfo.push({
        title: 'آدرس',
        description: this.deliveryInfo()?.address,
      });
      return detailsInfo;
    }
    return detailsInfo;
  });
  buttons = computed<Buttons[]>(() => {
    if (this.chequeStatus() === ChequeStatus.PHYSICS_DELIVERY_RESERVED) {
      return [
        {
          id: 'creditChequeReservationEditButton',
          mode: 'form',
          style: 'tinted-on-elevated',
          label: 'ویرایش',
          fullWidth: true,
        },
        {
          id: 'creditChequeReservationConfirmButton',
          mode: 'form',
          style: 'fill',
          label: 'متوجه شدم',
          fullWidth: true,
        },
      ];
    }
    if (this.chequeStatus() === ChequeStatus.PHYSICS_DELIVERY_HANDLED || this.chequeStatus() === ChequeStatus.PHYSICS_RECEIVED) {
      return [
        {
          id: 'creditChequeReservationConfirmButton',
          mode: 'section',
          style: 'fill',
          label: 'متوجه شدم',
          fullWidth: false,
        },
      ];
    }
    return [];
  });

  onButtonClick(id: string) {
    if (id === 'creditChequeReservationEditButton') {
      this.creditChequeStepService.selectedChequeDeliveryMethod.set(undefined);
      this.backToFirstStep.emit();
    }
    if (id === 'creditChequeReservationConfirmButton') {
      this.close.emit();
    }
  }

  protected readonly BorderColorsEnum = BorderColorsEnum;
  protected readonly ChequeStatus = ChequeStatus;
}

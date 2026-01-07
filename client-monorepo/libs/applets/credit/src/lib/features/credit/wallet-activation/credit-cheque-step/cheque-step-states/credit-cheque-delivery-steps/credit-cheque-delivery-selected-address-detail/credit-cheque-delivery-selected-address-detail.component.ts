import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal, TemplateRef, viewChild } from '@angular/core';
import { NgxStateService } from '@digipay/ngx-status-result';
import { CreditAppBarComponent } from '../../../../../components/credit-app-bar/credit-app-bar.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditChequeAddOrSelectAddressBottomSheetComponent } from '../credit-cheque-add-or-select-address-bottomsheet/credit-cheque-add-or-select-address-bottom-sheet.component';
import { NgxAlert } from '@digipay/ngx-alert';
import { ChequeStepDeliveryMethod } from '../../../../../data-access/models/credit/activation/cheque-step/cheque-step-delivery.model';
import { CreditStepperComponent } from '../../../../../components/credit-stepper/credit-stepper.component';
import { CreditPersianDatePipe } from '../../../../../data-access/pipes/credit-persian-date.pipe';
import { CreditChequeStepService } from '../../../services/credit-cheque-step.service';
import { CreditChequeDeliveryDateTimePickerBottomSheetComponent } from '../credit-cheque-delivery-date-time-picker-bottomsheet/credit-cheque-delivery-date-time-picker-bottom-sheet.component';
import { CreditApiService } from '../../../../../data-access/services/credit-api.service';
import { MessageService } from '../../../../../data-access/services/message.service';

@Component({
  selector: 'app-credit-cheque-delivery-selected-address-detail',
  templateUrl: './credit-cheque-delivery-selected-address-detail.component.html',
  styleUrls: ['./credit-cheque-delivery-selected-address-detail.component.scss'],
  standalone: true,
  imports: [
    CreditAppBarComponent,
    NgxButtonComponent,
    NgxTrackableIdDirective,
    NgxIcon,
    NgxAlert,
    CreditStepperComponent,
    CreditPersianDatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeDeliverySelectedAddressDetailComponent {
  editTimeEnabled = input(true);
  creditId = input<string>();

  loading = signal(false);

  back = output();
  next = output();
  goToLocation = output();
  chequeHandled = output();
  goToCapacityError = output();

  private ngxStateService = inject(NgxStateService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private creditChequeStepService = inject(CreditChequeStepService);
  private creditApiService = inject(CreditApiService);
  private messageService = inject(MessageService);

  selectedDeliveryInfo = computed(() => this.creditChequeStepService.chequeStepDeliveryReserveInfo());
  chequeDeliveryMethod = computed(() => this.creditChequeStepService.selectedChequeDeliveryMethod());
  title = computed(() =>
    this.chequeDeliveryMethod() === ChequeStepDeliveryMethod.COURIER ? 'جزئیات مراجعه پیک دیجی‌پی' : 'جزئیات مراجعه به شعبه حضوری',
  );
  confirmBottomSheetTitle = computed(() =>
    this.chequeDeliveryMethod() === ChequeStepDeliveryMethod.COURIER
      ? 'آیا از انتخاب تحویل چک به پیک در آدرس انتخابی اطمینان دارید؟'
      : 'آیا از مراجعه حضوری به شعبه و زمان انتخاب‌ شده اطمینان دارید؟',
  );
  confirmBottomSheetHtmlContent = computed(() =>
    this.chequeDeliveryMethod() === ChequeStepDeliveryMethod.COURIER ? undefined : this.alertContent(),
  );

  pickupAddressUnitNo = computed(
    () =>
      'پلاک ' + this.selectedDeliveryInfo()?.pickupAddress?.addressNo + '، واحد ' + this.selectedDeliveryInfo()?.pickupAddress?.addressUnit,
  );
  pickupFullAddress = computed(() =>
    [
      this.selectedDeliveryInfo()?.pickupAddress?.cityName,
      this.selectedDeliveryInfo()?.pickupAddress?.provinceName,
      this.selectedDeliveryInfo()?.pickupAddress?.address,
    ].join(', '),
  );
  alertContent = viewChild<TemplateRef<any>>('alertContent');

  editLocation() {
    this.bottomSheetService.openBottomSheet(CreditChequeAddOrSelectAddressBottomSheetComponent, {}, { noPadding: true });
    const onCloseBottomSheet = this.bottomSheetService.onClose.subscribe({
      next: () => {
        onCloseBottomSheet.unsubscribe();
        const chosenOption = this.bottomSheetService.outputData();
        if (chosenOption === 'new') {
          this.creditChequeStepService.chequeStepDeliveryReserveInfo.update((info) => ({
            ...info,
            pickupAddress: {
              ...info!.pickupAddress!,
              addressNo: '',
              addressUnit: '',
              address: '',
              postalCode: '',
            },
          }));
          this.goToLocation.emit();
          return;
        }
        if (chosenOption === 'edit') {
          this.goToLocation.emit();
          return;
        }
      },
    });
  }

  editTime() {
    this.openTimePickerBottomSheet();
  }

  openTimePickerBottomSheet() {
    this.bottomSheetService.openBottomSheet(
      CreditChequeDeliveryDateTimePickerBottomSheetComponent,
      {
        dates: this.selectedDeliveryInfo()?.selectedProvider?.dates,
        pickupAddress: this.selectedDeliveryInfo()?.pickupAddress,
      },
      {
        noPadding: true,
      },
    );
    const onCloseBottomSheet = this.bottomSheetService.onClose.subscribe({
      next: () => {
        onCloseBottomSheet.unsubscribe();
        const selectedDeliveryDateTime = this.bottomSheetService.outputData();
        if (selectedDeliveryDateTime?.capacityError) {
          this.goToCapacityError.emit();
          return;
        }
        if (selectedDeliveryDateTime) {
          this.creditChequeStepService.setDeliveryDateAndTime(selectedDeliveryDateTime);
        }
      },
    });
  }

  onConfirm() {
    if (!this.selectedDeliveryInfo()?.selectedTime) {
      this.openTimePickerBottomSheet();
      return;
    }
    this.submitRequest();
  }
  submitRequest() {
    this.loading.set(true);
    this.ngxStateService.openBottomSheet(
      {
        title: this.confirmBottomSheetTitle(),
        description: 'در صورت نیاز، امکان ویرایش این اطلاعات در ادامه فرایند وجود دارد.',
        icon: 'question',
        type: 'Confirmation',
        htmlContent: this.confirmBottomSheetHtmlContent(),
        buttons: [
          {
            id: 'ok',
            style: 'tinted-on-elevated',
            label: 'بله',
            mode: 'form',
            fullWidth: true,
          },
          {
            id: 'cancel',
            style: 'fill',
            label: 'خیر',
            mode: 'form',
            fullWidth: true,
          },
        ],
      },
      { disableClose: true },
    );

    const onClose = this.ngxStateService.onClose().subscribe(() => {
      onClose.unsubscribe();
      const data = this.ngxStateService.outputData();
      if (data && data.clicked === 'ok') {
        if (this.chequeDeliveryMethod() === ChequeStepDeliveryMethod.IN_PERSON) {
          this.reserveDeliveryInPerson();
        }
        if (this.chequeDeliveryMethod() === ChequeStepDeliveryMethod.COURIER) {
          this.reserveDeliveryByCourier();
        }
      } else {
        this.loading.set(false);
      }
    });
  }

  showEditLimitationDialog() {
    this.ngxStateService.openBottomSheet(
      {
        title: 'امکان ویرایش وجود ندارد',
        description: 'مهلت ویرایش اطلاعات به پایان رسیده است. در صورت نیاز، لطفا با پشتیبانی تماس بگیرید.',
        icon: 'error',
        type: 'Status',
        buttons: [
          {
            id: 'ok',
            style: 'fill',
            label: 'متوجه شدم',
            mode: 'form',
            fullWidth: true,
          },
        ],
      },
      { disableClose: true },
    );

    const onClose = this.ngxStateService.onClose().subscribe({
      next: () => {
        onClose.unsubscribe();
        this.chequeHandled.emit();
      },
    });
  }

  reserveDeliveryInPerson() {
    const data = {
      cityId: this.creditChequeStepService.selectedDeliveryCityId()!,
      deliveryProviderId: this.selectedDeliveryInfo()!.selectedProvider!.deliveryProviderId,
      reserveDate: this.selectedDeliveryInfo()!.selectedDate!.date,
      timeSlotId: this.selectedDeliveryInfo()!.selectedTime!.id,
    };
    this.creditApiService.chequeDeliveryReserveInPerson(this.creditId()!, data).subscribe({
      next: () => {
        this.next.emit();
      },
      error: (error) => {
        this.handleReserveErrors(error);
      },
    });
  }
  reserveDeliveryByCourier() {
    const data = {
      cityId: this.selectedDeliveryInfo()!.pickupAddress!.cityId,
      streetAddress: this.selectedDeliveryInfo()!.pickupAddress!.address!,
      no: this.selectedDeliveryInfo()!.pickupAddress!.addressNo!,
      unit: this.selectedDeliveryInfo()!.pickupAddress!.addressUnit!,
      postalCode: this.selectedDeliveryInfo()!.pickupAddress!.postalCode!,
      reserveDate: this.selectedDeliveryInfo()!.selectedDate!.date,
      timeSlotId: this.selectedDeliveryInfo()!.selectedTime!.id,
    };
    this.creditApiService.chequeDeliveryReserveCourier(this.creditId()!, data).subscribe({
      next: () => {
        this.next.emit();
      },
      error: (error) => {
        this.handleReserveErrors(error);
      },
    });
  }

  handleReserveErrors(error: any) {
    this.loading.set(false);

    if (error.result.status === this.creditChequeStepService.CREDIT_ONB_PICK_UP_COLLATERAL_TIME_SLOT_IS_ALREADY_TAKEN) {
      this.messageService.showErrorMessageWithDescription('ظرفیت تکمیل شده', ' لطفا زمان یا روز دیگری را انتخاب کنید.');
      return;
    }
    if (error.result.status === this.creditChequeStepService.CREDIT_ONB_PICK_UP_METHOD_NOT_UPDATABLE) {
      this.showEditLimitationDialog();
      return;
    }
    this.messageService.showErrorOfErrorResponse(error);
  }
}

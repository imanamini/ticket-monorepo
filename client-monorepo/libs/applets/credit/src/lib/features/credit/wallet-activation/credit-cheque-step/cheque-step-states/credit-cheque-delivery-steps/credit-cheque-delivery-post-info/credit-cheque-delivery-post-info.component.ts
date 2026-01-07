import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { NgxStateService } from '@digipay/ngx-status-result';
import { CreditAppBarComponent } from '../../../../../components/credit-app-bar/credit-app-bar.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import Clipboard from '../../../../../data-access/utils/clipboard';
import { MessageService } from '../../../../../data-access/services/message.service';
import { NgxAlert } from '@digipay/ngx-alert';
import { CreditStepperComponent } from '../../../../../components/credit-stepper/credit-stepper.component';
import { CreditApiService } from '../../../../../data-access/services/credit-api.service';
import { CreditChequeStepService } from '../../../services/credit-cheque-step.service';

@Component({
  selector: 'app-credit-cheque-delivery-post-info',
  templateUrl: './credit-cheque-delivery-post-info.component.html',
  styleUrls: ['./credit-cheque-delivery-post-info.component.scss'],
  standalone: true,
  imports: [CreditAppBarComponent, NgxButtonComponent, NgxTrackableIdDirective, NgxAlert, CreditStepperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeDeliveryPostInfoComponent {
  address = ' تهران، صندوق پستی: ۱۹۳۹۵۳۱۹۹ ،شرکت نوآوران پرداخت مجازی ایرانیان';

  creditId = input<string>();

  loading = signal(false);

  back = output();
  next = output();
  chequeHandled = output();

  private ngxStateService = inject(NgxStateService);
  private messageService = inject(MessageService);
  private creditApiService = inject(CreditApiService);
  private chequeStepService = inject(CreditChequeStepService);

  copy() {
    Clipboard.copy(this.address);
    this.messageService.showSuccessMessage('کپی شد.');
  }

  confirm() {
    this.loading.set(true);
    if (this.chequeStepService.selectedCityDeliveryMethods().length === 1) {
      this.submitPostReservation();
      return;
    }
    this.ngxStateService.openBottomSheet(
      {
        title: 'آیا از انتخاب ارسال چک با پست اطمینان دارید؟',
        description: 'در صورت نیاز، امکان ویرایش این اطلاعات در ادامه فرایند وجود دارد.',
        icon: 'question',
        type: 'Confirmation',
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
        this.submitPostReservation();
      } else {
        this.loading.set(false);
      }
    });
  }

  submitPostReservation() {
    this.creditApiService.chequeDeliveryReservePost(this.creditId()!, this.chequeStepService.selectedDeliveryCityId()!).subscribe({
      next: () => {
        this.next.emit();
      },
      error: (error) => {
        this.loading.set(false);
        if (error.result.status === this.chequeStepService.CREDIT_ONB_PICK_UP_METHOD_NOT_UPDATABLE) {
          this.showEditLimitationDialog();
          return;
        }
        this.messageService.showErrorOfErrorResponse(error);
      },
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
}

import { ChangeDetectionStrategy, Component, effect, inject, input, model, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { convertNonEnglishDigits } from '@digipay/strings';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditActionHandlerService } from '../../../../data-access/utils/credit-action-handler.service';
import { ActionType } from '../../../../data-access/models/action-type';
import { RedirectionTypeEnum } from '../../../../data-access/models/redirection-type.enum';
import { NgxStateService } from '@digipay/ngx-status-result';
import { CreditScrollableViewComponent } from '../../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditStepperComponent } from '../../../../components/credit-stepper/credit-stepper.component';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-generate-digital-signature-national-card-receipt',
  templateUrl: './credit-generate-digital-signature-national-card-receipt.component.html',
  styleUrl: './credit-generate-digital-signature-national-card-receipt.component.scss',
  imports: [
    NgxSkeletonLoadingComponent,
    ReactiveFormsModule,
    NgxButtonComponent,
    CreditScrollableViewComponent,
    CreditStepperComponent,
    CreditAppBarComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignatureNationalCardReceiptComponent implements OnInit {
  hintMessage = 'کد رهگیری شامل ۱۰ رقم است';
  errorMessage = signal('');

  form!: FormGroup;
  back = output<void>();
  haveNationalCard = output<void>();
  trackingCode = output<string>();
  trackingCodeInput = model<string | null>();
  step = input<number>();
  totalSteps = input<number>();
  loading = input<boolean>(false);
  currentState = input<string>();
  private formBuilder = inject(FormBuilder);
  bottomSheetService = inject(NgxBottomSheetService);
  actionHandlerService = inject(CreditActionHandlerService);
  private ngxStateService = inject(NgxStateService);

  constructor() {
    effect(() => {
      if (this.currentState() === 'NATIONAL_CARD_RECEIPT') {
        this.scrollToForm();
      }
    });
  }

  ngOnInit() {
    if (isNaN(+this.trackingCodeInput()!)) {
      this.trackingCodeInput.set(null);
    }

    this.form = this.formBuilder.group({
      trackingCode: [this.trackingCodeInput(), [Validators.required, Validators.minLength(10)]],
    });

    this.form.controls['trackingCode'].valueChanges.subscribe({
      next: (value) => {
        this.onChangeSerialNumberInput(value);
      },
    });
  }

  onBack() {
    this.back.emit();
  }

  haveNationalCardFunc() {
    this.haveNationalCard.emit();
  }

  submit() {
    this.trackingCode.emit(this.form.controls['trackingCode'].value);
  }

  convertInputToNumber(value: string) {
    const val = convertNonEnglishDigits(value);
    return val.replace(/[^\d]/g, '');
  }

  onChangeSerialNumberInput(value: string) {
    this.errorMessage.set('');
    const val = this.convertInputToNumber(value);

    if (value !== val && this.form) {
      this.form.controls['trackingCode'].setValue(val, { emitEvent: false });
    }
    if (this.form.controls['trackingCode'].hasError('minlength')) {
      this.errorMessage.set('این قسمت از سریال باید 10 رقمی باشد.');
      return;
    }
  }

  openQueryBottomSheet() {
    this.ngxStateService.openBottomSheet(
      {
        title: 'استعلام وضعیت کارت ملی',
        description:
          'اگر برای کارت ملی هوشمند جدید اقدام کرده و کارت برای شما صادر شده باشد، نمی‌توانید با کد رهگیری مراحل ساخت امضا را ادامه دهید. برای اطلاع از وضعیت صدور کارت ملی خود، لطفاً از گزینه استعلام وضعیت استفاده کنید.',
        type: 'Status',
        icon: 'info',
        buttons: [
          {
            id: 'digitalSignatureQueryConfirmButton',
            style: 'fill',
            label: 'استعلام وضعیت',
            mode: 'form',
            fullWidth: true,
          },
          {
            id: 'digitalSignatureQueryCancelButton',
            style: 'tinted-on-elevated',
            label: 'نیاز ندارم',
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
      if (data && data.clicked === 'digitalSignatureQueryConfirmButton') {
        this.actionHandlerService.handle({
          type: ActionType.REDIRECT,
          payload: {
            type: RedirectionTypeEnum.blank,
            url: 'https://www.ncr.ir/idcard/tracking/trackWithTrackingId.xhtml',
          },
        });
      }
    });
  }

  scrollToForm() {
    const El = document.getElementById('form');
    if (El) {
      El.scrollIntoView({
        block: 'center',
        inline: 'nearest',
        behavior: 'smooth',
      });
    }
  }
}

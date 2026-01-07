import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordStepEnum } from '../../data-access/models/forgot-password-step.enum';
import { ShowError, UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { ForgotPasswordService } from '../../data-access/services/forgot-password.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { ForgotPasswordErrorEnum } from '../../data-access/models/forgot-password-error.enum';
import { INTRACK_EVENT_PHONE } from '../../data-access/consts/intrack-event';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'forgot-password-applet-phone',
  standalone: true,
  imports: [CommonModule, UiFormFieldBuilderModule, ReactiveFormsModule, NgxButtonComponent],
  templateUrl: './phone.component.html',
  styleUrl: './phone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneComponent implements OnInit {
  phoneNumberForm!: UntypedFormGroup;
  autoFocus = signal(false);
  fb = inject(UntypedFormBuilder);
  forgotPasswordService = inject(ForgotPasswordService);
  messageService = inject(MessageService);
  private eventService = inject(NgxEventTrackerService);
  errorMessageMapper = {
    cellNumber: 'شماره وارد شده اشتباه است.',
    mustPrePaid: 'شماره وارد شده پشتیبانی نمی‌شود.',
  };
  errorStatus: ShowError = 'auto';
  nextStep = output<ForgotPasswordStepEnum>();
  isSubmitting = signal(false);
  shouldNextStep = signal(false);
  defaultPhoneNumber = computed(() => {
    return this.forgotPasswordService?.defaultPhoneNumber();
  });

  ngOnInit(): void {
    this.forgotPasswordService.shouldNextStep.subscribe((shouldNextStep) => {
      this.shouldNextStep.set(shouldNextStep);
    });
    this.phoneNumberFormInit();
    this.autoFocusField();
    this.forgotPasswordService.setIntrackEvent(INTRACK_EVENT_PHONE);
  }

  private autoFocusField(): void {
    setTimeout(() => {
      this.autoFocus.set(true);
    }, 200);
  }

  phoneNumberFormInit() {
    this.phoneNumberForm = this.fb.group({
      cellNumber: [this.defaultPhoneNumber() || '', [Validators.required, NgxFormValidator.cellNumberValidator()]],
    });
  }

  onSubmitClick() {
    this.isSubmitting.set(true);
    if (this.shouldNextStep()) {
      this.nextStep.emit(ForgotPasswordStepEnum.OTP);
    } else {
      this.forgotPasswordService.sendOtpRequest(this.phoneNumberForm.controls['cellNumber'].value).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.handleGoToNextStep();
        },
        error: (error) => {
          this.isSubmitting.set(false);
          if (error.error.result.status === ForgotPasswordErrorEnum.OTP_DUPLICATE) {
            this.messageService.showInfoMessage('کد بازیابی ارسال شده همچنان معتبر است. لطفاً آن را مجددا وارد کنید.');
            this.handleGoToNextStep();
            return;
          }
          this.messageService.showErrorMessage(error.error.result.message);
        },
      });
    }
  }

  handleGoToNextStep(): void {
    this.forgotPasswordService.shouldNextStep.next(true);
    this.nextStep.emit(ForgotPasswordStepEnum.OTP);
    this.forgotPasswordService.updateForgotPassword({
      phone: this.phoneNumberForm.controls['cellNumber'].value,
    });
  }
}

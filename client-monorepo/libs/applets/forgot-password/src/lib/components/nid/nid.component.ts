import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowError, UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { OverlayManagerService } from '@client-monorepo/common/ui-components';
import { ForgotPasswordService } from '../../data-access/services/forgot-password.service';
import { ForgotPasswordApiService } from '../../data-access/services/forgot-password-api.service';
import { ForgotPasswordResetRequestModel } from '../../data-access/models/forgot-password-reset-request.model';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { MessageService, StorageService } from '@client-monorepo/common/utilities';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { ForgotPasswordErrorEnum } from '../../data-access/models/forgot-password-error.enum';
import { ForgotPasswordStepEnum } from '../../data-access/models/forgot-password-step.enum';
import { BlockComponent } from '../block/block.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { OtpComponent } from '../otp/otp.component';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { Subscription } from 'rxjs';
import { ForgotPasswordNavigationService } from '../../data-access/services/forgot-password-navigation.service';
import { AuthResponse } from '@client-monorepo/common/user';
import {
  INTRACK_EVENT_BLOCK,
  INTRACK_EVENT_NID,
  INTRACK_EVENT_NID_FAILURE,
  INTRACK_EVENT_NID_SUCCESS,
  INTRACK_EVENT_OTP_ERROR,
} from '../../data-access/consts/intrack-event';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'forgot-password-applet-nid',
  standalone: true,
  imports: [CommonModule, UiFormFieldBuilderModule, ReactiveFormsModule, NgxButtonComponent],
  templateUrl: './nid.component.html',
  styleUrl: './nid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NidComponent implements OnInit, OnDestroy {
  nationalIdForm!: FormGroup<{
    nationalId: FormControl;
  }>;
  nextStep = output<ForgotPasswordStepEnum>();
  overlayManagerService = inject(OverlayManagerService);
  FormBuilder = inject(FormBuilder);
  messageService = inject(MessageService);
  forgotPasswordApiService = inject(ForgotPasswordApiService);
  forgotPasswordService = inject(ForgotPasswordService);
  backHandler = inject(BackHandlerService);
  bottomSheetService = inject(NgxBottomSheetService);
  hybridService = inject(NgxHybridService);
  forgotPasswordNavigationService = inject(ForgotPasswordNavigationService);
  storageService = inject(StorageService);
  private ngxHybridService = inject(NgxHybridService);
  isSubmitting = signal(false);
  cellNumber = signal('');
  deviceId = signal('');
  nationalCode = signal('');
  otp = signal('');
  pin = signal('');
  hasServerError = signal(false);
  showError = signal<ShowError>('auto');
  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.nationalIdFormInit();
    this.provideForgotPasswordData();
    this.forgotPasswordService.setIntrackEvent(INTRACK_EVENT_NID);
    const formChangesSub = this.nationalIdForm.valueChanges.subscribe(() => {
      this.hasServerError.set(false);
    });
    this.subscriptions.push(formChangesSub);
  }

  nationalIdFormInit() {
    this.nationalIdForm = this.FormBuilder.group({
      nationalId: ['', [Validators.required, NgxFormValidator.nationalCodeValidator(), this.serverErrorValidator().bind(this)]],
    });
  }

  provideForgotPasswordData() {
    const forgotPasswordSub = this.forgotPasswordService.forgotPassword.subscribe((data) => {
      this.cellNumber.set(data?.phone ?? '');
      this.otp.set(data?.otp ?? '');
      this.pin.set(data?.pin ?? '');
      this.deviceId.set(data?.device?.deviceId ?? '');
    });
    this.subscriptions.push(forgotPasswordSub);
  }

  createPayload() {
    const payload: ForgotPasswordResetRequestModel = {
      cellNumber: this.cellNumber(),
      deviceId: this.deviceId(),
      nationalCode: this.nationalIdForm?.controls['nationalId'].value,
      otp: this.otp(),
      password: this.pin(),
    };
    return { ...payload };
  }

  serverErrorValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      return this.hasServerError() ? { serverError: true } : null;
    };
  }

  submitClicked() {
    this.createPayload();
    this.forgotPasswordApiService.resetPassword(this.createPayload()).subscribe({
      next: (response) => {
        this.forgotPasswordService.setIntrackEvent(INTRACK_EVENT_NID_SUCCESS);
        this.messageService.showSuccessMessage(response.result.message);
        this.storageService.updateAuth(response as AuthResponse);
        this.resetBiometric(this.createPayload().password);
        this.forgotPasswordNavigationService.exit('success');
      },
      error: (error) => {
        this.forgotPasswordService.setIntrackEvent(INTRACK_EVENT_NID_FAILURE);
        this.isSubmitting.set(false);
        this.handleError(error);
      },
    });
  }
  private resetBiometric(pin: string): void {
    if (this.storageService.hasBiometric()) {
      this.ngxHybridService.checkBiometricAvailability().then((result) => {
        if (result) {
          this.ngxHybridService.setPin(pin).then();
        }
      });
    }
  }

  handleError(error: any) {
    const { attemptsResetTime, remainingAttempts, result } = error.error;
    if (remainingAttempts === 0 && result?.status !== ForgotPasswordErrorEnum.BLOCK) {
      this.messageService.showErrorMessage(`آخرین فرصت: در صورت عدم تطابق، دسترسی
به حساب موقتا قطع می‌شود.`);
    }
    switch (result.status) {
      case ForgotPasswordErrorEnum.OTP:
        this.handleOtpError();
        break;
      case ForgotPasswordErrorEnum.NID:
        this.handleNidError();
        break;
      case ForgotPasswordErrorEnum.BLOCK: {
        this.handleBlockedStatus(attemptsResetTime);
        break;
      }
      default:
        this.messageService.showErrorMessage(result.message);
    }
  }

  handleOtpError(): void {
    this.forgotPasswordService.setIntrackEvent(INTRACK_EVENT_OTP_ERROR);
    this.messageService.showErrorMessage('کد احراز هویت وارد شده اشتباه می‌باشد. لطفا پس از بررسی مجددا وارد کنید.');
    this.bottomSheetService.openBottomSheet(OtpComponent, {
      errorMessage: 'کد احراز هویت وارد شده اشتباه می‌باشد. لطفا پس از بررسی مجددا وارد کنید.',
    });
    const otpBottomSheetSub = this.bottomSheetService.onClose.subscribe(() => {
      otpBottomSheetSub.unsubscribe();
      if (this.bottomSheetService.outputData()) {
        this.submitClicked();
      }
    });
  }

  handleNidError(): void {
    this.hasServerError.set(true);
    this.showError.set('show');
    this.nationalIdForm.get('nationalId')?.updateValueAndValidity();
    setTimeout(() => {
      this.showError.set('auto');
    }, 100);
  }

  handleBlockedStatus(attemptsResetTime: number) {
    const displayTime = attemptsResetTime >= 60 ? `${Math.ceil(attemptsResetTime / 60)} ساعت` : `${attemptsResetTime} دقیقه`;
    this.forgotPasswordService.setIntrackEvent(INTRACK_EVENT_BLOCK, displayTime);
    this.overlayManagerService.displayOverlay(BlockComponent, { attemptsResetTime: displayTime }, { type: 'error' }).then(() => {
      if (this.hybridService.isHybrid()) {
        this.hybridService.closeApp();
      } else {
        window.location.reload();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}

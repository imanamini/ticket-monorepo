import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Inject,
  input,
  model,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  signal,
  untracked,
} from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { convertNonEnglishDigits } from '@digipay/strings';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { MatInputModule } from '@angular/material/input';
import { FormDirectivesModule } from '@digipay/ng-form-directives';
import { Errors } from '../../../../../../api/digipay/models/errors.model';
import { MemoryCacheService } from '@digipay/ng-lib-memory-cache';
import { DialogBottomSheetService } from '../../../../../../core/services/dialog-bottom-sheet.service';
import { delay, interval, of, Subject, Subscription, takeUntil } from 'rxjs';
import { BaseHttpClient } from '../../../../../../api/base-http-client';
import { KybApiService } from '../../services/kyb-api.service';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ERROR } from '../../models/error.enum';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { DeviceService } from '../../../../../../core/services/device/device.service';
import { NgxOtpComponent } from '@digipay/ngx-otp';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-working-capital-kyb-otp',
  templateUrl: './working-capital-kyb-otp.component.html',
  standalone: true,
  imports: [
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    MatInputModule,
    NgIf,
    FormDirectivesModule,
    NgxButtonComponent,
    NgxOtpComponent,
    NgxIcon,
  ],
  styleUrls: ['./working-capital-kyb-otp.component.scss'],
})
export class WorkingCapitalKybOtpComponent implements OnInit, OnDestroy {
  form: UntypedFormGroup;

  isSubmitting = false;

  errors: Errors = { errors: {} };

  textFieldHasError = false;

  textFieldFocused = false;

  interval;

  progressValue = 0;

  // Step -> opt

  timeIsOver = false;
  minute = '02';
  second = '00';
  otpForm: UntypedFormGroup;
  userId: string;
  invalidOtpError = false;
  invalidOtpErrorMessage = '';
  trackingCode = '';
  subscription: Subscription;
  formData: any;
  cellNumber: any;

  otpCode = signal([]);
  length = input(5);
  OtpErrorText = computed(() => this.otpError() || '');
  otpStatus = computed<'default' | 'error'>(() => (this.otpError() ? 'error' : 'default'));
  otpError = model<string | null>(null);
  clearSignal = input(0);

  @Output() reTakeCode = new EventEmitter();

  private destroy$ = new Subject<void>();

  private api = inject(KybApiService);
  private messageService = inject(MessageService);
  private deviceService = inject(DeviceService);

  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiService: BaseHttpClient,
    private cache: MemoryCacheService,
    private dialog: DialogBottomSheetService,
    @Inject(PLATFORM_ID) public platformId: string,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: {
      trackingCode: any;
      formData: any;
      cellNumber: any;
    },
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public bottomSheetData: {
      trackingCode: any;
      formData: any;
      cellNumber: any;
    },
  ) {
    this.trackingCode = this.dialogData?.trackingCode ? this.dialogData.trackingCode : this.bottomSheetData.trackingCode;
    this.cellNumber = this.dialogData?.cellNumber ? this.dialogData.cellNumber : this.bottomSheetData.cellNumber;
    this.formData = this.dialogData?.formData ? this.dialogData.formData : this.bottomSheetData.formData;
    this.apiService.api = 'digipay';

    effect(() => {
      const clearSignalValue = this.clearSignal();
      const showOtpError = this.otpError();
      if (clearSignalValue) {
        untracked(() => {
          this.clearForm();
        });
      }
      if (showOtpError) {
        setTimeout(() => {
          this.clearForm();
        }, 3000);
      }
    });
  }

  ngOnInit(): void {
    this.clearOtp();
    this.startTimer();
  }

  clearOtp() {
    this.otpForm = this.formBuilder.group({
      otp1: ['', Validators.required],
      otp2: ['', Validators.required],
      otp3: ['', Validators.required],
      otp4: ['', Validators.required],
      otp5: ['', Validators.required],
    });
  }
  clearForm() {
    this.otpCode.set([]);
    this.otpError.set(null);
  }
  closeDialog(result?: object): void {
    this.dialog.close(result);
  }

  startProgress(): void {
    this.progressValue = 0;
    const progressInterval = interval(10);
    this.subscription = progressInterval.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.progressValue >= 100) {
        this.subscription?.unsubscribe();
        of('')
          .pipe(delay(1000), takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.closeDialog({ success: true });
            },
          });
      } else {
        this.progressValue++;
      }
    });
  }

  onSubmit() {
    this.isSubmitting = true;
    const obj = {
      otp: '',
    };
    this.invalidOtpError = false;

    obj.otp = this.otpCode().join('');

    obj.otp = convertNonEnglishDigits(obj.otp);

    this.api.submitICS(this.trackingCode, obj).subscribe({
      next: () => {
        this.cleanUpCacheData();
        this.startProgress();
      },
      error: (err) => {
        if (err.error.result.status === 1089) {
          this.invalidOtpError = true;
        }
        this.isSubmitting = false;
        this.invalidOtpErrorMessage = err.error.result.message;
        this.clearForm();
        // focus on the first input after entering
        // an incorrect value
      },
    });
  }

  checkTextFieldErrors() {
    const ctrl = this.form.controls['cellNumber'];
    let val = false;
    if (ctrl.hasError('pattern') && ctrl.touched) {
      val = true;
    }
    if (ctrl.hasError('cellNumber') && ctrl.touched && !this.textFieldFocused) {
      val = true;
    }
    this.textFieldHasError = val;
  }

  // State -> otp
  startTimer(): void {
    this.timeIsOver = false;
    this.minute = '02';
    this.second = '00';
    const timer = interval(1000);
    this.subscription = timer.pipe(takeUntil(this.destroy$)).subscribe((t) => {
      let m = +this.minute;
      let s = +this.second;
      if (s > 0) {
        --s;
      } else if (s === 0 && m > 0) {
        --m;
        s = 59;
      }
      this.minute = m < 10 ? '0' + m : m.toString();
      this.second = s < 10 ? '0' + s : s.toString();
      if (s === 0 && m === 0) {
        this.subscription?.unsubscribe();
        of('')
          .pipe(delay(1000), takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.timeIsOver = true;
            },
          });
      }
    });
  }

  receiveNewCode(): void {
    this.clearForm();
    this.startTimer();
    this.api.checkICS(this.formData).subscribe({
      next: (data: any) => {
        if (data.trackingCode) {
          this.trackingCode = data.trackingCode;
        }
      },
      error: (error) => {
        const waiting =
          error.error.result.status === ERROR.CREDIT_SCORE_ICS_NATIONAL_CODE_VALIDATION_COUNT_EXCEED ||
          error.error.result.status === ERROR.CREDIT_SCORE_EXISTS_IN_PROGRESS_ICS_SCORE;
        if (waiting) {
          this.closeDialog({ success: true });
        } else {
          this.messageService.showErrorOfErrorResponse(error.error);
        }
      },
    });
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    const value = clipboardData.getData('text');
    this.fillOTP(value);
    this.onSubmit();
  }

  onChange(value: string) {
    value = value.replace(/\D/g, '');
    this.fillOTP(value);
    if (this.isOTPAutoFilled(value)) {
      this.onSubmit();
    }
  }

  fillOTP(otp: string) {
    const seperated = otp.split('');
    if (seperated.length !== 5) {
      return;
    }
    this.otpForm.patchValue({
      otp1: seperated[0],
      otp2: seperated[1],
      otp3: seperated[2],
      otp4: seperated[3],
      otp5: seperated[4],
    });
  }

  isOTPAutoFilled(otp: string): boolean {
    return otp.length >= 5;
  }

  private cleanUpCacheData() {
    this.cache.clean();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscription?.unsubscribe();
  }
}

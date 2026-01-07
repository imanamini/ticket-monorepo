import { Component, computed, effect, inject, Inject, input, model, OnInit, signal, untracked } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Errors } from '../../../../api/digipay/models/errors.model';
import { ValidateCellNum } from '../../../../core/validators/cell-num.validator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseHttpClient } from '../../../../api/base-http-client';
import { Router } from '@angular/router';
import { MessageService } from '@client-monorepo/common/utilities';
import { MemoryCacheService } from '@digipay/ng-lib-memory-cache';
import { EnterPasswordService } from '../../../../ui/ui-components/enter-password/enter-password.service';
import { UserService } from '../../../../core/services/user.service';
import { convertNonEnglishDigits } from '@digipay/strings';
import { HttpHeaders } from '@angular/common/http';
import { FEATURE_NAMES, FEATURES } from '../../../../core/models/security.enum';
import { delay, interval, of } from 'rxjs';
import { DialogBottomSheetService } from '../../../../core/services/dialog-bottom-sheet.service';
import { DeviceService } from '../../../../core/services/device/device.service';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { MatButton } from '@angular/material/button';
import { EnterPasswordComponent } from '../../../../ui/ui-components/enter-password/enter-password.component';
import { FormDirectivesModule } from '@digipay/ng-form-directives';
import { FormFieldComponent } from '../../../../ui/ui-components/form-field-builder/form-field/form-field.component';
import { NgClass, NgIf, NgOptimizedImage } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { NgxOtpComponent } from '@digipay/ngx-otp';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxProgressBarComponent, ProgressBarTypeTranslator } from '@digipay/ngx-progress-bar';

@Component({
  selector: 'app-login-applet',
  templateUrl: './login-applet.component.html',
  styleUrls: ['./login-applet.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf,
    FormFieldComponent,
    FormDirectivesModule,
    EnterPasswordComponent,
    MatButton,
    UiButtonComponent,
    NgOptimizedImage,
    NgxIcon,
    NgxOtpComponent,
    NgxButtonComponent,
    NgxProgressBarComponent,
  ],
})
export class LoginAppletComponent implements OnInit {
  state: 'CELL-NUMBER' | 'GET-PASSWORD' | 'OTP' | 'RULES' | 'LOGIN-SUCCESS' = 'CELL-NUMBER';

  form: UntypedFormGroup;

  isSubmitting = false;

  errors: Errors = { errors: {} };

  textFieldHasError = false;

  textFieldFocused = false;

  interval;

  progressValue = 0;

  cellNumberValidationRules = [Validators.required, Validators.pattern(/^0/), ValidateCellNum];

  // Step -> opt

  timeIsOver = false;
  minute = '02';
  second = '00';
  otpForm: UntypedFormGroup;
  userId: string;
  cellNumber = '';
  invalidOtpError = false;
  invalidOtpErrorMessage = '';
  otpCode = signal([]);
  length = input(6);
  OtpErrorText = computed(() => this.otpError() || '');
  otpStatus = computed<'default' | 'error'>(() => (this.otpError() ? 'error' : 'default'));
  otpError = model<string | null>(null);
  clearSignal = input(0);

  private eventService = inject(NgxEventTrackerService);

  constructor(
    private ref: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      templateData: any;
      titleIcon: string;
    },
    private formBuilder: UntypedFormBuilder,
    private apiService: BaseHttpClient,
    private router: Router,
    private messageService: MessageService,
    private cache: MemoryCacheService,
    private enterPasswordService: EnterPasswordService,
    private userService: UserService,
    private dialog: DialogBottomSheetService,
    private deviceService: DeviceService,
  ) {
    this.clearCellNumber();
    this.clearOtp();
    this.form.valueChanges.subscribe((data) => {
      if (Number.isInteger(data.cellNumber)) {
        // convert integer values to string
        // (input[type=number] in angular!)
        let val = String(data.cellNumber);
        if (!val.match(/^0/)) {
          // prepend 0 if it is not already there
          val = '0' + val;
        }
        this.form.controls['cellNumber'].setValue(val, {
          emitEvent: false,
        });
        this.checkTextFieldErrors();
      } else {
        this.form.controls['cellNumber'].setValue(convertNonEnglishDigits(data.cellNumber), {
          emitEvent: false,
        });
        this.checkTextFieldErrors();
      }
    });
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
    this.form = this.formBuilder.group({
      cellNumber: ['', this.cellNumberValidationRules],
    });
  }

  clearForm() {
    this.otpCode.set([]);
    this.otpError.set(null);
  }

  clearCellNumber() {
    this.form = this.formBuilder.group({
      cellNumber: ['', this.cellNumberValidationRules],
    });
  }

  clearOtp() {
    this.otpForm = this.formBuilder.group({
      otp1: ['', Validators.required],
      otp2: ['', Validators.required],
      otp3: ['', Validators.required],
      otp4: ['', Validators.required],
      otp5: ['', Validators.required],
      otp6: ['', Validators.required],
    });
  }

  closeDialog(result?: object): void {
    if (this.state === 'RULES') {
      this.state = 'CELL-NUMBER';
    } else this.dialog.close(result);
  }

  editMobile() {
    this.state = 'CELL-NUMBER';
    this.isSubmitting = false;
    this.clearOtp();
  }

  onSubmit(state: string): Promise<void> {
    if (state === 'CELL-NUMBER') {
      return new Promise((resolve, reject) => {
        this.isSubmitting = true;
        this.errors = { errors: {} };

        const obj = this.form.value;
        obj.cellNumber = convertNonEnglishDigits(obj.cellNumber);
        obj.device = this.deviceService.getDeviceInformation();

        this.apiService.post('users/send-sms', obj).subscribe(
          (data) => {
            resolve();
            this.state = 'OTP';
            this.cellNumber = convertNonEnglishDigits(obj.cellNumber);
            this.startTimer();
            this.userId = data.userId;
          },
          (err) => {
            reject();
            if (err.error.result && err.error.result.message) {
              this.messageService.showErrorMessage(err.error.result.message);
            }
            this.isSubmitting = false;
          },
        );
      });
    } else if (state === 'OTP') {
      this.isSubmitting = true;
      const obj = {
        smsToken: '',
        userId: this.userId,
      };
      this.invalidOtpError = false;

      obj.smsToken = this.otpCode().join('');

      obj.smsToken = convertNonEnglishDigits(obj.smsToken);

      const headers = new HttpHeaders();
      // headers = headers.set('Authorization', BASIC_AUTH_HEADER);

      this.apiService.post('users/activate', obj, headers).subscribe(
        (data) => {
          this.cleanUpCacheData();
          if (data.hasPassword) {
            this.state = 'GET-PASSWORD';
            const LOGIN_FEATURE_CODE = FEATURES[FEATURE_NAMES.LOGIN_HOME];

            // close keyboard (iOS)
            // before showing the PIN inputs
            const doc = document as any;
            doc.activeElement.blur();

            const subscription = this.enterPasswordService
              .getUserPassword(data.userId, [LOGIN_FEATURE_CODE])
              .onLogin()
              .subscribe((login) => {
                if (login && this.enterPasswordService.isVerified(LOGIN_FEATURE_CODE)) {
                  this.enterPasswordService.hideGetPasswordWindow().clearData();
                  subscription.unsubscribe();
                  this.userService.afterLoginData.next({
                    url: this.router.url,
                    queryParams: {},
                  });
                  this.userService.clearAfterLoginData();
                  this.userService.afterLogin.next(true);
                  this.state = 'LOGIN-SUCCESS';
                  this.userService.currentUser().then((user) => {
                    this.eventService.loginIntrack(user.userId);
                  });
                  this.interval = setInterval(() => {
                    if (this.progressValue >= 100) {
                      clearInterval(this.interval);
                      of('')
                        .pipe(delay(1000))
                        .subscribe({
                          next: () => {
                            this.closeDialog({ success: true });
                          },
                        });
                    } else {
                      this.progressValue++;
                    }
                  }, 10);
                  of('')
                    .pipe(delay(1500))
                    .subscribe({
                      next: () => {
                        if (this.userService.redirectUrlAfterLogin) {
                          window.location.href = this.userService.redirectUrlAfterLogin;
                        } else {
                          window.location.reload();
                        }
                      },
                    });
                }
              });
          } else {
            this.userService.afterLoginData.next({
              url: this.router.url,
              queryParams: {},
            });
            this.userService.clearAfterLoginData();
            this.userService.setAuth(data);
            this.state = 'LOGIN-SUCCESS';
            this.userService.currentUser().then((user) => {
              this.eventService.loginIntrack(user.userId);
            });
            this.interval = setInterval(() => {
              if (this.progressValue >= 100) {
                clearInterval(this.interval);
                of('')
                  .pipe(delay(1000))
                  .subscribe({
                    next: () => {
                      this.closeDialog({ success: true });
                    },
                  });
              } else {
                this.progressValue++;
              }
            }, 10);
            of('')
              .pipe(delay(1500))
              .subscribe({
                next: () => {
                  if (this.userService.redirectUrlAfterLogin) {
                    window.location.href = this.userService.redirectUrlAfterLogin;
                  } else {
                    window.location.reload();
                  }
                },
              });
          }
        },
        (err) => {
          if (err.error.result.status === 1089) {
            this.invalidOtpError = true;
          }
          this.isSubmitting = false;
          this.invalidOtpErrorMessage = err.error.result.message;
          this.clearOtpInputs();
          // focus on the first input after entering
          // an incorrect value
          document.getElementById('otp1').focus();
        },
      );
    }
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
    const subscriber = timer.subscribe((t) => {
      let m = +this.minute;
      let s = +this.second;
      if (s > 0) {
        --s;
      } else if (s == 0 && m > 0) {
        --m;
        s = 59;
      }
      this.minute = '0' + m;
      this.second = s.toString().length < 2 ? '0' + s : s.toString();
      if (s == 0 && m == 0) {
        this.timeIsOver = true;
        subscriber.unsubscribe();
      }
    });
  }

  clearOtpInputs() {
    this.otpForm.controls['otp1'].setValue('');
    this.otpForm.controls['otp2'].setValue('');
    this.otpForm.controls['otp3'].setValue('');
    this.otpForm.controls['otp4'].setValue('');
    this.otpForm.controls['otp5'].setValue('');
    this.otpForm.controls['otp6'].setValue('');
  }

  receiveNewCode(): void {
    this.clearOtpInputs();
    this.startTimer();

    const obj = {
      userId: this.userId,
      device: this.deviceService.getDeviceInformation(),
      cellNumber: convertNonEnglishDigits(this.cellNumber),
    };
    this.apiService.post('users/send-sms', obj).subscribe(
      () => {},
      () => {
        this.isSubmitting = false;
      },
    );
  }

  nextInput(controlId: string, event: any): void {
    const currentId = event.currentTarget.id;
    const currentVal = event.currentTarget.value;
    this.invalidOtpErrorMessage = '';
    if (event.currentTarget.value.length > 0 && controlId != '' && controlId != 'submit') {
      const element = document.getElementById(controlId);
      element.focus();
    }
    if (event.key == 'Backspace') {
      const id = +currentId.charAt(currentId.length - 1);
      if (id > 1) {
        this.deviceService.closeIOsDeviceKeyboard().then((res) => {
          const targetId = id - 1;
          const elm = document.getElementById('otp' + targetId);
          elm.focus();
          if (currentVal === '') {
            // input is empty, and the user has pressed the backspace button
            // probably he/she wants to clear the previous input
            this.otpForm.controls['otp' + targetId].setValue('');
          }
        });
      }
    }
    if (controlId == 'submit' && event.keyCode != 8 && this.otpForm.valid) {
      this.onSubmit('OTP');
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    const value = clipboardData.getData('text');
    this.fillOTP(value);
    this.onSubmit('OTP');
  }

  onChange(value: string) {
    value = value.replace(/\D/g, '');
    this.fillOTP(value);
    if (this.isOTPAutoFilled(value)) {
      this.onSubmit('OTP');
    }
  }

  fillOTP(otp: string) {
    const seperated = otp.split('');
    if (seperated.length !== 6) {
      return;
    }
    this.otpForm.patchValue({
      otp1: seperated[0],
      otp2: seperated[1],
      otp3: seperated[2],
      otp4: seperated[3],
      otp5: seperated[4],
      otp6: seperated[5],
    });
  }

  isOTPAutoFilled(otp: string): boolean {
    return otp.length >= 6;
  }

  private cleanUpCacheData() {
    this.cache.clean();
  }

  protected readonly ProgressBarTypeTranslator = ProgressBarTypeTranslator;
}

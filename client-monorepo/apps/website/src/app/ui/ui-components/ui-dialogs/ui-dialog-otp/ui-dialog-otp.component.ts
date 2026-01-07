import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OtpDialogData } from './models/otp-dialog-data';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { OtpApiService } from '../../../../api/digipay/otp-api.service';
import { convertNonEnglishDigits } from '@digipay/strings';
import { OtpDialogResult } from './models/otp-dialog-result';
import { MessageService } from '@client-monorepo/common/utilities';
import { UiCountDownTextComponent } from '../../ui-time/ui-count-down-text/ui-count-down-text.component';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { UiFormHintComponent } from '../../ui-hint-text/ui-form-hint/ui-form-hint.component';
import { NgIf } from '@angular/common';
import { UiPinInputComponent } from '../../ui-pin-input/pin-input/ui-pin-input.component';
import { delay, of } from 'rxjs';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-ui-dialog-otp',
  templateUrl: './ui-dialog-otp.component.html',
  styleUrls: ['./ui-dialog-otp.component.scss'],
  standalone: true,
  imports: [UiPinInputComponent, NgIf, UiFormHintComponent, UiButtonComponent, UiCountDownTextComponent, NgxIcon],
})
export class UiDialogOtpComponent implements OnInit {
  form: UntypedFormGroup;

  reSendCountDown = 120;

  verifying = false;

  errorMessage = '';

  pinError = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: OtpDialogData,
    private formBuilder: UntypedFormBuilder,
    private otpApi: OtpApiService,
    private messageService: MessageService,
    private matDialog: MatDialogRef<UiDialogOtpComponent>,
  ) {
    this.form = this.formBuilder.group({
      token: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    this.sendOtp();
  }

  verifyOtp(): void {
    if (this.verifying) {
      return;
    }
    this.verifying = true;
    this.errorMessage = null;
    const token = convertNonEnglishDigits(this.form.value.token);
    this.otpApi.verifyOtpForFeature(token, this.data.features, this.data.ticket).subscribe(
      (response) => {
        this.verifying = false;
        this.matDialog.close({
          verified: true,
        } as OtpDialogResult);
      },
      (e) => {
        this.verifying = false;
        const m = this.messageService.getMessageIfHasAny(e);
        if (m) {
          this.errorMessage = m;
        }
        // enables the animation and clears the inputs
        this.pinError = true;
        of('')
          .pipe(delay(2000))
          .subscribe({
            next: () => {
              this.pinError = false;
            },
          });
      },
    );
  }

  sendOtp(): void {
    this.errorMessage = null;
    this.otpApi.sendOtpForVerification(this.data.ticket).subscribe(
      (response) => {},
      (e) => {
        const m = this.messageService.getMessageIfHasAny(e);
        if (m) {
          this.errorMessage = m;
        }
      },
    );
  }

  onDialogReject(): void {
    this.matDialog.close({
      verified: false,
    } as OtpDialogResult);
  }

  resend(): void {
    this.reSendCountDown = 120;
    this.sendOtp();
  }

  onTokenChange(value: string): void {
    this.form.setValue({
      token: value,
    });
  }
}

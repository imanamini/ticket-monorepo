import { NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxAlert } from '@digipay/ngx-alert';
import { ReturnApiService } from '../services/return-api.service';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxOtpComponent, NgxOtpStatus } from '@digipay/ngx-otp';

@Component({
  selector: 'app-otp-dialog',
  standalone: true,
  imports: [UiFormFieldBuilderModule, NgxButtonComponent, NgOptimizedImage, NgxAlert, NgxOtpComponent],
  templateUrl: './otp-dialog.component.html',
  styleUrl: './otp-dialog.component.scss',
})
export class OtpDialogComponent implements OnInit {
  leftTime: string;
  counter = 120;
  otp = [];
  otpErrorMessage;
  invalidToken = signal(false);
  loading = signal(false);
  disabled = signal(true);
  readonly data = inject<{ token: string }>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<OtpDialogComponent>);
  status: NgxOtpStatus = 'default';
  private readonly INVALID_TOKEN_ERROR_TITLE = 'LogisticErrors:00001';
  private api = inject(ReturnApiService);

  ngOnInit(): void {
    this.calculateRemainingTime();
    this.sendOtp();
  }

  sendOtp() {
    if (!this.data.token) {
      this.otpErrorMessage = 'توکن نامعتبر است!';
      this.status = 'error';
      throw new Error('Token is required!');
    }

    this.otpErrorMessage = '';
    this.status = 'default';

    this.api.sendOtp(this.data.token).subscribe({
      next: (res) => {
        this.startTimer();
        this.disabled.set(false);
      },
      error: (err) => {
        const { message, title } = err.error.result;
        this.otpErrorMessage = message;
        this.invalidToken.set(title === this.INVALID_TOKEN_ERROR_TITLE);
        this.status = 'error';
      },
    });
  }

  verifyOtp() {
    const otp = this.otp.join('');

    if (!otp) {
      this.status = 'error';
      throw new Error('Otp is required!');
    }

    this.loading.set(true);
    this.otpErrorMessage = '';
    this.status = 'default';

    this.api.verifyOtp(this.data.token, otp).subscribe({
      next: (verify) => {
        this.status = 'default';
        this.loading.set(false);
        this.dialogRef.close({ verify });
      },
      error: (err) => {
        this.otpErrorMessage = err.error.result.message;
        this.loading.set(false);
        this.status = 'error';
      },
    });
  }

  private startTimer() {
    this.counter = 120;
    const intervalId = setInterval(() => {
      this.counter = this.counter - 1;
      this.calculateRemainingTime();

      if (this.counter === 0) {
        clearInterval(intervalId);
      }
    }, 1000);
  }

  private calculateRemainingTime() {
    const minutes = Math.floor(this.counter / 60);
    const seconds = this.counter % 60;
    this.leftTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}

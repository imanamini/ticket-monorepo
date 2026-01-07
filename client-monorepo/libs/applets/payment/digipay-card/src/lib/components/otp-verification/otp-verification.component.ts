import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCountDownComponent } from '@digipay/ngx-count-down';
import { NgxOtpComponent } from '@digipay/ngx-otp';
import { OtpComponentProps } from '../../data-access/models/otp-component.interface';
@Component({
  selector: 'digipay-card-applet-otp-verification',
  standalone: true,
  imports: [CommonModule, NgxOtpComponent, NgxCountDownComponent, DpIconComponent, NgxButtonComponent],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpVerificationComponent implements OnInit {
  bottomSheetService = inject(NgxBottomSheetService);
  data: OtpComponentProps = { title: '', phoneNumber: '' };
  otpCode = signal([]);
  timeInSeconds = signal<number>(120);
  isTimerRunning = signal(true);
  otpStatus = signal<'default' | 'error'>('default');
  approveBtnDisabled = computed(() => this.otpCode().length !== 6);
  maskedPhoneNumber = signal('');

  ngOnInit(): void {
    this.data = this.bottomSheetService.data();
    this.maskPhoneNumber();
    this.initTimer();
  }

  initTimer(): void {
    const storedTimestamp = sessionStorage.getItem('otp_timestamp');
    if (storedTimestamp) {
      const startTime = parseInt(storedTimestamp, 10);
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
      const remainingTime = 120 - elapsedSeconds;

      if (remainingTime > 0) {
        this.timeInSeconds.set(remainingTime);
      } else {
        sessionStorage.removeItem('otp_timestamp');
      }
    }
  }

  maskPhoneNumber(): void {
    this.maskedPhoneNumber.set(this.data.phoneNumber.replace(/(\d{4})(\d{4})(\d{3})/, '$1****$3'));
  }

  onFinish() {
    this.isTimerRunning.set(false);
    sessionStorage.removeItem('otp_timestamp');
  }

  cancel() {
    this.bottomSheetService.outputData.set({ type: 'cancel' });
    this.bottomSheetService.closeBottomSheet();
  }

  approve() {
    const code = (this.otpCode() ?? []).join('');
    this.bottomSheetService.outputData.set({ type: 'submit', code });
    this.bottomSheetService.closeBottomSheet();
  }

  resendCode() {
    this.bottomSheetService.outputData.set({ type: 'resend' });
    sessionStorage.removeItem('otp_timestamp');
    this.bottomSheetService.closeBottomSheet();
  }
}

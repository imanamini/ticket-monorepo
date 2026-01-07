import { ChangeDetectionStrategy, Component, computed, effect, input, model, OnInit, output, signal, untracked } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { interval } from 'rxjs';
import { FormDirectivesModule } from '@digipay/ng-form-directives';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxOtpComponent } from '@digipay/ngx-otp';

@Component({
  selector: 'app-credit-in-page-otp',
  templateUrl: './credit-in-page-otp.component.html',
  styleUrls: ['./credit-in-page-otp.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormDirectivesModule, NgxButtonComponent, NgxCalloutComponent, NgxOtpComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditInPageOtpComponent implements OnInit {
  length = input(5);

  otpError = model<string | null>(null);

  otpStatus = computed<'default' | 'error'>(() => (this.otpError() ? 'error' : 'default'));

  OtpErrorText = computed(() => this.otpError() || '');

  width = computed(() => parseInt((100 / this.length()).toString()) + '%');

  cellNumber = input<string>();

  entered = output<string>();

  requestNewCode = output<void>();

  clearSignal = input(0);

  isSubmitting = input(false);

  showResend = input(true);

  countDown = input(60);

  newCodeBtnText = input('دریافت کد جدید');

  topDescription = input<string>();

  bottomDescription = input('کد تایید احراز هویت را وارد کنید');

  hideBottomDescription = input<boolean>();

  warningText = input<{
    title: string;
    message: string;
  }>();

  otpCode = signal([]);

  minute = signal('02');

  second = signal('00');

  timeIsOver = signal(false);

  constructor() {
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

  ngOnInit() {
    if (this.showResend()) {
      this.startTimer();
    }
  }

  startTimer(): void {
    this.timeIsOver.set(false);
    this.setTimeParams();
    const timer = interval(1000);
    const subscriber = timer.subscribe(() => {
      let m = +this.minute();
      let s = +this.second();
      if (s > 0) {
        --s;
      } else if (s === 0 && m > 0) {
        --m;
        s = 59;
      }
      this.minute.set('0' + m);
      this.second.set(s.toString().length < 2 ? '0' + s : s.toString());
      if (s === 0 && m === 0) {
        this.timeIsOver.set(true);
        subscriber.unsubscribe();
      }
    });
  }

  clearForm() {
    this.otpCode.set([]);
    this.otpError.set(null);
  }

  onSubmit() {
    this.entered.emit(this.otpCode().join(''));
  }

  receiveNewCode() {
    if (this.showResend()) {
      this.startTimer();
      this.requestNewCode.emit();
    }
  }

  private setTimeParams() {
    const m = Math.floor(this.countDown() / 60);
    const s = Math.floor(this.countDown() % 60);
    this.minute.set(m.toString().length < 2 ? '0' + m : m.toString());
    this.second.set(s.toString().length < 2 ? '0' + s : s.toString());
  }
}

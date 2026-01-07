import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { closeIOsDeviceKeyboard, MessageService } from '@client-monorepo/common/utilities';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { interval } from 'rxjs';
import { convertNonEnglishDigits } from '@digipay/strings';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { VerificationService } from '@client-monorepo/common/user';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'payment-applet-verification-otp',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, ReactiveFormsModule, NgxButtonComponent],
  templateUrl: './verification-otp.component.html',
  styleUrls: ['./verification-otp.component.scss'],
})
export class VerificationOtpComponent implements OnInit, AfterViewInit, OnDestroy {
  isSubmitting = false;
  otpForm: FormGroup;
  minute = '02';
  second = '00';
  timeIsOver = false;

  // STATE
  cellNumber = '';
  features!: Array<number>;
  invalidOtpError = false;

  reEnableSubmitTimeout!: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private verificationService: VerificationService,
    private bottomNavigationService: NgxBottomNavigationService,
  ) {
    const controls: Record<string, any> = {};
    for (let i = 1; i <= 6; i++) {
      controls['otp' + i] = ['', Validators.required];
    }
    // use FormBuilder to create a form group
    this.otpForm = this.fb.group(controls);
  }

  ngOnInit(): void {
    this.bottomNavigationService.hide();
    if (!this.verificationService.anyFlowInProgress()) {
      this.router.navigateByUrl('/hub').then();
      return;
    }

    this.cellNumber = this.verificationService.cellNumber;
    this.features = this.verificationService.features;

    this.startTimer();
  }

  ngAfterViewInit(): void {
    this.focusOnTheFirstInput();
  }

  ngOnDestroy(): void {
    if (this.reEnableSubmitTimeout) {
      clearTimeout(this.reEnableSubmitTimeout);
    }
  }

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

  receiveNewCode(): void {
    this.clearOtpInputs();

    this.verificationService.sendOtp().subscribe({
      next: () => {
        this.isSubmitting = false;
        this.startTimer();
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }

  nextInput(controlId: string, event: any): void {
    if (this.invalidOtpError) {
      this.invalidOtpError = false;
    }
    const currentId = event.currentTarget.id;
    const currentVal = event.currentTarget.value;
    if (event.currentTarget.value.length > 0 && controlId != '' && controlId != 'submit') {
      const element = document.getElementById(controlId);
      element?.focus();
    }
    if (event.key == 'Backspace') {
      const id = +currentId.charAt(currentId.length - 1);
      if (id > 1) {
        closeIOsDeviceKeyboard().then(() => {
          const targetId = id - 1;
          const elm = document.getElementById('otp' + targetId);
          elm?.focus();
          if (currentVal === '') {
            // input is empty and user has pressed the backspace button
            // probably he/she wants to clear the previous input
            this.otpForm.controls['otp' + targetId].setValue('');
          }
        });
      }
    }
    if (controlId == 'submit' && event.keyCode != 8 && this.otpForm.valid) {
      this.onSubmit();
    }
  }

  onSubmit(): void {
    this.isSubmitting = true;

    const token = convertNonEnglishDigits(Object.values(this.otpForm.value).join(''));

    this.verificationService
      .verifyOtp(token, this.features)
      .then(() => {
        this.reEnableSubmitTimeout = setTimeout(() => {
          // re-enable the button after 60 seconds
          this.isSubmitting = false;
        }, 60 * 1000);

        this.verificationService.verificationResult.next({
          verified: true,
        });
      })
      .catch((e) => {
        // Guard against undefined/null error properties
        if (e?.error?.result?.status === 1089) {
          this.invalidOtpError = true;
        } else {
          this.messageService.showErrorOfErrorResponse(e);
        }
        this.isSubmitting = false;
        this.clearOtpInputs();
        // focus on the first input after entering
        // an incorrect value
        this.focusOnTheFirstInput(0);
      });
  }

  focusOnTheFirstInput(timeOut = 200) {
    setTimeout(() => {
      if (document.getElementById('otp1')) {
        document.getElementById('otp1')?.focus();
      }
    }, timeOut);
  }

  clearOtpInputs() {
    for (let i = 1; i <= 6; i++) {
      this.otpForm.controls['otp' + i].setValue('');
    }
  }
}

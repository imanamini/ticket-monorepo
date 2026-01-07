import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { interval } from 'rxjs';
import { VerificationService } from '../../../data-access/services/verification.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { NgIf } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { UiPinInputComponent } from '../pin-input/ui-pin-input.component';
import { OtpVerifyResponse } from '../../../data-access/models/otp-verify-response.model';
import { WalletApiClient } from '../../../data-access/services/wallet-api-client.service';
import { UserCellNumberService } from '../../../data-access/services/user-cell-number.service';
import { PaymentResultInterface, WalletPayService } from '@client-monorepo/payment/purchase';

@Component({
  selector: 'cash-out-applet-enter-otp',
  templateUrl: './enter-otp.component.html',
  styleUrls: ['./enter-otp.component.scss'],
  standalone: true,
  imports: [PageLayoutComponent, UiFormFieldBuilderModule, NgIf, NgxButtonComponent, UiPinInputComponent, FormsModule],
})
export class EnterOtpComponent implements OnInit, OnDestroy {
  isSubmitting = false;
  minute = '02';
  second = '00';
  timeIsOver = false;
  code = signal('');
  features: Array<number> = [];
  invalidOtpError = false;
  reEnableSubmitTimeout!: any;

  constructor(
    private walletApiClient: WalletApiClient,
    private messageService: MessageService,
    private verificationService: VerificationService,
    public userCellNumberService: UserCellNumberService,
    private walletPayService: WalletPayService,
  ) {}

  ngOnInit(): void {
    this.features = this.verificationService.features;
    this.startTimer();
    this.userCellNumberService.get().catch((error) => this.messageService.showErrorOfErrorResponse(error));
  }

  onCodeChange(event: string) {
    this.code.set(event);
    if (event.length === 6) {
      this.onSubmit();
    }
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

    this.verificationService.sendOtp().subscribe(
      (data) => {
        this.isSubmitting = false;
        this.startTimer();
      },
      (e) => {
        this.isSubmitting = false;
        this.messageService.showErrorOfErrorResponse(e);
      },
    );
  }

  onSubmit(): void {
    this.isSubmitting = true;
    this.verificationService
      .verifyOtp(this.code(), [0])
      .then((data: OtpVerifyResponse) => {
        this.walletApiClient
          .payByWallet('wallets/transfer/pay/wallet', sessionStorage.getItem('TICKET') as string)
          .subscribe((result: PaymentResultInterface) => {
            this.walletPayService.goToPaymentResultPage(result);
            this.reEnableSubmitTimeout = setTimeout(() => {
              this.isSubmitting = false;
            }, 60 * 1000);
          });
      })
      .catch((e) => {
        if (e.error.result.status === 1089) {
          this.invalidOtpError = true;
        } else {
          this.messageService.showErrorOfErrorResponse(e);
        }
        this.isSubmitting = false;
        this.clearOtpInputs();
      })
      .finally(() => (this.isSubmitting = false));
  }

  clearOtpInputs() {
    this.code.set('');
  }
}

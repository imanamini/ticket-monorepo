import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IplService } from '../../services/ipl.service';
import { SendOtpResponse } from '../../../api/login/send-otp';
import { MessageService } from '../../../core/services/message.service';
import { OtpInvalidStatus } from '../../../api/login/otp-invalid-status';
import { TokenService } from '../../services/token/token.service';
import { IplPayService } from '../../services/ipl-pay/ipl-pay.service';
import { OtpLength } from '../../../shared/components/ui-pin-input/data-access/otp-length';

@Component({
  selector: 'ipl-otp-code',
  templateUrl: './ipl-otp-code.component.html',
  styleUrl: './ipl-otp-code.component.scss',
})
export class IplOtpCodeComponent implements OnInit {

  isReadonly = false;
  otpError = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    public iplService: IplService,
    private iplPayService: IplPayService,
    private tokenService: TokenService,
  ) {
  }

  ngOnInit() {
    if (!this.iplService.userInfo().cellNumber || !this.iplService.userInfo().userId) {
      this.backToCellNumber();
    }
  }

  backToCellNumber() {
    this.router.navigate(['../cell-number'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

  sendSms() {
    this.iplService.sendSms().subscribe(_ => {
    });
  }

  onPinChange(otp: string) {
    if (otp.length === OtpLength) {
      this.isReadonly = true;
      this.iplService.sendOtp(otp).subscribe({
        next: res => {
          this.handleOtpCodeResponse(res);
        },
        error: e => {
          this.handleOtpCodeError(e);
        }
      });
    }
  }

  private handleOtpCodeResponse(data: SendOtpResponse): void {
    this.isReadonly = false;

    if (data.hasPassword) {
      this.router.navigate(['../pin-code'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
    } else {
      this.tokenService.setToken(data.accessToken);
      this.iplPayService.pay();
    }
  }

  private handleOtpCodeError(error: any): void {
    if (error?.result?.status === OtpInvalidStatus) {
      this.otpError = true;
      setTimeout(() => {
        this.otpError = false;
        this.isReadonly = false;
      }, 1000);
    } else {
      this.isReadonly = false;
      this.messageService.showErrorIfExists(error);
    }
  }
}

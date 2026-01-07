import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IplService } from '../../services/ipl.service';
import { MessageService } from '../../../core/services/message.service';
import { PinInvalidStatus } from '../../../api/login/pin-invalid-status';
import { TokenService } from '../../services/token/token.service';
import { IplPayService } from '../../services/ipl-pay/ipl-pay.service';
import { EnterPasswordEnum, NgxPin } from '@digipay/ngx-pin';

@Component({
  selector: 'ipl-pin-code',
  templateUrl: './ipl-pin-code.component.html',
  styleUrl: './ipl-pin-code.component.scss',
})
export class IplPinCodeComponent implements OnInit {

  pendingRequest = false;
  password = '';
  enterPasswordState = EnterPasswordEnum.ENTER;
  hint = '';
  @ViewChild('pinComponent') pinComponent!: NgxPin;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public iplService: IplService,
    private iplPayService: IplPayService,
    private messageService: MessageService,
    private tokenService: TokenService,
  ) {
  }

  ngOnInit() {
    if (!this.iplService.userInfo().userId) {
      this.backToCellNumber();
    }
  }

  backToCellNumber() {
    this.router.navigate(['../cell-number'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

  pinCompletedHandler(pin: string) {
    this.password = pin;
    this.login();
  }

  private resetPin(): void {
    if (this.pinComponent) {
      this.pinComponent.resetPin();
    }
  }

  login() {
    this.pendingRequest = true;
    this.iplService.login(this.password).subscribe({
      next: res => {
        this.pendingRequest = false;
        this.enterPasswordState = EnterPasswordEnum.CORRECT;
        this.tokenService.setToken(res.accessToken);
        this.iplPayService.pay();
      },
      error: e => {
        this.pendingRequest = false;
        if (e?.result?.status === PinInvalidStatus) {
          this.enterPasswordState = EnterPasswordEnum.WRONG;
          this.hint = 'رمز عبور وارد شده اشتباه است، دوباره تلاش کنید';
        } else {
          this.messageService.showErrorIfExists(e);
        }

        setTimeout(() => {
          this.enterPasswordState = EnterPasswordEnum.ENTER;
          this.hint = '';
          this.password = '';
          this.resetPin();
        }, 1500);
      }
    });
  }
}

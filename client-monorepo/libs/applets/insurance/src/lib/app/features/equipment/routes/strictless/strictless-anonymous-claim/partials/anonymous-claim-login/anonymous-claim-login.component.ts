import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LayoutService } from '../../../../../../../data-access/services/layout.service';
import { ScreenSizeEnum } from '../../../../../enums/screen-size.enum';
import { LoginOtpComponent } from '../../../../../../auth/partials/login-otp/login-otp.component';

@Component({
  selector: 'anonymous-claim-login',
  templateUrl: './anonymous-claim-login.component.html',
  styleUrls: ['./anonymous-claim-login.component.scss'],
  imports: [
    LoginOtpComponent
  ],
  standalone: true
})
export class AnonymousClaimLoginComponent implements OnInit {

  @Input()
  userId: string;

  @Input()
  phoneNumber: string;

  @Output()
  resendSms = new EventEmitter();

  @Output()
  changeActionEvent = new EventEmitter();

  @Output()
  loggedIn = new EventEmitter();

  size: ScreenSizeEnum = ScreenSizeEnum.LG;

  constructor(
    private layout: LayoutService,
  ) {
  }

  ngOnInit(): void {
    this.layout.screenSizeChanged.subscribe(res => {
      this.size = res;
    });
  }

  changeAction(): void {
    this.changeActionEvent.emit();
  }

  resendOtpCode(): void {
    this.resendSms.emit();
  }
}

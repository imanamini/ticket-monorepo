import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { LayoutService } from '../../../../../../../data-access/services/layout.service';
import { AuthService } from '../../../../../../auth/service/auth.service';
import { LoginOtpComponent } from '../../../../../../auth/partials/login-otp/login-otp.component';
import { SharedUserSourceService } from '../../../../../../../data-access/services/user-services/shared-user-source.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { ScreenSizeEnum } from '../../../../../enums/screen-size.enum';

@Component({
  selector: 'otp-new-insurer',
  standalone: true,
  templateUrl: './otp-new-insurer.component.html',
  imports: [LoginOtpComponent],
  styleUrls: ['./otp-new-insurer.component.scss'],
})
export class OtpNewInsurerComponent implements OnInit {
  constructor() {}

  private layout = inject(LayoutService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private sharedUserSourceService = inject(SharedUserSourceService);

  @Input()
  phoneNumber = '';

  @Output()
  afterLoginAction = new EventEmitter();

  userId = '';

  size: ScreenSizeEnum = ScreenSizeEnum.LG;

  ngOnInit(): void {
    this.layout.screenSizeChanged.subscribe((res) => {
      this.size = res;
    });
    this.resendOtpCode().then();
  }

  async resendOtpCode(): Promise<void> {
    const device = await this.deviceService.getDeviceInfo();
    this.sharedUserSourceService.globalCellNumber.next(this.phoneNumber);
    this.authService.getOTP({ cellNumber: this.phoneNumber, device }).subscribe(
      (res) => {
        this.userId = res.userId;
        this.messageService.showInfoMessage('پیامک ارسال شده را در این قسمت وارد کنید');
      },
      (e) => {
        this.messageService.showErrorIfExists(e);
      },
    );
  }
}

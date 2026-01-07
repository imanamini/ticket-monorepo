import { Component } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { BaseHttpClient } from '../../../../api/base-http-client';
import { DialogBottomSheetService } from '../../../../core/services/dialog-bottom-sheet.service';
import { DeviceService } from '../../../../core/services/device/device.service';
import { WebViewService } from '../../../../core/services/web-view.service';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-ui-dialog-logout',
  templateUrl: './ui-dialog-logout.component.html',
  styleUrls: ['./ui-dialog-logout.component.scss'],
  standalone: true,
  imports: [UiButtonComponent, NgxIcon],
})
export class UiDialogLogoutComponent {
  constructor(
    private user: UserService,
    private dialogRef: DialogBottomSheetService,
    private apiService: BaseHttpClient,
    private deviceService: DeviceService,
    private webViewService: WebViewService,
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  logoutUser() {
    if (this.webViewService.isWebView()) {
      this.webViewService.close();
    } else {
      this.apiService
        .post('users/logout', {
          deviceId: this.deviceService.generateDeviceUid(),
        })
        .subscribe((result) => {
          this.user.logout(true);
        });
    }
  }
}

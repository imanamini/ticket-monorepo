import {Component, Inject, Input, PLATFORM_ID} from '@angular/core';
import {
  AppDownloadLink,
  DownloadSectionData
} from '../../../../api/clients/models/templates/download/download-data.response';
import {
  UiDialogDownloadCouponComponent
} from '../../ui-dialogs/ui-dialog-download-coupon/ui-dialog-download-coupon.component';
import {DialogBottomSheetService} from '../../../../core/services/dialog-bottom-sheet.service';
import {DeviceService} from '../../../../core/services/device/device.service';
import {UiButtonComponent} from '../../ui-button/ui-button/ui-button.component';
import {NgIf, NgStyle, NgFor, isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-ui-download-links',
  templateUrl: './ui-download-links.component.html',
  styleUrls: ['./ui-download-links.component.scss'],
  standalone: true,
  imports: [NgIf, NgStyle, UiButtonComponent, NgFor],
})
export class UiDownloadLinksComponent {
  @Input()
  downloadSectionData?: DownloadSectionData;

  constructor(
    private deviceService: DeviceService,
    @Inject(PLATFORM_ID) private platformId: string,
    private dialog: DialogBottomSheetService,
  ) {
  }

  openDownloadDialog(marketplace: AppDownloadLink) {
    if (marketplace.coupons && marketplace.coupons.code) {
      this.dialog.open(UiDialogDownloadCouponComponent, {
        templateData: marketplace,
      });
    } else {
      if (isPlatformBrowser(this.platformId)) {
        window.location.href = marketplace.address;
      }

    }
  }

  isIOsDevice() {
    if (isPlatformBrowser(this.platformId)) {
      return this.deviceService.isIOsDevice();
    }
    return false;
  }

  isAndroidDevice() {
    return this.deviceService.isAndroidDevice();
  }

  isDesktop() {
    return this.deviceService.isDesktop();
  }
}

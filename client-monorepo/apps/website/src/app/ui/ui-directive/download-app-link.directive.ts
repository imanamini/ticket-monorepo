import {Directive, HostListener, afterNextRender, PLATFORM_ID, Inject} from '@angular/core';
import {UiDialogDownloadComponent} from '../ui-components/ui-dialogs/ui-dialog-download/ui-dialog-download.component';
import {MatDialog} from '@angular/material/dialog';
import {DownloadLinkClient} from '../../api/clients/download-link-client';
import {DeviceService} from '../../core/services/device/device.service';
import {isPlatformBrowser} from "@angular/common";

@Directive({
  standalone: true,
  selector: '[appDownloadAppLink]',
})
export class DownloadAppLinkDirective {
  isBrowser = false;

  constructor(
    private matDialog: MatDialog,
    private downloadLinkClient: DownloadLinkClient,
    private deviceService: DeviceService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {
    afterNextRender(() => {
      this.isBrowser = true;
    });
  }

  @HostListener('click') onClick() {
    if (this.isBrowser) {
      if (this.deviceService.isDesktop() && isPlatformBrowser(this.platformId)) {
        window.location.href = '/download';
      } else {
        this.downloadLinkClient.getDownloadLinksData().subscribe((res) => {
          this.matDialog.open(UiDialogDownloadComponent, {
            width: '400px',
            data: {templateData: res.downloadApp},
          });
        });
      }
    }
  }
}

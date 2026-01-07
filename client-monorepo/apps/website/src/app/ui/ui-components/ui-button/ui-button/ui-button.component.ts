import {Component, EventEmitter, Inject, Input, Output, PLATFORM_ID} from '@angular/core';
import {DownloadLinkClient} from '../../../../api/clients/download-link-client';
import {MatDialog} from '@angular/material/dialog';
import {DownloadSectionData} from '../../../../api/clients/models/templates/download/download-data.response';
import {DeviceService} from '../../../../core/services/device/device.service';
import {RouterLink} from '@angular/router';
import {UiSpinnerComponent} from '../../ui-loading/ui-spinner/ui-spinner.component';
import {isPlatformBrowser, NgClass, NgIf, NgStyle, NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'app-ui-button',
  templateUrl: './ui-button.component.html',
  styleUrls: ['./ui-button.component.scss'],
  standalone: true,
  imports: [NgIf, NgClass, NgStyle, NgTemplateOutlet, UiSpinnerComponent, RouterLink],
})
export class UiButtonComponent {
  @Input()
  id: string | undefined;

  @Input()
  disabled = false;

  @Input()
  showSpinner = false;

  @Input()
  appearance:
    | 'DEFAULT'
    | 'SECONDARY'
    | 'SMALL-CTA'
    | 'GREEN'
    | 'OUTLINE-GREEN'
    | 'JUST-ICON'
    | 'YELLOW'
    | 'OUTLINE-YELLOW'
    | 'OUTLINE-BLUE'
    | 'OUTLINE-STEEL'
    | 'BLUE-TEXT'
    | 'GRAY-TEXT'
    | 'GREEN-TEXT'
    | 'RED-TEXT'
    | 'DARK-BLUE'
    | 'BORDER-SPACE'
    | 'FLAT-BLUE'
    | 'CUSTOM' = 'DEFAULT';

  @Input()
  size: 'EXTRA-SMALL' | 'SMALL' | 'MEDIUM' | 'BIG' = 'MEDIUM';

  @Input()
  classes = '';

  @Output()
  clicked = new EventEmitter();

  @Input()
  link = '';

  @Input()
  linkTarget: '_blank' | '_self' | '_parent' = '_self';

  @Input()
  useRouterLink = false;

  @Input()
  routerLinkQueryParams: any = {};

  @Input()
  color: string;

  @Input()
  backgroundColor: string;

  @Input()
  border: string;

  @Input()
  withoutHref = false;

  downloadApp: DownloadSectionData | undefined = undefined;

  constructor(
    private downloadLinkClient: DownloadLinkClient,
    private matDialog: MatDialog,
    private deviceService: DeviceService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {
  }

  onClick($event: any, link: any): void {
    if (this.link) {
      if (this.link?.includes('mydigipay.com/download')) {
        event.preventDefault();
        if (this.deviceService.isDesktop()) {
          if (isPlatformBrowser(this.platformId)) {
            window.location.href = this.link;
          }
        }
      }
    }

    this.clicked.emit($event);

    if (this.withoutHref) {
      if (isPlatformBrowser(this.platformId)) {
        window.location.href = link;
      }
    }
  }

  openDownloadDialog() {
    // this.downloadLinkClient.getDownloadLinksData().subscribe((res) => {
    //   this.downloadApp = res.downloadApp;
    //   this.matDialog.open(UiDialogDownloadComponent, {
    //     width: '400px',
    //     data: {
    //       templateData: this.downloadApp,
    //     },
    //   });
    // });
  }
}

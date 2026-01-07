import { Component, Input } from '@angular/core';
import { DownloadSectionData } from '../../../../api/clients/models/templates/download/download-data.response';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-download-app-links',
  templateUrl: './download-app-links.component.html',
  styleUrls: ['./download-app-links.component.scss'],
  standalone: true,
  imports: [NgIf, NgClass, NgFor],
})
export class DownloadAppLinksComponent {
  @Input()
  data?: DownloadSectionData;

  @Input()
  showCoupons = true;

  selectedTab = 'WEB';

  changeTab(tabName: string) {
    this.selectedTab = tabName;
  }

  copyToClipboard(item: any) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(item.couponCode).then(
        () => {
          item.copyText = 'کپی شد!';
          of('')
            .pipe(delay(2000))
            .subscribe({
              next: () => {
                item.copyText = 'کپی';
              },
            });
        },
        function (err) {
          console.error('Async: Could not copy text: ', err);
        },
      );
    }
  }
}

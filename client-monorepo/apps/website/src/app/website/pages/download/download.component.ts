import { Component, OnInit } from '@angular/core';
import { DownloadLinkClient } from '../../../api/clients/download-link-client';
import { DownloadSectionData } from '../../../api/clients/models/templates/download/download-data.response';
import { PageClient } from '../../../api/clients/page-client';
import { SeoService } from '../../services/seo.service';
import { DownloadLinkComponent } from './download-link/download-link.component';
import { DownloadIntroComponent } from './download-intro/download-intro.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
  standalone: true,
  imports: [BaseLayoutComponent, DownloadIntroComponent, DownloadLinkComponent],
})
export class DownloadComponent implements OnInit {
  downloadApp: DownloadSectionData | undefined = undefined;

  loaded = false;

  constructor(
    private downloadLinkClient: DownloadLinkClient,
    private pageClient: PageClient,
    private seo: SeoService,
  ) {}

  ngOnInit(): void {
    this.downloadLinkClient.getDownloadLinksData().subscribe((res) => {
      this.downloadApp = res.downloadApp;
    });
    this.pageClient.getPage('p', 'download').subscribe((res) => {
      this.seo.setGlobalMetaTagsFromPage(res.page);
    });
    of('')
      .pipe(delay(500))
      .subscribe({
        next: () => {
          this.loaded = true;
        },
      });
  }
}

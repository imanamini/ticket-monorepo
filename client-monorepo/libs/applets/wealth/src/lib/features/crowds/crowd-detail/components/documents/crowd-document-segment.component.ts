import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { DownloadService } from 'libs/applets/wealth/src/lib/shared/services/download-file.service';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { CrowdFundingModel, ICrowdDocument } from '../../../data-access/models';

@Component({
  selector: 'app-crowd-document-segment',
  templateUrl: './crowd-document-segment.component.html',
  styleUrls: ['./crowd-document-segment.component.scss'],
  standalone: true,
  imports: [NgxButtonComponent, NgxDividerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrowdDocumentSegmentComponent {
  private downloadService = inject(DownloadService);

  crowd = input<CrowdFundingModel>();

  protected readonly BorderColorsEnum = BorderColorsEnum;

  download(doc: ICrowdDocument) {
    doc['downloading'] = true;
    this.downloadService.downloadFile(doc.filePath, doc.title, doc);
  }
}

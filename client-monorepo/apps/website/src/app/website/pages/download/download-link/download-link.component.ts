import { Component, Input } from '@angular/core';
import { DownloadSectionData } from '../../../../api/clients/models/templates/download/download-data.response';
import { UiDownloadLinksComponent } from '../../../../ui/ui-components/ui-download/ui-download-links/ui-download-links.component';

@Component({
  selector: 'app-download-link',
  templateUrl: './download-link.component.html',
  styleUrls: ['./download-link.component.scss'],
  standalone: true,
  imports: [UiDownloadLinksComponent],
})
export class DownloadLinkComponent {
  @Input()
  downloadSectionData: DownloadSectionData;
}

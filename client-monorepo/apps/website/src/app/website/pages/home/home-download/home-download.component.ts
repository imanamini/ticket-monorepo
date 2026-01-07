import { Component, Input } from '@angular/core';
import { DownloadSectionData } from '../../../../api/clients/models/templates/download/download-data.response';
import { DownloadAppLinksComponent } from '../../../../ui/ui-components/ui-app-dl/download-app-links/download-app-links.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home-download',
  templateUrl: './home-download.component.html',
  styleUrls: ['./home-download.component.scss'],
  standalone: true,
  imports: [NgIf, DownloadAppLinksComponent],
})
export class HomeDownloadComponent {
  @Input()
  downloadSectionData?: DownloadSectionData;
}

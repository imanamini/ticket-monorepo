import { Component, Input } from '@angular/core';
import { DownloadSectionData } from '../../../../api/clients/models/templates/download/download-data.response';
import { NgOptimizedImage, NgIf } from '@angular/common';

@Component({
  selector: 'app-download-intro',
  templateUrl: './download-intro.component.html',
  styleUrls: ['./download-intro.component.scss'],
  standalone: true,
  imports: [NgOptimizedImage, NgIf],
})
export class DownloadIntroComponent {
  @Input()
  downloadSectionData?: DownloadSectionData;
}

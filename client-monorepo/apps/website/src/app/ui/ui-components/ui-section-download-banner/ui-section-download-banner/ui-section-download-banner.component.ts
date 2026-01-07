import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';
import { DownloadAppLinkDirective } from '../../../ui-directive/download-app-link.directive';

@Component({
  selector: 'app-ui-section-download-banner',
  templateUrl: './ui-section-download-banner.component.html',
  styleUrls: ['./ui-section-download-banner.component.scss'],
  standalone: true,
  imports: [NgStyle, DownloadAppLinkDirective],
})
export class UiSectionDownloadBannerComponent {
  @Input()
  backgroundColor = '#fff';
}

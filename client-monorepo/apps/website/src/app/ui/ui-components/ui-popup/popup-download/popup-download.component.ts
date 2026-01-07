import { Component, HostListener, Input, OnInit } from '@angular/core';
import { DownloadSectionData } from '../../../../api/clients/models/templates/download/download-data.response';
import { DownloadLinkClient } from '../../../../api/clients/download-link-client';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-popup-download',
  templateUrl: './popup-download.component.html',
  styleUrls: ['./popup-download.component.scss'],
  standalone: true,
  imports: [NgClass, NgFor, NgIf],
})
export class PopupDownloadComponent implements OnInit {
  downloadApp: DownloadSectionData | undefined = undefined;

  popupOpen = false;

  selectedPlatform = 'WEB';

  fixed = false;

  @Input()
  link = '';

  @Input()
  btnText = 'دریـــافــت اپلیکیشن';

  constructor(private downloadLinkClient: DownloadLinkClient) {}

  @HostListener('window:scroll', []) // for window scroll events
  onScroll() {
    const height = window.innerHeight;
    const scrollBottom = window.pageYOffset + height;

    this.fixed = scrollBottom > height + 50;
  }

  ngOnInit(): void {
    this.downloadLinkClient.getDownloadLinksData().subscribe((res) => {
      this.downloadApp = res.downloadApp;
    });
  }

  togglePopup() {
    this.popupOpen = !this.popupOpen;
  }

  selectPlatform(select: string) {
    this.selectedPlatform = select;
  }
}

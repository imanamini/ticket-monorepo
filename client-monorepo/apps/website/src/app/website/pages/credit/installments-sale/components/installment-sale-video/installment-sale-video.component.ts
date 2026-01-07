import { Component, ElementRef, HostListener, Inject, Input, PLATFORM_ID, ViewChild } from '@angular/core';
import { ApiFile } from '../../../../../../api/clients/models/common/api-file';
import { ButtonCta } from '../../../../../../ui/models/button-cta';
import { NgIf } from '@angular/common';
import { UiButtonComponent } from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiFlyButtonComponent } from '../../../../../../ui/ui-components/ui-fly-button/ui-fly-button.component';
import { UiIntroductionDefaultComponent } from '../../../../../../ui/ui-components/ui-introduction-default/ui-introduction-default/ui-introduction-default.component';

@Component({
  selector: 'app-installment-sale-video',
  templateUrl: './installment-sale-video.component.html',
  styleUrls: ['./installment-sale-video.component.scss'],
  standalone: true,
  imports: [UiIntroductionDefaultComponent, UiFlyButtonComponent, UiButtonComponent, NgIf],
})
export class InstallmentSaleVideoComponent {
  @Input() data: {
    type: string;
    artwork: ApiFile;
    videoCover: ApiFile;
    title: string;
    subtitle: string;
    subtitle2: string;
    firstCta: ButtonCta;
    secondCta: ButtonCta;
  };

  endFixedButton = false;
  startFixedButton: number;

  @ViewChild('videoPlayer') videoplayer: ElementRef | undefined;

  showCover = true;

  constructor(@Inject(PLATFORM_ID) public platformId: string) {}

  @HostListener('window:scroll', []) // for window scroll events
  onScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.startFixedButton = document.getElementById('section-video').offsetTop;
      const el = document.getElementsByClassName('section-credit-calculator-based-on-basket-amount')[0];
      const elPosition = el.getBoundingClientRect();
      this.endFixedButton = elPosition.top <= window.innerHeight && elPosition.bottom >= 0;
    }
  }

  toggleVideo() {
    if (this.videoplayer?.nativeElement?.paused) {
      this.videoplayer?.nativeElement.play();
      this.showCover = false;
    } else {
      this.videoplayer?.nativeElement.pause();
      this.showCover = true;
    }
  }
}

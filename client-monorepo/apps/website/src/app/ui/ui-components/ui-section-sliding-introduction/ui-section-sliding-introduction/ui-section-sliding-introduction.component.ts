import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { SlidingIntroduction } from '../../../../api/clients/models/templates/merchants-digikala/merchants-digikala-template-data';
import { ScreenSize } from '../../../../api/digipay/models/common/screen-size';
import { LayoutService } from '../../../../website/services/layout.service';
import { ApiFile } from '../../../../api/clients/models/common/api-file';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { NgIf, NgOptimizedImage, NgFor } from '@angular/common';
import { UiIconDirective } from '../../../ui-directive/ui-icon.directive';
import { SwiperDirective } from '../../../ui-directive/swiper.directive';

// SwiperCore.use([Navigation, Autoplay]);

@Component({
  selector: 'app-ui-section-sliding-introduction',
  templateUrl: './ui-section-sliding-introduction.component.html',
  styleUrls: ['./ui-section-sliding-introduction.component.scss'],
  standalone: true,
  imports: [NgIf, NgOptimizedImage, NgFor, UiIconDirective, SwiperDirective],
})
export class UiSectionSlidingIntroductionComponent implements OnInit {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  index = 0;
  @Input()
  data: SlidingIntroduction;

  @Input()
  scrollToElementId: string;

  banner: ApiFile;

  swiperArtworkConfig: SwiperOptions = {
    centeredSlides: true,
    slidesPerView: 1,
    allowTouchMove: false,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
  };

  constructor(private layout: LayoutService) {}

  ngOnInit(): void {
    this.setBanner();
  }

  setBanner() {
    this.layout.screenSizeChanged.subscribe((screenSize) => {
      switch (screenSize) {
        case ScreenSize.isMobile:
          this.banner = this.data.mobileBanner;
          break;
        case ScreenSize.isTablet:
          this.banner = this.data.tabletBanner;
          break;
        default:
          this.banner = this.data.desktopBanner;
          break;
      }
    });
  }

  scrollToElement(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ block: 'center', inline: 'center' });
    }
  }
}

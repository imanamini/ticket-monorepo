import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ContentNavData } from '../../../models/content-nav-data';
import { SwiperOptions } from 'swiper/types';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { SwiperDirective } from '../../../ui-directive/swiper.directive';

// SwiperCore.use([Navigation]);

@Component({
  selector: 'app-ui-content-nav',
  templateUrl: './ui-content-nav.component.html',
  styleUrls: ['./ui-content-nav.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, UiButtonComponent, SwiperDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiContentNavComponent {
  // @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  index = 0;
  @Input()
  data!: ContentNavData;

  activeIndex = 1;

  configNav: SwiperOptions = {
    slidesPerView: 'auto',
    allowTouchMove: true,
    centerInsufficientSlides: true,
    slideToClickedSlide: true,
    breakpoints: {
      1280: {
        direction: 'vertical',
        centeredSlides: false,
        noSwiping: true,
        allowTouchMove: false,
      },
      20: {
        direction: 'horizontal',
        watchSlidesProgress: true,
        updateOnWindowResize: true,
        centerInsufficientSlides: true,
        centeredSlides: true,
      },
    },
  };

  constructor(private changeDetector: ChangeDetectorRef) {}

  changeTab(index: number) {
    event?.preventDefault();
    this.activeIndex = index;
    this.changeDetector.detectChanges();
  }

  protected readonly Object = Object;
}

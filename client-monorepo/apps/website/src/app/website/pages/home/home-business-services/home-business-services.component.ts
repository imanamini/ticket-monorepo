import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ContentNavData } from '../../../../ui/models/content-nav-data';
import { CarouselConfig } from '../../../../ui/ui-components/ui-carousel/ui-carousel/carousel-config';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiCarouselComponent } from '../../../../ui/ui-components/ui-carousel/ui-carousel/ui-carousel.component';
import { NgIf, NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-home-business-services',
  templateUrl: './home-business-services.component.html',
  styleUrls: ['./home-business-services.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, UiCarouselComponent, UiButtonComponent],
})
export class HomeBusinessServicesComponent {
  @Input()
  businessServices?: ContentNavData;

  activeIndex = 1;

  configNav: CarouselConfig = {
    slidesPerView: 'auto',
    mouseDrag: true,
    pullDrag: true,
    touchDrag: true,
    rtl: true,
    hasNavigation: false,
    autoWidth: true,
    hasCustomPagination: false,
    breakpoints: {
      650: {
        gap: 32,
        slidesPerView: 1,
      },
      20: {
        slidesPerView: 1,
        gap: 0,
      },
    },
  };

  constructor(private changeDetector: ChangeDetectorRef) {}

  changeTab(index: number) {
    this.activeIndex = index;
    this.changeDetector.detectChanges();
  }
}

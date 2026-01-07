import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';
import {SwiperOptions} from 'swiper/types';
import {CTCSectionBanks} from '../../../../api/clients/models/templates/card-to-card/card-to-card-template-data';
import {SwiperContainer} from 'swiper/swiper-element';
import {UiButtonComponent} from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import {NgIf, NgFor, NgTemplateOutlet, NgClass} from '@angular/common';
import {SwiperDirective} from '../../../../ui/ui-directive/swiper.directive';
import {delay, of} from "rxjs";

import {Autoplay, Navigation, Pagination} from "swiper/modules";
import SwiperCore from "swiper";

SwiperCore.use([Autoplay, Navigation, Pagination]);

@Component({
  selector: 'app-card-to-card-banks',
  templateUrl: './card-to-card-banks.component.html',
  styleUrls: ['./card-to-card-banks.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, UiButtonComponent, SwiperDirective, NgTemplateOutlet, NgClass],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CardToCardBanksComponent implements AfterViewInit {

  @ViewChild('swiperRef', {static: false}) swiperRef: any;

  index = 0;
  @Input()
  sectionBanks: CTCSectionBanks;

  activeBank: number;

  config: SwiperOptions = {
    centeredSlides: true,
    roundLengths: true,
    loop: true,
    slideToClickedSlide: true,
    autoplay: {
      delay: 3000,             // time (ms) between slides
      disableOnInteraction: false,
      pauseOnMouseEnter: true, // optional, if you want mouse‑hover pause
    },
    breakpoints: {
      1280: {
        slidesPerView: 9,
        spaceBetween: 64,
      },
      744: {
        slidesPerView: 5,
        spaceBetween: 0,
      },
      280: {
        slidesPerView: 3,
        spaceBetween: 0,
      },
    },
  };

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    const swiperEl = this.swiperRef.nativeElement as any;

    swiperEl?.addEventListener('slidechange', (event: any) => {
      const swiper = event.target.swiper;
      this.getActiveSlide(swiper.realIndex);
    });

  }

  getActiveSlide(index: number) {
    this.activeBank = index;
    this.cdr.detectChanges();
  }
}

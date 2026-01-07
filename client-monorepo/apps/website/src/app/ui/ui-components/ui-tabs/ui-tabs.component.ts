import {
  AfterViewInit,
  Component,
  ContentChild,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter, input,
  Input,
  Output, signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {SwiperOptions} from 'swiper/types';
import {SwiperContainer} from 'swiper/swiper-element';
import {NgClass, NgFor, NgIf, NgTemplateOutlet} from '@angular/common';
import {SwiperDirective} from '../../ui-directive/swiper.directive';
import Swiper from "swiper";
import {delay, of} from "rxjs";
import {NgxIcon} from "@digipay/ngx-icon";

@Component({
  selector: 'app-ui-tabs',
  templateUrl: './ui-tabs.component.html',
  styleUrls: ['./ui-tabs.component.scss'],
  standalone: true,
  imports: [NgFor, NgTemplateOutlet, SwiperDirective, NgClass, NgIf, NgxIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiTabsComponent implements AfterViewInit {
  @ViewChild('swiper', {static: true}) swiperEl!: ElementRef;

  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

  @Input()
  items: any[] = [];

  internalActiveIndex = input(0);

  @Output()
  changeSwiperSlide = new EventEmitter<number>();

  activeIndex = 0;

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

  changeTab(index: number) {
    this.changeSwiperSlide.emit(index);
  }

  ngAfterViewInit(): void {
    of('').pipe(delay(1000)).subscribe({
      next: () => {
        const swiper = this.swiperEl.nativeElement.swiper as Swiper;
        swiper?.on('slideChange', () => {
          const index = swiper.activeIndex;
          console.log(`Active slide index: ${index}`);
          this.changeSwiperSlide.emit(index);
        });
      }
    })


  }
}

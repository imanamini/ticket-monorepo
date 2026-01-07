import {
  AfterViewInit,
  Component,
  ContentChild,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef, EventEmitter, input,
  Input, Output, signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {SwiperOptions} from 'swiper/types';
import {SwiperContainer} from 'swiper/swiper-element';
import {NgClass, NgFor, NgTemplateOutlet} from '@angular/common';
import {SwiperDirective} from '../../../ui-directive/swiper.directive';

@Component({
  selector: 'app-ui-swiper-tabs',
  templateUrl: './ui-swiper-tabs.component.html',
  styleUrls: ['./ui-swiper-tabs.component.scss'],
  standalone: true,
  imports: [NgFor, NgTemplateOutlet, SwiperDirective, NgClass],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UiSwiperTabsComponent implements AfterViewInit {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

  @Input()
  items: any[] = [];

  activeIndex = 0;

  @Input()
  configNav: SwiperOptions = {
    slidesPerView: 'auto',
    allowTouchMove: true,
    centeredSlides: false, // disable cloning
    loop: false,           // disable cloning
    slideToClickedSlide: true,
  }
  @Output() slideSelected = new EventEmitter<number>();

  activeSwitchPageIndex = input(0);

  ngAfterViewInit(): void {
    const swiperEl = this.swiper.nativeElement;
    if (swiperEl.swiper) {
      swiperEl.swiper.on('slideChange', () => {
        this.activeIndex = swiperEl.swiper.activeIndex;
        this.slideSelected.emit(this.activeIndex); // notify parent on slide change
      });
    }
  }

  selectSlide(index: number) {
    this.slideSelected.emit(index);
    const swiperEl = this.swiper.nativeElement;
    swiperEl.swiper?.slideTo(index, 300);
    this.slideSelected.emit(index);
  }
}

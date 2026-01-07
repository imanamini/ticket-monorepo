import {
  AfterViewInit,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CarouselConfig, CONFIG_TRANSLATOR } from './carousel-config';
import { OwlOptions, SlideModel, CarouselModule } from 'ngx-owl-carousel-o';
import { NgFor, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-ui-carousel',
  templateUrl: './ui-carousel.component.html',
  styleUrl: './ui-carousel.component.scss',
  standalone: true,
  imports: [CarouselModule, NgFor, NgTemplateOutlet],
})
export class UiCarouselComponent implements OnInit, AfterViewInit {
  @Input() carouselConfig: CarouselConfig;

  @Input() slidesData: any[];

  @Input() nextBtnRef: HTMLDivElement;

  @Input() prevBtnRef: HTMLDivElement;

  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

  @ViewChild('owlCarousel', { static: false }) owlCarousel: any;

  @Output() slideChange = new EventEmitter();

  owlCarouselConfig: OwlOptions;

  activeSlides: Array<SlideModel>;

  activeSlideMap: { [idx: string]: boolean } = {};

  centeredSlideId: string;

  // TODO add config types

  // TODO add ssrSlidesPerView

  ngOnInit(): void {
    this.owlCarouselConfig = this.translate(this.carouselConfig);
  }

  translate(config: CarouselConfig) {
    const obj = {};
    Object.keys(config).forEach((key) => {
      if (CONFIG_TRANSLATOR[key]) {
        if (CONFIG_TRANSLATOR[key] == 'responsive') {
          obj[CONFIG_TRANSLATOR[key]] = this.translateBreakPoints(config[key]);
        } else {
          obj[CONFIG_TRANSLATOR[key]] = config[key];
        }
      }
    });
    return obj;
  }

  translateBreakPoints(breakPoints: { [minWidth: number]: CarouselConfig }): {
    [minWidth: number]: OwlOptions;
  } {
    if (!breakPoints) {
      return null;
    }
    const newBreakPoints: { [minWidth: number]: OwlOptions } = {};
    Object.keys(breakPoints).forEach((key: string) => {
      newBreakPoints[+key] = this.translate(breakPoints[key]);
    });
    return newBreakPoints;
  }

  slidesChanged($event) {
    this.activeSlides = $event.slides;
    this.checkActives();
    this.checkCenter();
  }

  checkActives() {
    if (this.activeSlides && this.activeSlides.length > 0) {
      this.activeSlideMap = {};
      this.activeSlides.forEach((slide) => {
        this.activeSlideMap[slide.id] = true;
      });
    }
  }

  checkCenter() {
    if (this.activeSlides && this.activeSlides.length > 0) {
      this.centeredSlideId = this.activeSlides[Math.ceil(this.activeSlides.length / 2) - 1]?.id;
    }
  }

  carouselInitialized($event) {
    this.activeSlides = $event.slides;
    this.checkActives();
    this.checkCenter();
  }

  carouselTranslated($event) {
    this.slideChange.emit($event.startPosition);
  }

  ngAfterViewInit() {
    if (this.nextBtnRef) {
      this.nextBtnRef.addEventListener('click', () => {
        this.owlCarousel.next();
      });
    }

    if (this.prevBtnRef) {
      this.prevBtnRef.addEventListener('click', () => {
        this.owlCarousel.prev();
      });
    }
  }
}

import {Component, computed, ElementRef, input, signal, ViewChild} from '@angular/core';
import { AboutUsTemplateData } from '../../../../api/clients/models/templates/about-us/about-us-template-data';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { NgFor } from '@angular/common';
import { SwiperDirective } from '../../../../ui/ui-directive/swiper.directive';
import {AboutUsHistoryItemComponent} from "./about-us-history-item/about-us-history-item.component";
import {BorderColorsEnum, NgxDividerComponent} from "@digipay/ngx-divider";

@Component({
  selector: 'app-about-us-history',
  templateUrl: './about-us-history.component.html',
  styleUrls: ['./about-us-history.component.scss'],
  standalone: true,
  imports: [NgFor, SwiperDirective, AboutUsHistoryItemComponent, NgxDividerComponent],
})
export class AboutUsHistoryComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  templateData = input<AboutUsTemplateData | null>(null);
  activeIndex = signal(0);

  config: SwiperOptions = {
    centeredSlides: true,
    slidesPerView: 1,
    loop: true,
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    centerInsufficientSlides: true,
    breakpoints: {
      1280: {
        slidesPerView: 3,
        spaceBetween: 60,
      },
      744: {
        spaceBetween: 30,
        slidesPerView: 2,
      },
      280: {
        slidesPerView: 1,
        spaceBetween: 15,
      },
    },
  };

  setActiveIndex(index: number): void {
    this.activeIndex.set(index);
  }

  activeHistoryItem = computed(() => {
    const index = this.activeIndex();
    return this.templateData().mainHistory.history[index];
  })
  protected readonly BorderColorsEnum = BorderColorsEnum;
}

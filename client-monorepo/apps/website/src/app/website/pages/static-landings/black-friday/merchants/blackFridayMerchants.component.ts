import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef, inject, Inject,
  input, OnInit, PLATFORM_ID,
  QueryList,
  signal,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {ApiFile} from "../../../../../api/clients/models/common/api-file";
import {SwiperDirective} from "../../../../../ui/ui-directive/swiper.directive";
import {SwiperOptions} from "swiper/types";
import {SwiperContainer} from 'swiper/swiper-element';
import {NgxIcon} from "@digipay/ngx-icon";
import {UrlService} from "../../../../services/url.service";

@Component({
  selector: 'app-black-friday-merchants',
  standalone: true,
  imports: [CommonModule, SwiperDirective, NgxIcon],
  templateUrl: './blackFridayMerchants.component.html',
  styleUrl: './blackFridayMerchants.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlackFridayMerchantsComponent implements OnInit {
  merchants = input<{
    title: string,
    categories: Array<{
      title: string,
      products: Array<{
        image: ApiFile,
        link: string | null
      }>
    }>
  }>();

  config: SwiperOptions = {
    slidesPerView: 1,
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    centerInsufficientSlides: true,
    allowTouchMove: true,
    breakpoints: {
      900: {
        slidesPerView: 6.7,
      },
      700: {
        slidesPerView: 5.5,
      },
      460: {
        slidesPerView: 4.8,
      },
      280: {
        slidesPerView: 3.2,
      },
    },
  };

  mobileMode = signal<boolean>(false);

  urlService = inject(UrlService);

  constructor(private cdr: ChangeDetectorRef, @Inject(PLATFORM_ID) public platformID: string,) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformID)) {
      this.mobileMode.set(window.innerWidth <= 1280);
    }
  }

  onSwiperReady() {
    this.cdr.detectChanges();
  }

  openLink(link: string) {
    if (link) {
      this.urlService.handleLink(link);
    }
  }
}

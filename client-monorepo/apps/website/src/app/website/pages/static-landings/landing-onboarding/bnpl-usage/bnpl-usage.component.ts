import {ChangeDetectionStrategy, Component, Inject, input, OnInit, PLATFORM_ID} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {SwiperDirective} from "../../../../../ui/ui-directive/swiper.directive";
import {UiButtonComponent} from "../../../../../ui/ui-components/ui-button/ui-button/ui-button.component";
import {SwiperOptions} from "swiper/types";
import {bnplUsage} from "../../../../../api/clients/models/templates/bnpl-onboarding/bnpl-onboarding-template-data";
import {ApiImageModule} from "@digipay/ng-ui-api-image";

@Component({
  selector: 'app-bnpl-usage',
  standalone: true,
  imports: [CommonModule, SwiperDirective, UiButtonComponent, ApiImageModule],
  templateUrl: './bnpl-usage.component.html',
  styleUrl: './bnpl-usage.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BnplUsageComponent implements OnInit {

  classes = input<string[]>(['py-hulk']);
  bnplUsage = input<bnplUsage>();
  config: SwiperOptions = {
    slidesPerView: 1,
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    centerInsufficientSlides: true,
    allowTouchMove: true,
    breakpoints: {
      700: {
        slidesPerView: 2,
      },
      570: {
        slidesPerView: 1.6,
      },
      470: {
        slidesPerView: 1.4,
      },
      420: {
        slidesPerView: 1.2,
      },
      360: {
        slidesPerView: 1.1,
      },
    },
  };


  constructor(@Inject(PLATFORM_ID) public platformId: string) {
  }

  getGroupedItems() {
    if (this.bnplUsage().categories.length) {
      const grouped = [];
      for (let i = 0; i < this.bnplUsage()?.categories.length; i += 3) {
        grouped.push(this.bnplUsage().categories.slice(i, i + 3));
      }
      return grouped;
    }

  }

  ngOnInit(): void {
  }

  protected readonly isPlatformBrowser = isPlatformBrowser;
}

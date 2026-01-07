import { Component, effect, ElementRef, input, ViewChild } from '@angular/core';
import { BPGPartners } from '../../../../api/clients/models/templates/bpg/bpg-template-data';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { SwiperDirective } from '../../../../ui/ui-directive/swiper.directive';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-bpg-partners',
  templateUrl: './bpg-partners.component.html',
  styleUrls: ['./bpg-partners.component.scss'],
  standalone: true,
  imports: [UiButtonComponent, SwiperDirective],
})
export class BpgPartnersComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  title = input<string>('');
  subtitle = input<string>('');
  partners = input<BPGPartners[] | undefined>([]);

  config: SwiperOptions = {
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    allowTouchMove: true,
    breakpoints: {
      744: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
      280: {
        slidesPerView: 1.5,
        spaceBetween: 8,
      },
    },
  };

  constructor() {
    // Effect to ensure Swiper is initialized
    effect(() => {
      if (this.swiper?.nativeElement?.swiper) {
        this.swiper.nativeElement.swiper.update();
      }
    });
  }
}

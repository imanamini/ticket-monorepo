import { ChangeDetectorRef, Component, effect, ElementRef, input, signal, ViewChild } from '@angular/core';
import { CreditConfigResponse } from '../../../../api/clients/models/templates/credit/credit-config.response';
import { DigikalaProducts } from '../../../../api/clients/models/templates/credit-v3/credit-config.response';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { ProductsListComponent } from './products-list/products-list.component';
import { NgClass } from '@angular/common';
import { SwiperDirective } from '../../../ui-directive/swiper.directive';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-credit-digikala-products',
  templateUrl: './credit-digikala-products.component.html',
  styleUrls: ['./credit-digikala-products.component.scss'],
  standalone: true,
  imports: [NgClass, ProductsListComponent, SwiperDirective],
})
export class CreditDigikalaProductsComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  index = signal(0);
  templateData = input.required<DigikalaProducts>();
  creditConfig = input.required<CreditConfigResponse>();
  title = input<string>('');
  subtitle = input<string>('');
  digikalaProducts = input<any>();
  productSingle = input<any>();
  selectedTab = signal(0);

  configCategories: SwiperOptions = {
    slideToClickedSlide: true,
    slidesPerView: 'auto',
    watchSlidesProgress: true,
    spaceBetween: 16,
    allowTouchMove: true,
  };

  config: SwiperOptions = {
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    centerInsufficientSlides: true,
    slideToClickedSlide: false,
    spaceBetween: 16,
    grabCursor: true,
    slidesPerView: 'auto',
    navigation: true,
  };

  constructor(private changeDetector: ChangeDetectorRef) {
    // Effect to sync Swiper index with selectedTab
    effect(() => {
      if (this.swiper?.nativeElement?.swiper) {
        this.swiper.nativeElement.swiper.activeIndex = this.selectedTab();
        this.index.set(this.selectedTab());
        this.changeDetector.detectChanges();
      }
    });
  }

  changeTab(tabIndex: number) {
    this.selectedTab.set(tabIndex);
  }

  slideChange(swiper: any) {
    this.index.set(swiper.detail[0].activeIndex);
    this.selectedTab.set(swiper.detail[0].activeIndex);
  }
}

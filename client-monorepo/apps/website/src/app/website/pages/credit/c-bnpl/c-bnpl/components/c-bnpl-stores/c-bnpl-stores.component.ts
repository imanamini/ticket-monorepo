import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CBnplStores } from '../../../../../../../api/clients/models/templates/c-bnpl-v2/c-bnpl-v2-template-data.response';
import { STORE_CATEGORIES, STORE_CATEGORIES_TRANSLATION } from '../../../../../../../api/digipay/models/merchants/store-categories';
import { SwiperOptions } from 'swiper/types';
import { MerchantsApiService } from '../../../../../../../api/clients/credit/merchants-api.service';
import { SingleMerchant } from '../../../../../../../api/digipay/models/merchants/single-merchant.model';
import { environment } from '../../../../../../../../environments/environment';
import { SwiperContainer } from 'swiper/swiper-element';
import { UiButtonComponent } from '../../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { UiIconDirective } from '../../../../../../../ui/ui-directive/ui-icon.directive';
import { SwiperDirective } from '../../../../../../../ui/ui-directive/swiper.directive';
import { register } from 'swiper/element/bundle';
import { NgxIcon } from '@digipay/ngx-icon';

register();
@Component({
  selector: 'app-c-bnpl-stores',
  templateUrl: './c-bnpl-stores.component.html',
  styleUrls: ['./c-bnpl-stores.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, UiButtonComponent, UiIconDirective, SwiperDirective, NgxIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CBnplStoresComponent implements OnInit {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  index = 0;
  @Input() cBnplStores: CBnplStores;

  @Input()
  withoutHref = true;

  categoriesConfig: SwiperOptions = {
    slidesPerView: 'auto',
    spaceBetween: 8,
    centeredSlides: false,
    allowTouchMove: true,
    slideToClickedSlide: true,
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    breakpoints: {
      1280: {
        navigation: false,
        centerInsufficientSlides: true,
      },
      20: {
        centerInsufficientSlides: false,
      },
    },
  };

  storesConfig: SwiperOptions = {
    slidesPerView: 'auto',
    spaceBetween: 10,
    allowTouchMove: true,
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    loop: true,
    slideToClickedSlide: false,
    centerInsufficientSlides: true,
  };
  selectedCategory: STORE_CATEGORIES;

  isLoading = false;

  storesList: SingleMerchant[] = [];

  filteredStoresList: SingleMerchant[] = [];

  mobileCategoryOptions: Array<{ title: string; value: number }> = [];

  protected readonly STORE_CATEGORIES_TRANSLATION = STORE_CATEGORIES_TRANSLATION;

  protected readonly environment = environment;

  constructor(private merchantsApiService: MerchantsApiService) {}

  ngOnInit(): void {
    this.createMobileCategoryOptions();
  }

  changeSelectedCategory(clickedCategory: STORE_CATEGORIES) {
    this.selectedCategory = clickedCategory;
    this.filteredStoresList = [...this.storesList].filter((store) => {
      return store.category.includes(+this.selectedCategory);
    });
  }

  createMobileCategoryOptions() {
    this.cBnplStores.storeCategories.forEach((storeCategory) => {
      this.mobileCategoryOptions.push({
        title: STORE_CATEGORIES_TRANSLATION[storeCategory.category],
        value: +storeCategory.category,
      });
    });
  }
}

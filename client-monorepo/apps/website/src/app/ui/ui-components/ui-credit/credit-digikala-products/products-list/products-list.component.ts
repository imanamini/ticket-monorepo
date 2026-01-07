import { Component, effect, ElementRef, inject, input, signal, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper/types';
import { MatDialog } from '@angular/material/dialog';
import { CreditConfigResponse } from '../../../../../api/clients/models/templates/credit/credit-config.response';
import { SwiperContainer } from 'swiper/swiper-element';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UiButtonComponent } from '../../../ui-button/ui-button/ui-button.component';
import { ProductsListSkeletonComponent } from '../products-list-skeleton/products-list-skeleton.component';
import { UiIconDirective } from '../../../../ui-directive/ui-icon.directive';
import { SwiperDirective } from '../../../../ui-directive/swiper.directive';
import { UiDialogFullPageCreditComponent } from '../../ui-dialog-full-page-credit/ui-dialog-full-page-credit.component';
import { register } from 'swiper/element/bundle';
import { NgxIcon } from '@digipay/ngx-icon';

register();
@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  standalone: true,
  imports: [UiIconDirective, ProductsListSkeletonComponent, UiButtonComponent, PipesModule, SwiperDirective, NgxIcon],
})
export class ProductsListComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  index = signal(0);
  digikalaProducts = input<any>();
  selectedTab = input(0);
  creditConfig = input<CreditConfigResponse>();
  productSingle = input<any>();

  private matDialog = inject(MatDialog);

  config: SwiperOptions = {
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    centerInsufficientSlides: true,
    slideToClickedSlide: false,
    spaceBetween: 16,
    grabCursor: true,
    slidesPerView: 'auto',
  };

  constructor() {
    // Effect to sync Swiper index with selectedTab
    effect(() => {
      if (this.swiper?.nativeElement?.swiper) {
        this.swiper.nativeElement.swiper.activeIndex = this.selectedTab();
      }
    });
  }

  rialToToman(number: number) {
    return number.toString().slice(0, -1);
  }

  openProduct(product: any, products: any) {
    this.matDialog.open(UiDialogFullPageCreditComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: {
        product: product,
        products: products,
        config: this.creditConfig(),
        templateData: this.productSingle(),
      },
    });
  }
}

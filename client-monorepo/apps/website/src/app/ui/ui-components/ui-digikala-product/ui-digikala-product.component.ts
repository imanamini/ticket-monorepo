import { ChangeDetectorRef, Component, effect, ElementRef, input, signal, ViewChild } from '@angular/core';
import { CreditConfigResponse, DigikalaProducts } from '../../../api/clients/models/templates/credit/credit-config.response';
import { UiDialogFullPageCreditComponent } from '../ui-credit/ui-dialog-full-page-credit/ui-dialog-full-page-credit.component';
import { MatDialog } from '@angular/material/dialog';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UiSpinnerComponent } from '../ui-loading/ui-spinner/ui-spinner.component';
import { UiButtonComponent } from '../ui-button/ui-button/ui-button.component';
import { CollapsiblePlusSignComponent } from '../ui-icons/collapsible-plus-sign/collapsible-plus-sign.component';
import { NgClass } from '@angular/common';
import { SwiperDirective } from '../../ui-directive/swiper.directive';

@Component({
  selector: 'app-ui-digikala-product',
  templateUrl: './ui-digikala-product.component.html',
  styleUrls: ['./ui-digikala-product.component.scss'],
  standalone: true,
  imports: [NgClass, CollapsiblePlusSignComponent, UiButtonComponent, UiSpinnerComponent, PipesModule, SwiperDirective],
})
export class UiDigikalaProductComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  index = signal(0);
  templateData = input<DigikalaProducts | undefined>();
  creditConfig = input.required<CreditConfigResponse>();
  title = input<string>('');
  subtitle = input<string>('');
  digikalaProducts = input<any>();
  productSingle = input<any>();
  selectedTab = signal(0);
  selectedStep = signal(0);
  selectedCard = signal(-1);

  configCategories: SwiperOptions = {
    slideToClickedSlide: true,
    slidesPerView: 'auto',
  };

  config: SwiperOptions = {
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    centerInsufficientSlides: true,
    slideToClickedSlide: false,
    spaceBetween: 24,
    grabCursor: true,
    breakpoints: {
      1280: {
        slidesPerView: 5,
        spaceBetween: 24,
      },
      575: {
        spaceBetween: 20,
        slidesPerView: 2.2,
      },
      340: {
        slidesPerView: 1.4,
      },
      280: {
        slidesPerView: 1.2,
        spaceBetween: 15,
      },
    },
  };

  constructor(
    private changeDetector: ChangeDetectorRef,
    private matDialog: MatDialog,
  ) {
    // Effect to sync Swiper index with selectedTab
    effect(() => {
      if (this.swiper?.nativeElement?.swiper) {
        this.swiper.nativeElement.swiper.activeIndex = this.selectedTab();
        this.index.set(this.selectedTab());
        this.changeDetector.detectChanges();
      }
    });
  }

  rialToToman(number: number) {
    return number.toString().slice(0, -1);
  }

  changeTab(tabIndex: number) {
    this.selectedTab.set(tabIndex);
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

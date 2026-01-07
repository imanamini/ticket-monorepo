import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CreditConfigResponse, DigikalaProducts } from '../../../../../api/clients/models/templates/credit/credit-config.response';
import { MatDialog } from '@angular/material/dialog';
import { UiDialogFullPageCreditComponent } from '../../../../../ui/ui-components/ui-credit/ui-dialog-full-page-credit/ui-dialog-full-page-credit.component';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/swiper-element';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UiSpinnerComponent } from '../../../../../ui/ui-components/ui-loading/ui-spinner/ui-spinner.component';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { CollapsiblePlusSignComponent } from '../../../../../ui/ui-components/ui-icons/collapsible-plus-sign/collapsible-plus-sign.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { SwiperDirective } from '../../../../../ui/ui-directive/swiper.directive';

// SwiperCore.use([Grid, Navigation, Pagination]);

@Component({
  selector: 'app-p-digikala-sub-category',
  templateUrl: './p-digikala-sub-category.component.html',
  styleUrls: ['./p-digikala-sub-category.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgClass, CollapsiblePlusSignComponent, UiButtonComponent, UiSpinnerComponent, PipesModule, SwiperDirective],
})
export class PDigikalaSubCategoryComponent {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  index = 0;

  @Input()
  templateData: DigikalaProducts | undefined;

  @Input()
  creditConfig!: CreditConfigResponse;

  @Input()
  title = '';

  @Input()
  subtitle = '';

  @Input()
  digikalaProducts: any;

  @Input()
  productSingle: any;

  selectedTab = 0;

  selectedStep = 0;

  selectedCard = -1;

  config: SwiperOptions = {
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    centerInsufficientSlides: true,
    slideToClickedSlide: false,
    spaceBetween: 24,
    breakpoints: {
      1280: {
        grid: {
          fill: 'row',
          rows: 3,
        },
        slidesPerView: 3,
        allowTouchMove: false,
      },
      575: {
        spaceBetween: 20,
        slidesPerView: 2.5,
      },
      340: {
        slidesPerView: 1.4,
      },
      280: {
        slidesPerView: 1.2,
        spaceBetween: 15,
      },
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };

  constructor(
    private changeDetector: ChangeDetectorRef,
    private matDialog: MatDialog,
  ) {}

  rialToToman(number: number) {
    return number.toString().slice(0, -1);
  }

  changeStep(stepIndex: number) {
    this.selectedStep = stepIndex;
    this.selectedTab = 0;
  }

  changeTab(tabIndex: number) {
    this.selectedTab = tabIndex;
    this.changeDetector.detectChanges();
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
        config: this.creditConfig,
        templateData: this.productSingle,
      },
    });
  }
}

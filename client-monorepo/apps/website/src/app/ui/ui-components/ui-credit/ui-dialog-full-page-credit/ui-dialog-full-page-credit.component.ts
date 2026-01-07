import { Component, effect, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { ScrollToAnchorDirective } from '../../../ui-directive/scroll-to-anchor.directive';
import { NgOptimizedImage } from '@angular/common';
import { SwiperContinuousContentComponent } from '../../ui-swiper/swiper-continuous-content/swiper-continuous-content.component';
import { CreditCalculatorV3Component } from '../credit-calculator-v3/credit-calculator-v3.component';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-ui-dialog-full-page-credit',
  templateUrl: './ui-dialog-full-page-credit.component.html',
  styleUrls: ['./ui-dialog-full-page-credit.component.scss'],
  standalone: true,
  imports: [
    PipesModule,
    UiButtonComponent,
    ScrollToAnchorDirective,
    NgOptimizedImage,
    SwiperContinuousContentComponent,
    CreditCalculatorV3Component,
    NgxIcon,
  ],
})
export class UiDialogFullPageCreditComponent {
  templateData = signal<any>(undefined);
  product = signal<any>({});
  products = signal<any[]>([]);
  config = signal<any>({});

  constructor(
    private ref: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      product: any;
      products: any;
      config: any;
      templateData: any;
    },
  ) {
    // Effect to initialize signals from injected data
    effect(
      () => {
        this.templateData.set(this.data.templateData);
        this.product.set(this.data.product);
        this.products.set(this.data.products);
        this.config.set(this.data.config);
      },
      {
        allowSignalWrites: true,
      },
    );
  }

  closeDialog(): void {
    this.ref.close(false);
  }

  rialToToman(number: number) {
    return number.toString().slice(0, -1);
  }
}

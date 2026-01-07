import { Component, input, output } from '@angular/core';
import { ProductModel } from '../../../models/product.model';
import { DecimalPipe, NgClass } from '@angular/common';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { LazyLoadImageDirective } from '../../../common/directives/lazy-load-image.directive';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [
    NgxBadgeModule,
    NgClass,
    DecimalPipe,
    LazyLoadImageDirective
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  productCard = output<ProductModel>();
  product = input<ProductModel>();
  active = input<boolean>(false);
  appId = input.required<string>({alias: 'application-form-Id'});

  productCardHandler(): void {
    this.productCard.emit(this.product());
  }
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ThirdPartyCarouselProduct } from '../../data-access/models/third-party-carousel.model';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxBadgeModule } from '@digipay/ngx-badge';

@Component({
  selector: 'common-stores-third-party-carousel-product',
  standalone: true,
  imports: [CommonModule, ApiImageModule, NgxBadgeModule, NgOptimizedImage],
  templateUrl: './third-party-carousel-product.component.html',
  styleUrl: './third-party-carousel-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThirdPartyCarouselProductComponent {
  product = input.required<ThirdPartyCarouselProduct>();
}

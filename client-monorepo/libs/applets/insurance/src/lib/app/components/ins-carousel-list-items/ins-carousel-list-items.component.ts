import { Component, input } from '@angular/core';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { NgOptimizedImage } from '@angular/common';

import { InsCarouselListItemModel } from '../../data-access/models/ins-carousel-list-item.model';
import { CarouselSlideDirective } from '../../data-access/directives/carousel-slide.directive';
import { InsCarouselComponent } from '../ins-carousel/ins-carousel.component';
import { InsIconComponent } from '../../features/vehicle/components/ins-icon/ins-icon.component';

@Component({
  selector: 'ins-carousel-list-items',
  standalone: true,
  imports: [
    NgxSkeletonLoadingComponent,
    NgOptimizedImage,
    CarouselSlideDirective,
    InsCarouselComponent,
    InsIconComponent
  ],
  templateUrl: './ins-carousel-list-items.component.html',
  styleUrl: './ins-carousel-list-items.component.scss'
})
export class InsCarouselListItemsComponent {

  constructor() {
  }

  title = input<string>('');
  description = input<string>('');
  items = input<InsCarouselListItemModel[][]>([]);
}

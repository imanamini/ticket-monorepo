import { Component, inject, input } from '@angular/core';
import { InsCarouselComponent } from '../ins-carousel/ins-carousel.component';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { BannerModel } from '../../data-access/models/banner.model';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { CarouselSlideDirective } from '../../data-access/directives/carousel-slide.directive';

@Component({
  selector: 'ins-carousel-banners',
  standalone: true,
  imports: [
    InsCarouselComponent,
    NgOptimizedImage,
    CarouselSlideDirective,
    NgxSkeletonLoadingComponent
  ],
  templateUrl: './ins-carousel-banners.component.html',
  styleUrl: './ins-carousel-banners.component.scss'
})
export class InsCarouselBannersComponent {
  private router = inject(Router);

  banners = input.required<BannerModel[]>();

  handleBannerClicked(url: string[]): void {
    this.router.navigate(url);
  }
}

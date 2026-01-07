import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageComponent } from '@digipay/ng-ui-api-image';
import { HorizontalScrollComponent, TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { Banner, MallCarousel, MallCarouselSlide, PerformanceTierService, Slide } from '@client-monorepo/common/utilities';
@Component({
  selector: 'common-app-banners-mall-carousel-banner',
  standalone: true,
  imports: [CommonModule, ApiImageComponent, HorizontalScrollComponent, TitleSummaryComponent],
  templateUrl: './mall-carousel-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MallCarouselBannerComponent implements OnInit {
  performanceTierService = inject(PerformanceTierService);

  banner = input.required<MallCarousel>();
  slideClick = output<{
    slide: Slide;
    banner: Banner;
  }>();
  nothingToShow = output<boolean>();

  slides = signal<MallCarouselSlide[]>([]);
  loadingEffect = computed(() => this.performanceTierService.tier() !== 'low');

  ngOnInit(): void {
    this.setSlides();
  }

  handleSlideClicked(slide: Slide, banner: Banner) {
    this.slideClick.emit({ slide, banner });
  }

  setSlides(): void {
    this.slides.set(this.banner()?.slides?.filter(slide => !!slide.extractedData?.image) as MallCarouselSlide[]);
    if (this.slides().length === 0) {
      this.nothingToShow.emit(true);
    }
  }
}

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  Renderer2,
  signal,
  viewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { Action } from '@client-monorepo/common/action-handler';
import { HorizontalScrollComponent } from '@client-monorepo/common/ui-components';
import { ThirdPartyTrackerService } from '@client-monorepo/common/event-management';
import { Banner, BannerCategory, SimpleImageSlide, Slide } from '@client-monorepo/common/utilities';

@Component({
  selector: 'common-app-banners-partial-view-carousel-banner',
  standalone: true,
  imports: [CommonModule, ApiImageModule, HorizontalScrollComponent],
  templateUrl: './partial-view-carousel-banner.component.html',
  styleUrl: './partial-view-carousel-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartialViewCarouselBannerComponent implements OnInit, AfterViewInit {
  // Inputs
  banner = input.required<Banner>();
  renderer = inject(Renderer2);
  body = signal<HTMLElement | null>(null);
  slideWidth = signal(0);

  // Outputs
  clickedItem = output<{ action: Action | undefined; slide: Slide }>();

  animationIsRunningVariable = signal(false);
  trackerBanners = viewChildren<ElementRef<HTMLDivElement>>('trackerBanner');

  thirdPartyTrackerService = inject(ThirdPartyTrackerService);
  categoryToShow = input.required<BannerCategory>();
  constructor() {
    effect(() => {
      if (this.trackerBanners().length) {
        this.trackerBanners().forEach((item) => {
          if (!item.nativeElement) {
            return;
          }
          const ids = item.nativeElement.dataset['id']?.split('|');
          if (!ids || ids.length !== 2) {
            return;
          }
          const bannerId = ids[0];
          const slideId = ids[1];
          const slide = this.banner()?.slides.find((slide) => slide.uuid === slideId) as SimpleImageSlide;
          const creativeName = slide && slide.extractedData?.marketingId;
          if (!this.banner() || !slide || !creativeName) {
            return;
          }
          this.thirdPartyTrackerService.observeViewElementAndSendEvent(
            item.nativeElement,
            'view_promotion',
            this.generateTrackingData(this.banner(), slide),
            bannerId + '|' + slideId,
          );
        });
      }
    });
  }

  generateTrackingData(banner: Banner, slide: SimpleImageSlide) {
    return {
      promotion_id: banner.uuid + '|' + slide.uuid,
      promotion_name: banner?.title,
      creative_name: slide && slide.extractedData?.marketingId,
      creative_slot: banner?.type,
      location_id: this.categoryToShow() + banner?.order + slide.order,
    };
  }

  animationIsRunning(isRunning: boolean) {
    if (!isRunning) {
      setTimeout(() => {
        this.animationIsRunningVariable.set(false);
      }, 200);
    } else {
      this.animationIsRunningVariable.set(true);
    }
  }

  handleClickItem(slide: Slide) {
    setTimeout(() => {
      if (this.animationIsRunningVariable()) {
        return;
      }
      this.clickedItem.emit({ action: slide.extractedAction, slide: slide });
    }, 210);
  }

  ngOnInit() {
    this.body.set(this.renderer.selectRootElement('#dpx-main-layout-body', true));
    this.calculateWidth();
  }

  ngAfterViewInit() {
    this.renderer.listen('window', 'resize', () => {
      this.calculateWidth();
    });
  }

  calculateWidth(): void {
    const bodyWidth = this.body()?.offsetWidth || 0;
    this.slideWidth.set((75 * bodyWidth) / 100);
  }
}

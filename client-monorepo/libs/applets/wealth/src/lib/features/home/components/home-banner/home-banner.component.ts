import { Component, inject, input, OnInit, signal } from '@angular/core';
import { DashboardBanner } from '../../../../data-access/models/dashboard-parts.model';
import { EIntrackEventName } from '../../../../components/core/models/intrack-event-name.enum';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { CROWD_LIST_ROUTE, WALLET_GUIDS } from '../../../../data-access/constants/app-routes';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { NgxDpCarouselComponent, NgxDpCarouselSlideDirective } from '@digipay/ngx-dp-carousel';

@Component({
  selector: 'wealth-applet-home-banner',
  standalone: true,
  imports: [NgxSkeletonLoadingComponent, NgxDpCarouselComponent, NgxDpCarouselSlideDirective],
  templateUrl: './home-banner.component.html',
  styleUrl: './home-banner.component.scss',
})
export class HomeBannerComponent implements OnInit {
  banners = input<DashboardBanner[]>();
  private navigationService = inject(WealthNavigationService);
  private eventService = inject(NgxEventTrackerService);

  imagesLoaded = signal(false);

  ngOnInit() {
    this.preloadImages();
  }

  private async preloadImages() {
    if (!this.banners() || this.banners().length === 0) return;

    const imagePromises = this.banners().map((banner) => this.loadImage(banner.iconPath));

    try {
      await Promise.all(imagePromises);
      this.imagesLoaded.set(true);
    } catch (error) {
      console.warn('Some images failed to load', error);
      this.imagesLoaded.set(true);
    }
  }

  private loadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Load image failed'));
      img.src = src;
    });
  }

  openInvestments(banner: DashboardBanner) {
    const eventData = {
      eventName: EIntrackEventName.ASSET_CLASS_SELECT,
      eventData: {
        TYPE: banner.queryParams ?? 'Direct',
        ID: banner.bannerId,
      },
    };
    this.eventService.sendEvent(eventData);
    if (banner.title === 'CROWD') {
      this.navigationService.navigate([CROWD_LIST_ROUTE]);
    } else {
      if (banner.bannerId) {
        if (banner.bannerId === 'treasury') {
          if (banner.title === 'GUID') {
            this.navigationService.navigate([WALLET_GUIDS, 'campaign', banner.bannerId]);
          } else {
            this.navigationService.navigate([banner.path, banner.bannerId], {
              queryParams: {
                referrer: 'wealth',
              },
            });
          }
        } else {
          this.navigationService.navigate([banner.path, banner.bannerId]);
        }
      } else {
        this.navigationService.navigate([banner.path], {
          queryParams: { type: banner.queryParams },
        });
      }
    }
  }
}

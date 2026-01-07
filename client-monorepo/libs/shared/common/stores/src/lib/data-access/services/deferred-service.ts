import { EventEmitter, inject, Injectable, signal } from '@angular/core';
import { Banner, BannerService, deepClone, LayoutService } from '@client-monorepo/common/utilities';
import { fromEvent, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeferredService {
  layoutService = inject(LayoutService);
  subscription = new Subscription();
  page = 'online-stores';
  orderedGroupedOnlineBanners = signal<Banner[]>([]);
  remainingGroupedOnlineBanners = signal<Banner[][]>([]);
  groupsPattern = [5, 4, 3];
  loadingNewBanner = signal(false);
  lockScroll = false;
  bannerService = inject(BannerService);
  intervalForLoadNewItems!: NodeJS.Timeout;
  scrollEvent = fromEvent(this.layoutService.scrollContainer, 'scroll');
  scrollEndEvent = new EventEmitter<void>();

  computeOrderedGroupedOnlineBanners(banners: Banner[]): void {
    const onlineStoreBanners = banners
      .filter((b) => b.categories.some((b) => b.includes('STORE_') && b.length < 9))
      .map((b) => {
        b.categories = [b.categories.filter((b) => b.includes('STORE_') && b.length < 9)[0]];
        return b;
      });
    this.remainingGroupedOnlineBanners.set(this.groupBanners(onlineStoreBanners));
    const firstGroup = this.remainingGroupedOnlineBanners().splice(0, 1)[0];
    if (firstGroup) {
      this.orderedGroupedOnlineBanners.set(this.bannerService.bannerMapper(firstGroup));
    }
    this.lockScroll = false;
    this.setIntervalForLoadNewBanners();
  }

  sortBanners(banners: Banner[]): Banner[] {
    return banners.sort((a, b) => {
      const aStore = +a.categories[0].replace('STORE_', '');
      const bStore = +b.categories[0].replace('STORE_', '');

      // First compare Store_X
      if (aStore !== null && bStore !== null) {
        if (aStore !== bStore) return aStore - bStore;
      }

      // If one banner has store category and the other not
      if (aStore !== null && bStore === null) return -1;
      if (aStore === null && bStore !== null) return 1;

      // Then compare banner order
      return a.order - b.order;
    });
  }

  groupBanners(banners: Banner[]): Banner[][] {
    const sorted = this.sortBanners(banners);
    let mostValueAbleProductsBanner: Banner | undefined = undefined;
    if (sorted[sorted.length - 1].type === 'Most-Valuable-Products') {
      mostValueAbleProductsBanner = sorted.splice(sorted.length - 1, 1)[0];
    }
    const result: Banner[][] = [];

    let index = 0;
    let patternIndex = 0;

    while (index < sorted.length) {
      const size =
        patternIndex < this.groupsPattern.length ? this.groupsPattern[patternIndex] : this.groupsPattern[this.groupsPattern.length - 1];
      result.push(sorted.slice(index, index + size));
      index += size;
      patternIndex++;
    }
    if (mostValueAbleProductsBanner) result.push([mostValueAbleProductsBanner]);
    return result;
  }

  setIntervalForLoadNewBanners(): void {
    if (this.intervalForLoadNewItems) {
      clearInterval(this.intervalForLoadNewItems);
    }
    this.intervalForLoadNewItems = setInterval(() => {
      this.scrollEnd();
    }, 3000);
  }

  subscribeOnScrollEvent(): void {
    this.subscription = this.scrollEvent.subscribe((event) => this.onScroll(event));
  }

  scrollEnd(): void {
    this.scrollEndEvent.emit();
    if (this.lockScroll) return;
    if (this.page === 'online-stores') {
      if (this.remainingGroupedOnlineBanners().length === 0) {
        return;
      }
      this.loadNewBanners();
    }
    this.setIntervalForLoadNewBanners();
  }

  loadNewBanners(): void {
    this.loadingNewBanner.set(true);
    this.lockScroll = true;
    setTimeout(() => {
      const newBanners = this.remainingGroupedOnlineBanners().splice(0, 1)[0];
      if (newBanners) {
        this.orderedGroupedOnlineBanners.update((ex) => {
          ex = ex.concat(this.bannerService.bannerMapper(newBanners));
          return deepClone(ex);
        });
      }
      this.loadingNewBanner.set(false);
      this.lockScroll = false;
    }, 300);
  }

  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const atBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 1;
    if (atBottom) {
      this.scrollEnd();
    }
  }

  resetState(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.orderedGroupedOnlineBanners.set([]);
    this.remainingGroupedOnlineBanners.set([]);
    this.lockScroll = true;
  }
}

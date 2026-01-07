import { BehaviorSubject } from 'rxjs';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ScreenSize } from '../../api/digipay/models/common/screen-size';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  banner: BehaviorSubject<any> = new BehaviorSubject(null);

  screenSizeChanged = new BehaviorSubject<ScreenSize>(null);

  currentSize: ScreenSize = null;

  headerVisibility = new BehaviorSubject<boolean>(true);

  isDesktop: BehaviorSubject<boolean> = new BehaviorSubject(false);

  isMobile: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(@Inject(PLATFORM_ID) public platformId: string) {
    this.resizeCallback = this.resizeCallback.bind(this);
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.resizeCallback);
      this.resizeCallback();
      this.checkDesktopSize().then();
    }
  }

  setTopBanner(banner: any) {
    this.banner.next(banner);
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.add('banner-top__active');
    }
  }

  hideTopBanner() {
    this.banner.next(null);
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('banner-top__active');
    }
  }

  showHeader(): void {
    this.headerVisibility.next(true);
  }

  hideHeader(): void {
    this.headerVisibility.next(false);
  }

  resizeCallback(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    this.checkDesktopSize().then();
    this.checkMobileSize().then();

    const isMobile = window.matchMedia('(max-width: 744px)').matches;
    const isTablet = window.matchMedia('(min-width: 744px) and (max-width: 1280px)').matches;
    const isDesktop = window.matchMedia('(min-width: 1280px)').matches;
    let newSize = null;

    newSize = isMobile ? ScreenSize.isMobile : isTablet ? ScreenSize.isTablet : ScreenSize.isDesktop;
    if (newSize !== this.currentSize) {
      this.screenSizeChanged.next(newSize);
      this.currentSize = newSize;
    }
  }

  private checkDesktopSize(): Promise<any> {
    return new Promise((resolve) => {
      if (isPlatformBrowser(this.platformId)) {
        const is = window.matchMedia('(min-width: 1280px)').matches;
        this.isDesktop.next(is);
        resolve(is);
      }
    });
  }

  private checkMobileSize(): Promise<any> {
    return new Promise((resolve) => {
      if (isPlatformBrowser(this.platformId)) {
        const is = window.matchMedia('(max-width: 744px)').matches;
        this.isMobile.next(is);
        resolve(is);
      }
    });
  }
}

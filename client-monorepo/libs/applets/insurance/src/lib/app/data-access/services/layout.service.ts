import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { ScreenSizeEnum } from '../../features/equipment/enums/screen-size.enum';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  screenSizeChanged = new BehaviorSubject<ScreenSizeEnum>(null);

  currentSize: ScreenSizeEnum = null;

  headerVisibility = new BehaviorSubject<boolean>(true);

  constructor(
    private router: Router,
  ) {
    this.resizeCallback = this.resizeCallback.bind(this);
    window.addEventListener('resize', this.resizeCallback);
    this.resizeCallback();

    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.showHeader();
      }
    });
  }

  showHeader(): void {
    this.headerVisibility.next(true);
  }

  hideHeader(): void {
    this.headerVisibility.next(false);
  }

  resizeCallback(): void {
    const isXs = window.matchMedia('(max-width: 812px)').matches;
    const isSm = window.matchMedia('(min-width: 813px) and (max-width: 991px)').matches;
    const isLg = window.matchMedia('(min-width: 992px)').matches;
    let newSize = null;
    if (isXs) {
      newSize = ScreenSizeEnum.XS;
    }
    if (isSm) {
      newSize = ScreenSizeEnum.SM;
    }
    if (isLg) {
      newSize = ScreenSizeEnum.LG;
    }
    if (newSize !== this.currentSize) {
      this.screenSizeChanged.next(newSize);
      this.currentSize = newSize;
    }
  }
}

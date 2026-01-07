import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { ScreenSize } from '../../api/models/screen-size';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  screenSizeChanged = new BehaviorSubject<ScreenSize>(null);

  currentSize: ScreenSize = null;

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
    const isXs = window.matchMedia('(max-width: 767px)').matches;
    const isSm = window.matchMedia('(min-width: 768px) and (max-width: 991px)').matches;
    const isLg = window.matchMedia('(min-width: 992px)').matches;
    let newSize = null;
    if (isXs) {
      newSize = ScreenSize.XS;
    }
    if (isSm) {
      newSize = ScreenSize.SM;
    }
    if (isLg) {
      newSize = ScreenSize.LG;
    }
    if (newSize !== this.currentSize) {
      this.screenSizeChanged.next(newSize);
      this.currentSize = newSize;
    }
  }
}

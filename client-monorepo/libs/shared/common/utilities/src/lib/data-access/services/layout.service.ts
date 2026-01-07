import { computed, inject, Injectable, signal } from '@angular/core';
import { filter, fromEvent, interval, map, Observable, pairwise, startWith, Subscription, take } from 'rxjs';
import { Size } from '../models/size';
import { CheckPointNamesEnum } from '../models/check-point-names.enum';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  resize$!: Observable<[Size, Size]>;
  initialWindowHeight = window.innerHeight;
  initialWindowWidth = window.innerWidth;
  heightWhenOpenedKeyboard = signal(0);
  counter = signal(0);
  hasScrolled = signal(false);
  keyboardHeight = computed(() => {
    return window.innerHeight - this.heightWhenOpenedKeyboard();
  });
  router = inject(Router);
  intervalSub!: Subscription;

  constructor() {
    this.resize$ = fromEvent(window, 'resize').pipe(
      filter(() => !this.isFullScreen()),
      startWith(null),
      map(() => ({ width: window.innerWidth, height: window.innerHeight })),
      pairwise(),
    );
    this.checkScrollOnNavigationEnd();
  }

  checkScrollOnNavigationEnd(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.intervalSub) {
          this.intervalSub.unsubscribe();
        }
        this.hasScrolled.set(false);
        this.intervalSub = interval(500)
          .pipe(take(4))
          .subscribe(() => {
            this.checkScroll();
          });
      }
    });
  }

  onCheckPointChange(): Observable<CheckPointNamesEnum> {
    return this.resize$.pipe(
      map(([prev, curr]) => {
        return this.whatIsTheCheckPoint(curr.width);
      }),
    );
  }

  whatIsTheCheckPoint(amount: number): CheckPointNamesEnum {
    if (amount <= 500) {
      return CheckPointNamesEnum.SM;
    } else {
      return CheckPointNamesEnum.MD;
    }
  }

  onVerticalResize(): Observable<[number, number]> {
    return this.resize$.pipe(
      filter(([prev, curr]) => prev.height !== curr.height),
      map(([prev, curr]) => [prev.height, curr.height]),
    );
  }

  onHorizontalResize(): Observable<[number, number]> {
    return this.resize$.pipe(
      filter(([prev, curr]) => prev.width !== curr.width),
      map(([prev, curr]) => [prev.width, curr.width]),
    );
  }

  onChangeOrientation(): Observable<number> {
    return fromEvent(window, 'orientationchange').pipe(map(() => Math.random()));
  }

  isKeyboardOpen(): Observable<boolean> {
    return fromEvent(window.visualViewport!, 'resize').pipe(
      map(() => {
        if (window.visualViewport!.height + 100 < window.innerHeight) {
          this.heightWhenOpenedKeyboard.set(window.visualViewport!.height);
          return true;
        } else {
          return false;
        }
      }),
    );
  }

  shouldScrollToFocusedElement(): Observable<boolean> {
    return this.isKeyboardOpen().pipe(
      map(() => {
        const focusedElement = document.activeElement as HTMLElement;

        if (focusedElement) {
          if (focusedElement.getBoundingClientRect().top < window.visualViewport!.height) {
            return false;
          }
          if (['INPUT', 'TEXTAREA'].includes(focusedElement.tagName)) {
            window.scrollTo({ top: focusedElement.offsetTop, behavior: 'smooth' });
            return true;
          }
        }
        return false;
      }),
    );
  }

  isFullScreen(): boolean {
    return !!document.fullscreenElement;
  }

  scrollToTop(): void {
    const element = document.getElementById('dpx-main-layout-body');
    if (element) {
      element.scrollTop = 0;
    }
  }

  get scrollContainer(): HTMLElement {
    return document.getElementById('dpx-main-layout-body') as HTMLElement;
  }

  get pageScrollContainer(): HTMLElement {
    return document.getElementById('dpx-page-layout-body') as HTMLElement;
  }

  checkScroll(): void {
    this.hasScrolled.set(this.scrollContainer.scrollHeight > document.body.clientHeight);
  }
}

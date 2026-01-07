import { Directive, effect, ElementRef, input, NgZone, OnDestroy, OnInit, output, signal } from '@angular/core';
import { InsDigikalaService } from '../services/ins-digikala.service';

export interface ScrollPayload {
  top: number;
  left: number;
  scrollHeight: number;
  scrollWidth: number;
  clientHeight: number;
  clientWidth: number;
  atTop: boolean;
  atBottom: boolean;
  atLeft: boolean;
  atRight: boolean;
  direction: 'up' | 'down' | 'none';
  scrollPercentage: number;
  scrollDelta: number;
  event: Event;
}

@Directive({
  selector: '[scrollDirection]',
  standalone: true,
})
export class ScrollDirectionDirective implements OnInit, OnDestroy {
  throttleMs = input<number>(0);
  scrollThreshold = input<number>(5);
  enableLogging = input<boolean>(false);
  isDigikalaMode = input<boolean>(true);

  scrolledUp = output<ScrollPayload>();
  scrolledDown = output<ScrollPayload>();
  scrolled = output<ScrollPayload>();

  private lastTop = signal(0);
  private lastLeft = signal(0);
  private isScrolling = signal(false);

  private ticking = false;
  private dispose?: () => void;

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly zone: NgZone,
    private readonly digikalaService: InsDigikalaService,
  ) {
    effect(() => {
      if (this.enableLogging()) {
        console.log('[ScrollDirective] Scrolling state:', this.isScrolling());
      }
    });
  }

  ngOnInit(): void {
    const host = this.el.nativeElement;
    if (!this.isElementScrollable(host)) {
      console.warn('[ScrollDirective] Element is not scrollable. Add overflow styles.');
    }

    this.lastTop.set(host.scrollTop || 0);
    this.lastLeft.set(host.scrollLeft || 0);

    this.zone.runOutsideAngular(() => {
      const handler = (ev: Event) => {
        this.handleScroll(ev, host);
      };
      host.addEventListener('scroll', handler, { passive: true });

      this.dispose = () => {
        host.removeEventListener('scroll', handler as EventListener);
      };
    });
  }

  private handleScroll(ev: Event, host: HTMLElement): void {
    if (this.ticking) {
      return;
    }

    const throttleValue = this.throttleMs();

    const fire = () => {
      this.ticking = false;

      const top = host.scrollTop ?? 0;
      const left = host.scrollLeft ?? 0;
      const previousTop = this.lastTop();

      const scrollDelta = Math.abs(top - previousTop);
      if (scrollDelta < this.scrollThreshold()) {
        return;
      }

      const dir: 'up' | 'down' | 'none' = top > previousTop ? 'down' : top < previousTop ? 'up' : 'none';

      const scrollHeight = host.scrollHeight ?? 0;
      const clientHeight = host.clientHeight ?? 0;
      const scrollableHeight = scrollHeight - clientHeight;
      const scrollPercentage = scrollableHeight > 0 ? (top / scrollableHeight) * 100 : 0;

      const payload: ScrollPayload = {
        top,
        left,
        scrollHeight,
        scrollWidth: host.scrollWidth ?? 0,
        clientHeight,
        clientWidth: host.clientWidth ?? 0,
        atTop: top <= 0,
        atBottom: scrollHeight > 0 && top + clientHeight >= scrollHeight - 1,
        atLeft: left <= 0,
        atRight: host.scrollWidth > 0 && left + host.clientWidth >= host.scrollWidth - 1,
        direction: dir,
        scrollPercentage: Number(scrollPercentage.toFixed(2)),
        scrollDelta,
        event: ev,
      };

      this.isScrolling.set(true);

      this.zone.run(() => {
        this.scrolled.emit(payload);

        if (this.enableLogging()) {
          console.log('[ScrollDirective] Scroll event:', {
            direction: dir,
            position: top,
            percentage: payload.scrollPercentage,
            delta: scrollDelta,
          });
        }

        if (dir === 'down') {
          this.scrolledDown.emit(payload);
          if (this.isDigikalaMode() && this.digikalaService.isDigikalaSuperApp) {
            this.digikalaService.setHeaderState('compact');
          }
        } else if (dir === 'up') {
          this.scrolledUp.emit(payload);
          if (payload.atTop && this.isDigikalaMode() && this.digikalaService.isDigikalaSuperApp) {
            this.digikalaService.setHeaderState('full');
          }
        }
      });

      this.lastTop.set(top < 0 ? 0 : top);
      this.lastLeft.set(left < 0 ? 0 : left);
    };

    if (throttleValue === 0) {
      this.ticking = true;
      requestAnimationFrame(fire);
    } else {
      fire();
    }
  }

  private isElementScrollable(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;

    return overflowY === 'auto' || overflowY === 'scroll' || element === document.body || overflowX === 'auto' || overflowX === 'scroll';
  }

  ngOnDestroy(): void {
    this.dispose?.();
  }
}

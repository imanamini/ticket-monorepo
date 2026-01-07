import { Directive, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { DigikalaHeaderService } from '../../data-access/services/digikala-header.service';
import { fromEvent, Subscription } from 'rxjs';

@Directive({
  selector: '[pillarDigikalaScrollTracker]',
  standalone: true,
})
export class DigikalaScrollTrackerDirective implements OnInit, OnDestroy {
  private digikalaHeaderService = inject(DigikalaHeaderService);
  private elementRef = inject(ElementRef);
  private scrollSubscription?: Subscription;

  ngOnInit(): void {
    // Subscribe to scroll events using fromEvent
    this.scrollSubscription = fromEvent(this.elementRef.nativeElement, 'scroll').subscribe((event: Event) => {
      const target = event.currentTarget as HTMLElement;
      if (target) {
        const scrollTop = target.scrollTop;
        this.digikalaHeaderService.handleScroll(scrollTop);
      }
    });
  }

  ngOnDestroy(): void {
    this.scrollSubscription?.unsubscribe();
  }
}

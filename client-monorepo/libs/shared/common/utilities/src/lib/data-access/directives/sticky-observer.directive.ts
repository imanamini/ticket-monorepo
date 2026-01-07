import { AfterViewInit, Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[commonUtilitiesStickyObserver]',
  standalone: true,
})
export class StickyObserverDirective implements AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit(): void {
    this.handleStickyBehavior();
  }

  handleStickyBehavior(): void {
    const layout = document.getElementsByClassName('main-layout-body')[0];
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 1 && layout.scrollTop > 10) {
          this.renderer.addClass(this.el.nativeElement, 'is-sticky');
        } else {
          this.renderer.removeClass(this.el.nativeElement, 'is-sticky');
        }
      },
      {
        threshold: [1],
        root: layout,
      },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

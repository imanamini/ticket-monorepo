import { AfterViewChecked, Directive, ElementRef, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { map, pairwise, Subscription } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[commonUtilitiesScrolledToEnd]',
  standalone: true,
})
export class ScrolledToEndDirective implements AfterViewChecked, OnInit, OnDestroy {
  scrolledToEnd = output();
  isVisible = signal(false);
  threshold = input<number>(0.1);
  targetElement = signal<HTMLElement | undefined>(undefined);
  subscription!: Subscription;
  observer!: IntersectionObserver;
  constructor(private elementRef: ElementRef) {
    this.subscription = toObservable(this.isVisible)
      .pipe(
        pairwise(),
        map(([oldVal, newVal]) => {
          return { old: oldVal, new: newVal };
        }),
      )
      .subscribe((result) => {
        if (result.new === true && result.old === false) {
          this.scrolledToEnd.emit();
        }
      });
  }

  ngOnInit() {
    this.initDirective();
  }

  ngAfterViewChecked() {
    if (this.elementRef?.nativeElement) {
      const children = this.elementRef.nativeElement.children;
      if (children && children.length) {
        const target = this.findTargetElement(children);
        if (this.targetElement() !== target) {
          if (this.targetElement() && this.targetElement() instanceof Element) {
            this.observer.unobserve(this.targetElement()!);
          }
          if (target) {
            this.targetElement.set(target);
            this.isVisible.set(false);
            this.observer.observe(this.targetElement()!);
          }
        }
      }
    }
  }

  private initDirective(): void {
    this.observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= this.threshold()) {
            this.isVisible.set(true);
          } else {
            this.isVisible.set(false);
          }
        });
      },
      {
        threshold: this.threshold(),
      },
    );
  }

  ngOnDestroy() {
    if (this.targetElement() && this.targetElement() instanceof Element && this.observer) {
      this.observer.unobserve(this.targetElement() as HTMLElement);
    }
    this.subscription.unsubscribe();
  }

  private findTargetElement(elements: HTMLCollection): any {
    const tempElements = Array.prototype.slice.call(elements);
    while (tempElements && tempElements.length) {
      const target = tempElements.pop();
      if (target.offsetHeight) {
        return target;
      }
    }
    return null;
  }
}

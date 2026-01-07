import { Directive, HostListener, inject, OnDestroy, OnInit, output } from '@angular/core';
import { LayoutService } from '../services/layout.service';

@Directive({
  selector: '[commonUtilitiesSafePress]',
  standalone: true,
})
export class SafePressDirective implements OnInit, OnDestroy {
  layoutService = inject(LayoutService);
  safePress = output<void>();
  private downX = 0;
  private downY = 0;

  private isScrolling = false;
  private scrollTimer: any = null;
  private scrollContainer: HTMLElement = this.layoutService.pageScrollContainer;

  ngOnInit() {
    if (!this.scrollContainer) {
      this.scrollContainer = this.layoutService.scrollContainer;
    }
    this.scrollContainer.addEventListener('scroll', this.onScroll, { passive: true });
  }

  @HostListener('pointerdown', ['$event'])
  onDown(event: PointerEvent) {
    this.downX = event.clientX;
    this.downY = event.clientY;
  }

  @HostListener('pointerup', ['$event'])
  onUp(event: PointerEvent) {
    const dx = Math.abs(event.clientX - this.downX);
    const dy = Math.abs(event.clientY - this.downY);

    if (this.isScrolling || dx > 5 || dy > 5) return; // finger moved too much → it's a scroll

    this.safePress.emit();
  }

  onScroll = () => {
    this.isScrolling = true;

    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }

    this.scrollTimer = setTimeout(() => {
      this.isScrolling = false;
    }, 300);
  };

  ngOnDestroy() {
    if (this.scrollContainer) {
      this.scrollContainer.removeEventListener('scroll', this.onScroll);
    }
  }
}

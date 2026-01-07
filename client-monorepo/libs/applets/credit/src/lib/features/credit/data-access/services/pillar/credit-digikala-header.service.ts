import { inject, Injectable } from '@angular/core';
import { DigikalaService } from './digikala.service';
import { AppNameService } from '@client-monorepo/common/utilities';

@Injectable({
  providedIn: 'root',
})
export class CreditDigikalaHeaderService {
  private readonly digikalaService = inject(DigikalaService);
  private readonly appNameService = inject(AppNameService);

  // Scroll tracking state
  private lastScrollTop = 0;
  private scrollThreshold = 0;
  private isHeaderCompact = false;

  // Initialize scroll threshold
  public initScrollThreshold(): void {
    if (this.appNameService.isPillar() && this.digikalaService.isDigikalaSuperApp) {
      this.scrollThreshold = this.digikalaService.getScrollThreshold();
    }
  }

  // Handle scroll events from any component
  public handleScroll(currentScrollTop: number): void {
    if (!this.appNameService.isPillar() || !this.digikalaService.isDigikalaSuperApp) {
      return;
    }

    // If at the top of the page, always show full header
    if (currentScrollTop === 0) {
      if (this.isHeaderCompact) {
        this.digikalaService.setHeaderState('full');
        this.isHeaderCompact = false;
      }
      this.lastScrollTop = currentScrollTop;
      return;
    }

    // Detect scroll direction
    const isScrollingDown = currentScrollTop > this.lastScrollTop;

    // Check if we've scrolled past the threshold
    const isPastThreshold = currentScrollTop > this.scrollThreshold;

    if (isScrollingDown && isPastThreshold && !this.isHeaderCompact) {
      // Scrolling down past threshold - make header compact
      this.digikalaService.setHeaderState('compact');
      this.isHeaderCompact = true;
    }

    this.lastScrollTop = currentScrollTop;
  }

  // Reset scroll state (called on route changes or when needed)
  public resetScrollState(): void {
    if (!this.appNameService.isPillar() || !this.digikalaService.isDigikalaSuperApp) {
      return;
    }

    this.lastScrollTop = 0;
    this.isHeaderCompact = false;
    this.digikalaService.setHeaderState('full');
  }
}

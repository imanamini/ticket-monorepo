import { Component, effect, Inject, input, OnDestroy, output, PLATFORM_ID, signal } from '@angular/core';
import { SupportFaqService } from '../support-faq.service';
import { FaqCategory } from '../../../../../../api/clients/models/support/faq-category';
import { isPlatformBrowser, NgStyle } from '@angular/common';

@Component({
  selector: 'app-faq-categories',
  templateUrl: './faq-categories.component.html',
  styleUrls: ['./faq-categories.component.scss'],
  standalone: true,
  imports: [NgStyle],
})
export class FaqCategoriesComponent implements OnDestroy {
  isFirstTime = input<boolean>(false); // Kept as input signal
  childrenListEvent = output<FaqCategory>();

  categories = signal<FaqCategory[]>([]);
  viewingMore = signal(false);
  visibleItemsCount = signal(6);
  firstTimeInternal = signal<boolean>(false); // Internal signal to track first-time state

  private resizeListener: () => void;

  constructor(
    private service: SupportFaqService,
    @Inject(PLATFORM_ID) public platformId: string,
  ) {
    this.resizeListener = this.checkScreenSize.bind(this);
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.resizeListener);
      this.checkScreenSize();
    }
    // Effect to handle category subscription, screen size checking, and initialize firstTimeInternal
    effect(
      () => {
        // Initialize firstTimeInternal with isFirstTime input value
        this.firstTimeInternal.set(this.isFirstTime());

        // Subscribe to categories
        this.service.categories.asObservable().subscribe((categories) => {
          const newCategories: FaqCategory[] = [];
          if (categories.length) {
            for (const category of categories) {
              if (!category.parentId) {
                newCategories.push({
                  ...category,
                  entriesCount: this.firstTimeInternal()
                    ? category.children.reduce((sum, child) => sum + child.entriesCount, category.entriesCount)
                    : category.entriesCount,
                });
              }
            }
          }
          this.categories.set(newCategories);
        });
      },
      { allowSignalWrites: true },
    );
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  checkScreenSize(): void {
    if (isPlatformBrowser(this.platformId)) {
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      this.visibleItemsCount.set(isMobile ? 3 : 6);
    }
  }

  onViewMoreClick() {
    this.viewingMore.set(!this.viewingMore());
  }

  onParentClick(category: FaqCategory) {
    this.service.viewCategory(category, 'body-start');
    this.childrenListEvent.emit(category);
    this.firstTimeInternal.set(false); // Update internal signal instead of input signal
  }
}

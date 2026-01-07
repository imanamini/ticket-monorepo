import { Injectable } from '@angular/core';
import { SupportClient } from '../../../../../api/clients/support-client';
import { BehaviorSubject, delay, Observable, of, ReplaySubject } from 'rxjs';
import { FaqCategory } from '../../../../../api/clients/models/support/faq-category';
import { FaqItem } from '../../../../../api/clients/models/support/faq-item';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SupportFaqService {
  /**
   * Data
   */
  faqItems: BehaviorSubject<FaqItem[]> = new BehaviorSubject([]);

  categories: BehaviorSubject<FaqCategory[]> = new BehaviorSubject([]);

  categoriesMap: BehaviorSubject<{
    [key: string]: FaqCategory;
  }> = new BehaviorSubject({});

  mostViewedCategories: BehaviorSubject<FaqCategory[]> = new BehaviorSubject([]);

  searchTitle: BehaviorSubject<string> = new BehaviorSubject('');

  /**
   * Flags
   */
  initialized: ReplaySubject<boolean> = new ReplaySubject(1);

  loadingEntries: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * Search Parameters
   */
  keyword: BehaviorSubject<string> = new BehaviorSubject('');

  selectedCategoryId: BehaviorSubject<string> = new BehaviorSubject('');

  selectedItemId: BehaviorSubject<string> = new BehaviorSubject('');

  initialLoad = true;

  constructor(
    private client: SupportClient,
    private router: Router,
    private scroller: ViewportScroller,
  ) {}

  initialize() {
    this.client.getFaqCategories().subscribe((res) => {
      this.categories.next(res.categories);
      this.mostViewedCategories.next(res.mostViewed);

      const map = {};
      res.categories.forEach((c) => {
        map[c.id] = c;
      });
      this.categoriesMap.next(map);
    });
  }

  search(id = 'body-start') {
    const keyword = this.keyword.getValue();
    const categoryId = this.selectedCategoryId.getValue();

    this.loadingEntries.next(true);
    this.client.searchFaqItems(keyword, categoryId, '0').subscribe((response) => {
      this.faqItems.next(response.items);
      this.searchTitle.next(response.title);
      this.initialized.next(true);
      this.loadingEntries.next(false);
      if (this.initialLoad && !keyword && !categoryId) {
        this.initialLoad = false;
        return;
      }
      of('')
        .pipe(delay(20))
        .subscribe({
          next: () => {
            this.scrollToItems(id);
          },
        });
    });
  }

  searchByKeyword(keyword: string): Observable<{
    items: FaqItem[];
    title: string;
  }> {
    return this.client.searchFaqItems(keyword, null, '1');
  }

  sendReadSignal(itemId: string): void {
    this.client.sendItemReadSignal(itemId).subscribe((res) => {});
  }

  viewKeyword(keyword: string): void {
    this.router.navigate([], {
      queryParams: {
        categoryId: null,
        itemId: null,
        keyword,
      },
    });
  }

  viewItem(faqItem: FaqItem): void {
    const itemId = this.selectedItemId.getValue();
    if (itemId === faqItem.id) {
      // already viewing this item
      this.scroller.scrollToAnchor('body-start');
    } else {
      this.router.navigate([], {
        queryParams: {
          categoryId: faqItem.categoryId,
          itemId: faqItem.id,
          keyword: null,
        },
      });
    }
  }

  viewCategory(category: FaqCategory, id = 'body-start'): void {
    this.router.navigate([], {
      queryParams: {
        categoryId: category.id,
        itemId: null,
        keyword: null,
      },
    });
  }

  scrollToItems(id: string): void {
    const itemId = this.selectedItemId.getValue();
    if (itemId) {
      return;
    }
    this.scroller.scrollToAnchor(id);
  }
}

import { Injectable, OnDestroy } from '@angular/core';
import { SupportFaqService } from '../pages/support/support-faq/support-faq/support-faq.service';
import { FaqItem } from '../../api/clients/models/templates/services/faq';
import { BehaviorSubject, delay, Observable, of, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FaqService implements OnDestroy {
  initialized = false;

  faqItems: BehaviorSubject<FaqItem[]> = new BehaviorSubject(undefined);

  subscriptions: Subscription[] = [];

  constructor(
    private service: SupportFaqService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }

  getFaqFromSupport(categoryId: string): Observable<any> {
    if (!categoryId) return;
    this.subscriptions[0] = this.service.initialized.asObservable().subscribe((initialized) => {
      this.initialized = initialized;
    });

    this.subscriptions[3] = this.service.faqItems.asObservable().subscribe((items) => {
      const faqItems = items.map((i) => {
        return {
          question: i.question,
          snippet: '',
          answer: i.body,
          itemId: i.id,
        };
      });
      this.faqItems.next(faqItems);
    });

    this.subscriptions[4] = this.activatedRoute.queryParams.subscribe((params) => {
      if (params.keyword) {
        this.service.keyword.next(params.keyword);
      } else {
        this.service.keyword.next('');
      }

      this.service.selectedCategoryId.next(categoryId);

      if (params.itemId) {
        this.service.selectedItemId.next(params.itemId);
      } else {
        this.service.selectedItemId.next('');
      }
    });
    of('')
      .pipe(delay(50))
      .subscribe({
        next: () => {
          this.service.search();
        },
      });
    this.service.initialize();

    return this.faqItems;
  }
}

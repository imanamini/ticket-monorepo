import { Component, OnDestroy, OnInit } from '@angular/core';
import { FaqItem } from '../../../../../api/clients/models/templates/services/faq';
import { SupportFaqService } from './support-faq.service';
import { ActivatedRoute } from '@angular/router';
import { delay, of, Subscription } from 'rxjs';
import { FaqCategory } from '../../../../../api/clients/models/support/faq-category';
import { UiSpinnerComponent } from '../../../../../ui/ui-components/ui-loading/ui-spinner/ui-spinner.component';
import { UiFaqComponent } from '../../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { FaqChildrenComponent } from './faq-children/faq-children.component';
import { FaqCategoriesComponent } from './faq-categories/faq-categories.component';
import { NgIf } from '@angular/common';
import { FaqHeaderComponent } from './faq-header/faq-header.component';
import { BaseLayoutComponent } from '../../../../layout/base-layout/base-layout.component';

@Component({
  selector: 'app-support-faq',
  templateUrl: './support-faq.component.html',
  styleUrls: ['./support-faq.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    FaqHeaderComponent,
    NgIf,
    FaqCategoriesComponent,
    FaqChildrenComponent,
    UiFaqComponent,
    UiSpinnerComponent,
  ],
})
export class SupportFaqComponent implements OnInit, OnDestroy {
  faqItems: FaqItem[] = [];

  searchTitle = '';

  initialized = false;

  loadingEntries = false;

  subscriptions: Subscription[] = [];

  readItems: string[] = [];

  parentList = true;
  childrenList = false;
  isFirstTime = true;
  category: FaqCategory;

  constructor(
    private service: SupportFaqService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.subscriptions[0] = this.service.initialized.asObservable().subscribe((initialized) => {
      this.initialized = initialized;
    });

    this.subscriptions[1] = this.service.loadingEntries.asObservable().subscribe((loadingEntries) => {
      this.loadingEntries = loadingEntries;
    });

    this.subscriptions[2] = this.service.searchTitle.asObservable().subscribe((title) => {
      this.searchTitle = title;
    });

    this.subscriptions[3] = this.service.faqItems.asObservable().subscribe((items) => {
      this.faqItems = items.map((i) => {
        return {
          question: i.question,
          snippet: '',
          answer: i.body,
          itemId: i.id,
        };
      });
    });

    this.subscriptions[4] = this.activatedRoute.queryParams.subscribe((params) => {
      if (params.keyword) {
        this.service.keyword.next(params.keyword);
      } else {
        this.service.keyword.next('');
      }

      if (params.categoryId) {
        this.service.selectedCategoryId.next(params.categoryId);
      } else {
        this.service.selectedCategoryId.next('');
      }

      if (params.itemId) {
        this.service.selectedItemId.next(params.itemId);
      } else {
        this.service.selectedItemId.next('');
      }
      of('')
        .pipe(delay(50))
        .subscribe({
          next: () => {
            if ((this.isFirstTime && this.handAnchorId() == 'body-start') || this.handAnchorId() == 'child-start') {
              this.service.search(this.handAnchorId());
            }
          },
        });
    });
    this.service.initialize();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => {
      if (s) {
        s.unsubscribe();
      }
    });
  }

  onItemOpen(item: FaqItem) {
    if (this.readItems.indexOf(item.itemId) < 0) {
      this.service.sendReadSignal(item.itemId);
      this.readItems.push(item.itemId);
    }
  }

  onHandleChildren(category: FaqCategory) {
    this.isFirstTime = true;
    if (category.children.length) {
      this.parentList = false;
      this.category = category;
      this.childrenList = true;
    }
  }

  backToParents(value: boolean) {
    this.childrenList = !value;
    this.parentList = value;
    this.isFirstTime = !value;
  }

  handAnchorId() {
    return this.parentList ? 'body-start' : 'child-start';
  }
}

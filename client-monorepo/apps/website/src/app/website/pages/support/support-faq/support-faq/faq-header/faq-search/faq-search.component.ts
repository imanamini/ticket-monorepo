import { Component, OnInit } from '@angular/core';
import { delay, of, Subscription } from 'rxjs';
import { SupportFaqService } from '../../support-faq.service';
import { Router } from '@angular/router';
import { FaqItem } from '../../../../../../../api/clients/models/support/faq-item';
import { FaqCategory } from '../../../../../../../api/clients/models/support/faq-category';
import { NgIf, NgFor, NgStyle } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-faq-search',
  templateUrl: './faq-search.component.html',
  styleUrls: ['./faq-search.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf, NgFor, NgStyle],
})
export class FaqSearchComponent implements OnInit {
  searchKeyword = '';

  searchTimeout = null;

  searchRequest: Subscription = null;

  suggestions: FaqItem[] = [];

  categoriesMap: {
    [key: string]: FaqCategory;
  } = {};

  searching = false;

  constructor(
    private service: SupportFaqService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.service.keyword.asObservable().subscribe((keyword) => {
      this.searchKeyword = keyword;
    });

    this.service.categoriesMap.asObservable().subscribe((categoriesMap) => {
      this.categoriesMap = categoriesMap;
    });
  }

  onInputChange(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    if (!this.searchKeyword) {
      return;
    }

    this.searchTimeout = of('')
      .pipe(delay(1000))
      .subscribe({
        next: () => {
          this.performSearch();
        },
      });
  }

  onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearchButtonClick();
      return;
    }
  }

  clearSearch(clearKeyword = false) {
    if (this.searchRequest) {
      this.searchRequest.unsubscribe();
    }
    clearTimeout(this.searchTimeout);
    this.suggestions = [];
    if (clearKeyword) {
      this.searchKeyword = '';
      this.router.navigate([], {
        queryParams: {
          keyword: null,
          categoryId: null,
          itemId: null,
        },
      });
    }
  }

  onSearchButtonClick() {
    if (!this.searchKeyword || this.searching) {
      return;
    }

    this.clearSearch(false);

    this.service.viewKeyword(this.searchKeyword);
  }

  entryClicked(item: FaqItem) {
    this.clearSearch(false);
    this.searchKeyword = '';
    this.service.viewItem(item);
  }

  private performSearch() {
    if (!this.searchKeyword) {
      return;
    }
    if (this.searchRequest) {
      this.searchRequest.unsubscribe();
    }

    this.searchRequest = this.service.searchByKeyword(this.searchKeyword).subscribe((res) => {
      this.suggestions = res.items;
    });
  }
}

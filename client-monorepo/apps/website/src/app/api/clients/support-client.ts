import { BaseHttpClient } from '../base-http-client';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FaqCategory } from './models/support/faq-category';
import { FaqItem } from './models/support/faq-item';

@Injectable({
  providedIn: 'root',
})
export class SupportClient extends BaseHttpClient {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  getFaqCategories(): Observable<{
    categories: FaqCategory[];
    mostViewed: FaqCategory[];
  }> {
    return super.get(`/api/support/public/faq/categories`);
  }

  searchFaqItems(
    keyword: string,
    categoryId: string,
    suggestion: string,
  ): Observable<{
    items: FaqItem[];
    title: string;
  }> {
    return super.get(`/api/support/public/faq/search`, {
      keyword,
      categoryId,
      suggestion,
    });
  }

  sendItemReadSignal(itemId: string): Observable<any> {
    return super.put('/api/support/public/faq/' + itemId + '/read');
  }
}

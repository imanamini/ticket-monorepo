import { Injectable } from '@angular/core';
import { PageClient } from '../../api/clients/page-client';
import { FaqService } from './faq.service';
import { Observable } from 'rxjs';
import { SeoService } from './seo.service';

@Injectable({
  providedIn: 'root',
})
export class PageDataService {
  constructor(
    private pageClient: PageClient,
    private faqService: FaqService,
    private seo: SeoService,
  ) {}

  getPageData(prefix: string, slug: string): Observable<any> {
    return new Observable((subscriber) => {
      this.pageClient.getPage(prefix, slug).subscribe((response) => {
        this.seo.setGlobalMetaTagsFromPage(response.page);
        subscriber.next(response);

        if (this.doesPageDataHasFaqId(response)) {
          this.faqService.getFaqFromSupport(response.page.templateData.faq.categoryId).subscribe((faqs) => {
            const newPageData = JSON.parse(JSON.stringify(response));
            newPageData.page.templateData.faq.faqItems = faqs;
            subscriber.next(newPageData);
          });
        }
      });
    });
  }

  doesPageDataHasFaqId(pageData) {
    return pageData.page.templateData.faq && pageData.page.templateData.faq.categoryId;
  }
}

import { Component, effect, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { PageClient } from '../../../api/clients/page-client';
import { SeoService } from '../../services/seo.service';
import { Page } from '../../../api/clients/models/content/page';
import { InsurtechTemplateData } from '../../../api/clients/models/templates/insurtech/insurtech-template-data';
import { BlogPost } from '../../../api/clients/models/content/blog-post';
import { FaqService } from '../../services/faq.service';
import { FaqItem } from '../../../api/clients/models/templates/services/faq';
import { BlogCardsComponent } from '../../../ui/ui-components/ui-blog-post-section/blog-cards/blog-cards.component';
import { UiFaqComponent } from '../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiSeoComponent } from '../../../ui/ui-components/ui-seo/ui-seo/ui-seo.component';
import { UiSimilarServicesComponent } from '../../../ui/ui-components/ui-similar-services/ui-similar-services/ui-similar-services.component';
import { InsurtechInquiryComponent } from './insurtech-inquiry/insurtech-inquiry.component';
import { InsurtechServicesProcessesComponent } from './insurtech-services-processes/insurtech-services-processes.component';
import { UiSectionBenefitsComponent } from '../../../ui/ui-components/ui-section-benefits/ui-section-benefits/ui-section-benefits.component';
import { InsurtechRecoverableDamagesComponent } from './insurtech-recoverable-damages/insurtech-recoverable-damages.component';
import { InsurtechIntroComponent } from './insurtech-intro/insurtech-intro.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-insurtech',
  templateUrl: './insurtech.component.html',
  styleUrls: ['./insurtech.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    InsurtechIntroComponent,
    InsurtechRecoverableDamagesComponent,
    UiSectionBenefitsComponent,
    InsurtechServicesProcessesComponent,
    InsurtechInquiryComponent,
    UiSimilarServicesComponent,
    UiSeoComponent,
    UiFaqComponent,
    BlogCardsComponent,
  ],
})
export class InsurtechComponent implements OnInit {
  insurtechPage = signal<Page<InsurtechTemplateData> | undefined>(undefined);
  posts = signal<BlogPost[]>([]);
  loaded = signal(false);
  faqItems = signal<FaqItem[]>([]);

  constructor(
    private pageClient: PageClient,
    private seo: SeoService,
    @Inject(PLATFORM_ID) public platformId: string,
    private faqService: FaqService,
  ) {
    // Effect to handle page data loading
    effect(
      () => {
        if (this.insurtechPage()) {
          this.seo.setGlobalMetaTagsFromPage(this.insurtechPage()!);
          if (this.insurtechPage()?.templateData.faq.categoryId) {
            this.faqService.getFaqFromSupport(this.insurtechPage()!.templateData.faq.categoryId).subscribe((res) => {
              this.faqItems.set(res);
            });
          }
        }
      },
      {
        allowSignalWrites: true,
      },
    );
  }

  ngOnInit(): void {
    this.pageClient.getPage('insurtech', 'equipment').subscribe((res) => {
      this.insurtechPage.set(res.page);
      this.posts.set(res.posts);
      of('')
        .pipe(delay(500))
        .subscribe({
          next: () => {
            this.loaded.set(true);
          },
        });
    });

    if (isPlatformBrowser(this.platformId)) {
      const analytics = document.createElement('script');
      analytics.setAttribute('src', '/assets/scripts/insurtech-analytics.js');

      const analyticsAsync = document.createElement('script');
      analyticsAsync.async = true;
      analyticsAsync.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=G-2Z3E8L3323');

      document.body.appendChild(analytics);
      document.body.appendChild(analyticsAsync);
    }
  }
}

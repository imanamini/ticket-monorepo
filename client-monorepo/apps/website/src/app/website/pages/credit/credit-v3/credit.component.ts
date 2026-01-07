import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { PageClient } from '../../../../api/clients/page-client';
import { CreditClient } from '../../../../api/clients/credit/credit-client';
import { CreditPageTemplateData } from '../../../../api/clients/models/templates/credit-v3/credit-config.response';
import { SeoService } from '../../../services/seo.service';
import { BlogPost } from '../../../../api/clients/models/content/blog-post';
import { Router } from '@angular/router';
import { Page } from '../../../../api/clients/models/content/page';
import { FaqService } from '../../../services/faq.service';
import { FaqItem } from '../../../../api/clients/models/templates/services/faq';
import { CreditIntroCtaConfig } from '../../../../ui/models/credit/credit-intro-cta.interface';
import { UiFaqComponent } from '../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiSeoComponent } from '../../../../ui/ui-components/ui-seo/ui-seo/ui-seo.component';
import { CreditStoresComponent } from '../../../../ui/ui-components/ui-credit/credit-stores/credit-stores.component';
import { CreditPlansTypesComponent } from './credit-plans-types/credit-plans-types.component';
import { CreditIntroComponent } from '../../../../ui/ui-components/ui-credit/credit-intro/credit-intro.component';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    NgIf,
    CreditIntroComponent,
    CreditPlansTypesComponent,
    CreditStoresComponent,
    UiSeoComponent,
    UiFaqComponent,
  ],
})
export class CreditComponent implements OnInit {
  creditPage!: Page<CreditPageTemplateData>;

  creditIntroCta: {
    firstCta: CreditIntroCtaConfig;
    secondCta: CreditIntroCtaConfig;
  };

  posts: BlogPost[] = [];

  loaded = false;

  faqItems: FaqItem[] = [];

  constructor(
    @Inject(PLATFORM_ID) public platformId: string,
    private router: Router,
    private pageClient: PageClient,
    private credit: CreditClient,
    private seo: SeoService,
    private faqService: FaqService,
  ) {}

  ngOnInit(): void {
    this.creditIntroCta = {
      firstCta: {
        isCustom: false,
        hasScrollToElement: false,
      },
      secondCta: {
        isCustom: false,
        hasScrollToElement: true,
        scrollToElementId: 'credit-plans',
        scrollOption: 'center',
      },
    };

    this.pageClient.getPage('p', 'maincredit').subscribe((res) => {
      this.creditPage = res.page;
      this.seo.setGlobalMetaTagsFromPage(res.page);
      if (res.page.templateData.faq.categoryId) {
        this.faqService.getFaqFromSupport(res.page.templateData.faq.categoryId).subscribe((res) => {
          this.faqItems = res;
          of('')
            .pipe(delay(500))
            .subscribe({
              next: () => {
                this.loaded = true;
              },
            });
        });
      } else {
        of('')
          .pipe(delay(500))
          .subscribe({
            next: () => {
              this.loaded = true;
            },
          });
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      const chat = document.createElement('script');
      chat.src = '/assets/scripts/credit-goftino.js';
      document.body.appendChild(chat);
    }
  }
}

import { Component, effect, Inject, PLATFORM_ID, signal } from '@angular/core';
import { Page } from '../../../api/clients/models/content/page';
import { IpgTemplateData } from '../../../api/clients/models/templates/ipg/ipg-template-data';
import { SeoService } from '../../services/seo.service';
import { PageClient } from '../../../api/clients/page-client';
import { BlogPost } from '../../../api/clients/models/content/blog-post';
import { BlogCardsComponent } from '../../../ui/ui-components/ui-blog-post-section/blog-cards/blog-cards.component';
import { UiFaqComponent } from '../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiSeoComponent } from '../../../ui/ui-components/ui-seo/ui-seo/ui-seo.component';
import { UiDocumentComponent } from '../../../ui/ui-components/ui-document/ui-document/ui-document.component';
import { IpgOurCustomersComponent } from './ipg-our-customers/ipg-our-customers.component';
import { IpgPaymentServiceProvidersComponent } from './ipg-payment-service-providers/ipg-payment-service-providers.component';
import { UiBasicSegmentComponent } from '../../../ui/ui-components/ui-basic-segment/ui-basic-segment/ui-basic-segment.component';
import { UiFeatureCardsComponent } from '../../../ui/ui-components/ui-feature-cards/ui-feature-cards/ui-feature-cards.component';
import { UiButtonComponent } from '../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiIntroductionDefaultComponent } from '../../../ui/ui-components/ui-introduction-default/ui-introduction-default/ui-introduction-default.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';
import { ScrollToAnchorDirective } from '../../../ui/ui-directive/scroll-to-anchor.directive';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-ipg',
  templateUrl: './ipg.component.html',
  styleUrls: ['./ipg.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    UiIntroductionDefaultComponent,
    UiButtonComponent,
    UiFeatureCardsComponent,
    UiBasicSegmentComponent,
    IpgPaymentServiceProvidersComponent,
    IpgOurCustomersComponent,
    UiDocumentComponent,
    UiSeoComponent,
    UiFaqComponent,
    BlogCardsComponent,
    ScrollToAnchorDirective,
  ],
})
export class IpgComponent {
  ipgPage = signal<Page<IpgTemplateData> | undefined>(undefined);
  posts = signal<BlogPost[]>([]);
  scrollAnchor = signal('document');
  loaded = signal(false);

  constructor(
    private seo: SeoService,
    private pageClient: PageClient,
    @Inject(PLATFORM_ID) public platformId: string,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const chat = document.createElement('script');
      chat.src = '/assets/scripts/ipg-bpg-goftino.js';
      document.body.appendChild(chat);
    }
    // Effect to handle page data fetching and initialization
    effect(
      () => {
        this.pageClient.getPage('p', 'ipg').subscribe((res) => {
          this.ipgPage.set(res.page);
          this.posts.set(res.posts);
          this.seo.setGlobalMetaTagsFromPage(res.page);
          of('')
            .pipe(delay(500))
            .subscribe({
              next: () => {
                this.loaded.set(true);
              },
            });
        });
      },
      {
        allowSignalWrites: true,
      },
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { PageClient } from '../../../api/clients/page-client';
import { Page } from '../../../api/clients/models/content/page';
import { SubscriptionTemplateData } from '../../../api/clients/models/templates/subscription/subscription-template-data';
import { BlogPost } from '../../../api/clients/models/content/blog-post';
import { BlogCardsComponent } from '../../../ui/ui-components/ui-blog-post-section/blog-cards/blog-cards.component';
import { UiFaqComponent } from '../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiSeoComponent } from '../../../ui/ui-components/ui-seo/ui-seo/ui-seo.component';
import { UiTariffComponent } from '../../../ui/ui-components/ui-tariff/ui-tariff/ui-tariff.component';
import { SubscriptionSupportedBanksComponent } from './subscription-supported-banks/subscription-supported-banks.component';
import { UiBasicSegmentComponent } from '../../../ui/ui-components/ui-basic-segment/ui-basic-segment/ui-basic-segment.component';
import { UiFeatureCardsComponent } from '../../../ui/ui-components/ui-feature-cards/ui-feature-cards/ui-feature-cards.component';
import { UiButtonComponent } from '../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiIntroductionDefaultComponent } from '../../../ui/ui-components/ui-introduction-default/ui-introduction-default/ui-introduction-default.component';
import { NgIf } from '@angular/common';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    NgIf,
    UiIntroductionDefaultComponent,
    UiButtonComponent,
    UiFeatureCardsComponent,
    UiBasicSegmentComponent,
    SubscriptionSupportedBanksComponent,
    UiTariffComponent,
    UiSeoComponent,
    UiFaqComponent,
    BlogCardsComponent,
  ],
})
export class SubscriptionComponent implements OnInit {
  subscriptionPage!: Page<SubscriptionTemplateData>;

  posts: BlogPost[] = [];

  loaded = false;

  constructor(
    private seo: SeoService,
    private pageClient: PageClient,
  ) {}

  ngOnInit(): void {
    this.pageClient.getPage('p', 'sub').subscribe((res) => {
      this.subscriptionPage = res.page;
      this.posts = res.posts;
      this.seo.setGlobalMetaTagsFromPage(res.page);
      of('')
        .pipe(delay(500))
        .subscribe({
          next: () => {
            this.loaded = true;
          },
        });
    });
  }
}

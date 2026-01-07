import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { PageClient } from '../../../api/clients/page-client';
import { Page } from '../../../api/clients/models/content/page';
import { PardakhtyarTemplateData } from '../../../api/clients/models/templates/pardakhtyar/pardakhtyar-template-data';
import { BlogPost } from '../../../api/clients/models/content/blog-post';
import { BlogCardsComponent } from '../../../ui/ui-components/ui-blog-post-section/blog-cards/blog-cards.component';
import { UiFaqComponent } from '../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiSeoComponent } from '../../../ui/ui-components/ui-seo/ui-seo/ui-seo.component';
import { UiDocumentComponent } from '../../../ui/ui-components/ui-document/ui-document/ui-document.component';
import { UiTimelineComponent } from '../../../ui/ui-components/ui-timeline/ui-timeline/ui-timeline.component';
import { UiTariffComponent } from '../../../ui/ui-components/ui-tariff/ui-tariff/ui-tariff.component';
import { UiBasicSegmentComponent } from '../../../ui/ui-components/ui-basic-segment/ui-basic-segment/ui-basic-segment.component';
import { UiFeatureCardsComponent } from '../../../ui/ui-components/ui-feature-cards/ui-feature-cards/ui-feature-cards.component';
import { UiButtonComponent } from '../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiIntroductionDefaultComponent } from '../../../ui/ui-components/ui-introduction-default/ui-introduction-default/ui-introduction-default.component';
import { NgIf } from '@angular/common';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-pardakhtyar',
  templateUrl: './pardakhtyar.component.html',
  styleUrls: ['./pardakhtyar.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    NgIf,
    UiIntroductionDefaultComponent,
    UiButtonComponent,
    UiFeatureCardsComponent,
    UiBasicSegmentComponent,
    UiTariffComponent,
    UiTimelineComponent,
    UiDocumentComponent,
    UiSeoComponent,
    UiFaqComponent,
    BlogCardsComponent,
  ],
})
export class PardakhtyarComponent implements OnInit {
  pdyPage!: Page<PardakhtyarTemplateData>;

  posts: BlogPost[] = [];

  loaded = false;

  constructor(
    private seo: SeoService,
    private pageClient: PageClient,
  ) {}

  ngOnInit(): void {
    this.pageClient.getPage('p', 'pdy').subscribe((res) => {
      this.pdyPage = res.page;
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

import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { PageClient } from '../../../../api/clients/page-client';
import { Page } from '../../../../api/clients/models/content/page';
import { BnplTemplateData } from '../../../../api/clients/models/templates/bnpl/bnpl-template-data';
import { ContactForm } from '../../../../api/clients/models/templates/contact-us/contact-form';
import { ActivatedRoute } from '@angular/router';
import { BlogPost } from '../../../../api/clients/models/content/blog-post';
import { BlogCardsComponent } from '../../../../ui/ui-components/ui-blog-post-section/blog-cards/blog-cards.component';
import { UiFaqComponent } from '../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiContactSectionComponent } from '../../../../ui/ui-components/ui-contact/ui-contact-section/ui-contact-section.component';
import { UiHorizontalFlowComponent } from '../../../../ui/ui-components/ui-horizontal-flow/ui-horizontal-flow/ui-horizontal-flow.component';
import { UiFeatureCardsComponent } from '../../../../ui/ui-components/ui-feature-cards/ui-feature-cards/ui-feature-cards.component';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiIntroductionDefaultComponent } from '../../../../ui/ui-components/ui-introduction-default/ui-introduction-default/ui-introduction-default.component';
import { NgIf } from '@angular/common';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-bnpl',
  templateUrl: './bnpl.component.html',
  styleUrls: ['./bnpl.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    NgIf,
    UiIntroductionDefaultComponent,
    UiButtonComponent,
    UiFeatureCardsComponent,
    UiHorizontalFlowComponent,
    UiContactSectionComponent,
    UiFaqComponent,
    BlogCardsComponent,
  ],
})
export class BnplComponent implements OnInit {
  bnplPage!: Page<BnplTemplateData>;

  contactForm!: ContactForm;

  posts: BlogPost[] = [];

  loaded = false;

  constructor(
    private seo: SeoService,
    private pageClient: PageClient,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.getPageData(data['prefix'], data['slug']);
    });
  }

  private getPageData(prefix: string, slug: string) {
    this.pageClient.getPage(prefix, slug).subscribe((res) => {
      this.bnplPage = res.page;
      this.posts = res.posts;
      this.contactForm = res.contactForms[0];
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

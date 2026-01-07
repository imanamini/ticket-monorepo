import { Component, OnInit } from '@angular/core';
import { Page } from '../../../../api/clients/models/content/page';
import { BlogPost } from '../../../../api/clients/models/content/blog-post';
import { SeoService } from '../../../services/seo.service';
import { PageClient } from '../../../../api/clients/page-client';
import { ContactForm } from '../../../../api/clients/models/templates/contact-us/contact-form';
import { OBnplTemplateData } from '../../../../api/clients/models/templates/o-bnpl/o-bnpl-template-data';
import { BlogCardsComponent } from '../../../../ui/ui-components/ui-blog-post-section/blog-cards/blog-cards.component';
import { UiFaqComponent } from '../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { OBnplFormComponent } from './o-bnpl-form/o-bnpl-form.component';
import { OBnplCustomersComponent } from './o-bnpl-customers/o-bnpl-customers.component';
import { UiValueSectionComponent } from '../../../../ui/ui-components/ui-value-cards/ui-value-section/ui-value-section.component';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiIntroductionDefaultComponent } from '../../../../ui/ui-components/ui-introduction-default/ui-introduction-default/ui-introduction-default.component';
import { NgIf } from '@angular/common';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';
import {ScrollToAnchorDirective} from "../../../../ui/ui-directive/scroll-to-anchor.directive";

@Component({
  selector: 'app-o-bnpl',
  templateUrl: './o-bnpl.component.html',
  styleUrls: ['./o-bnpl.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    NgIf,
    UiIntroductionDefaultComponent,
    UiButtonComponent,
    UiValueSectionComponent,
    OBnplCustomersComponent,
    OBnplFormComponent,
    UiFaqComponent,
    BlogCardsComponent,
    ScrollToAnchorDirective,
  ],
})
export class OBnplComponent implements OnInit {
  bnplPage!: Page<OBnplTemplateData>;

  contactForm!: ContactForm;

  posts: BlogPost[] = [];

  loaded = false;

  constructor(
    private seo: SeoService,
    private pageClient: PageClient,
  ) {}

  ngOnInit(): void {
    this.pageClient.getPage('credit', 'orgbnpl').subscribe((res) => {
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

import { Component, OnInit } from '@angular/core';
import { Page } from '../../../../api/clients/models/content/page';
import { OCreditTemplateData } from '../../../../api/clients/models/templates/o-credit/o-credit-template-data';
import { ContactForm } from '../../../../api/clients/models/templates/contact-us/contact-form';
import { SeoService } from '../../../services/seo.service';
import { PageClient } from '../../../../api/clients/page-client';
import { OCreditFormComponent } from './o-credit-form/o-credit-form.component';
import { OCreditTabsComponent } from './o-credit-tabs/o-credit-tabs.component';
import { UiContentNavComponent } from '../../../../ui/ui-components/ui-content-nav/ui-content-nav/ui-content-nav.component';
import { ScrollToAnchorDirective } from '../../../../ui/ui-directive/scroll-to-anchor.directive';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiIntroductionDefaultComponent } from '../../../../ui/ui-components/ui-introduction-default/ui-introduction-default/ui-introduction-default.component';
import { NgIf } from '@angular/common';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-o-credit',
  templateUrl: './o-credit.component.html',
  styleUrls: ['./o-credit.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    NgIf,
    UiIntroductionDefaultComponent,
    UiButtonComponent,
    ScrollToAnchorDirective,
    UiContentNavComponent,
    OCreditTabsComponent,
    OCreditFormComponent,
  ],
})
export class OCreditComponent implements OnInit {
  creditPage!: Page<OCreditTemplateData>;

  contactForm!: ContactForm;

  loaded = false;

  constructor(
    private seo: SeoService,
    private pageClient: PageClient,
  ) {}

  ngOnInit(): void {
    this.pageClient.getPage('credit', 'organization').subscribe((res) => {
      this.creditPage = res.page;
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

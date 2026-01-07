import { Component, OnInit } from '@angular/core';
import { PageClient } from '../../../api/clients/page-client';
import { Page } from '../../../api/clients/models/content/page';
import { ContactUsTemplate } from '../../../api/clients/models/templates/contact-us/contact-us-template';
import { SeoService } from '../../services/seo.service';
import { ContactForm } from '../../../api/clients/models/templates/contact-us/contact-form';
import { ContactUsMapComponent } from './contact-us-map/contact-us-map.component';
import { ContactUsVacactionComponent } from './contact-us-vacaction/contact-us-vacaction.component';
import { UiContactSectionComponent } from '../../../ui/ui-components/ui-contact/ui-contact-section/ui-contact-section.component';
import { NgIf } from '@angular/common';
import { ContactUsIntroComponent } from './contact-us-intro/contact-us-intro.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { delay, Observable, of } from 'rxjs';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    ContactUsIntroComponent,
    NgIf,
    UiContactSectionComponent,
    ContactUsVacactionComponent,
    ContactUsMapComponent,
  ],
})
export class ContactUsComponent implements OnInit {
  page: Page<ContactUsTemplate> | any = {};

  contactForm!: ContactForm;

  loaded = false;

  constructor(
    private pageClient: PageClient,
    private seo: SeoService,
  ) {}

  ngOnInit(): void {
    this.pageClient.getPage('p', 'contactus').subscribe((res) => {
      this.page = res.page;
      this.contactForm = res.contactForms[0];
      this.seo.setGlobalMetaTagsFromPage(res.page);

      this.finishOpening().subscribe({
        next: () => {
          this.loaded = true;
        },
      });
    });
  }

  private finishOpening(): Observable<string> {
    return of('').pipe(delay(1));
  }
}

import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Page } from '../../../api/clients/models/content/page';
import { WalletsTemplateData } from '../../../api/clients/models/templates/wallets/wallets-template-data';
import { ContactForm } from '../../../api/clients/models/templates/contact-us/contact-form';
import { ActivatedRoute } from '@angular/router';
import { PageDataService } from '../../services/page-data.service';
import { UiFaqComponent } from '../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiContactSectionComponent } from '../../../ui/ui-components/ui-contact/ui-contact-section/ui-contact-section.component';
import { UiBasicSegmentExplanationComponent } from '../../../ui/ui-components/ui-basic-segment/ui-basic-segment-explanation/ui-basic-segment-explanation.component';
import { UiIntroductionDefaultComponent } from '../../../ui/ui-components/ui-introduction-default/ui-introduction-default/ui-introduction-default.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    BaseLayoutComponent,
    UiIntroductionDefaultComponent,
    UiBasicSegmentExplanationComponent,
    UiContactSectionComponent,
    UiFaqComponent,
  ],
})
export class WalletsComponent implements OnInit {
  walletsPage!: Page<WalletsTemplateData>;

  contactForm!: ContactForm;

  loaded = false;

  constructor(
    private route: ActivatedRoute,
    private pageDataService: PageDataService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.pageDataService.getPageData(data['prefix'], data['slug']).subscribe((res) => {
        this.walletsPage = res.page;
        this.contactForm = res.contactForms[0];
        if (isPlatformBrowser(this.platformId)) {
          of('')
            .pipe(delay(500))
            .subscribe({
              next: () => {
                this.loaded = true;
              },
            });
        }
      });
    });
  }

  scrollToAnchor(element: string) {
    const El = document.getElementById(element);
    if (El) {
      El.scrollIntoView({ block: 'center', inline: 'nearest' });
    }
  }
}

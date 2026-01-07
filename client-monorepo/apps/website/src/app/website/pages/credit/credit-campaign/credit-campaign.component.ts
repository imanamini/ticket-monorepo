import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { PageClient } from '../../../../api/clients/page-client';
import { Page } from '../../../../api/clients/models/content/page';
import { CreditCampaignTemplate } from '../../../../api/clients/models/templates/credit-campaign/credit-campaign-template';
import { ContactForm } from '../../../../api/clients/models/templates/contact-us/contact-form';
import { Banner } from '../../../../api/clients/models/content/banner';
import { ActivatedRoute, Router } from '@angular/router';
import { UiFaqComponent } from '../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { CreditCampaignFormComponent } from './credit-campaign-form/credit-campaign-form.component';
import { CreditCampaignValueComponent } from './credit-campaign-value/credit-campaign-value.component';
import { CreditCampaignTimerComponent } from './credit-campaign-timer/credit-campaign-timer.component';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { NgIf } from '@angular/common';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-credit-campaign',
  templateUrl: './credit-campaign.component.html',
  styleUrls: ['./credit-campaign.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    BaseLayoutComponent,
    CreditCampaignTimerComponent,
    CreditCampaignValueComponent,
    CreditCampaignFormComponent,
    UiFaqComponent,
  ],
})
export class CreditCampaignComponent implements OnInit {
  creditCampaignPage!: Page<CreditCampaignTemplate>;

  contactForm!: ContactForm;

  banner!: Banner;

  loaded = false;

  constructor(
    private seo: SeoService,
    private pageClient: PageClient,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const map = this.route.snapshot.params as any;
    this.pageClient.getPage('campaign', map.slug).subscribe(
      (res) => {
        this.creditCampaignPage = res.page;
        this.contactForm = res.contactForms[0];

        of('')
          .pipe(delay(2000))
          .subscribe({
            next: () => {
              this.banner = res.page.templateData.moda;
              this.changeDetectorRef.detectChanges();
            },
          });

        this.seo.setGlobalMetaTagsFromPage(res.page);
        of('')
          .pipe(delay(500))
          .subscribe({
            next: () => {
              this.loaded = true;
            },
          });
      },
      (error) => {
        let path = this.router.url;
        if (path.slice(-1) === '.') {
          path = path.substring(0, path.length - 1);
        }
        this.router.navigate([path], { skipLocationChange: true });
      },
    );
  }
}

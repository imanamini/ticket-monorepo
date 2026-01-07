import { Component, OnInit } from '@angular/core';
import { Page } from '../../../../api/clients/models/content/page';
import { B2OLandingTemplateDateResponse } from './B2O-landing.response';
import { ActivatedRoute } from '@angular/router';
import { PageDataService } from '../../../services/page-data.service';
import { ContactForm } from '../../../../api/clients/models/templates/contact-us/contact-form';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { CreditCampaignTimerComponent } from '../../credit/credit-campaign/credit-campaign-timer/credit-campaign-timer.component';
import { B20ServicesComponent } from './b20-services/b20-services.component';
import { B2oFormComponent } from './b2o-form/b2o-form.component';
import { B2oFinancialServicesComponent } from './b2o-financial-services/b2o-financial-services.component';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-b2o-landing',
  standalone: true,
  templateUrl: './b2o-landing.component.html',
  styleUrls: ['./b2o-landing.component.scss'],
  imports: [
    BaseLayoutComponent,
    CreditCampaignTimerComponent,
    B20ServicesComponent,
    B2oFormComponent,
    B2oFinancialServicesComponent,
    UiButtonComponent,
    NgIf,
  ],
})
export class B2oLandingComponent implements OnInit {
  loaded = false;
  contactForm!: ContactForm;
  creditCampaignPage!: Page<B2OLandingTemplateDateResponse>;
  constructor(
    private route: ActivatedRoute,
    private pageDataService: PageDataService,
  ) {}

  ngOnInit(): void {

    this.route.url.subscribe((segments) => {
      this.pageDataService.getPageData('landing', segments[0].path).subscribe((res) => {
        this.creditCampaignPage = res.page;
        this.contactForm = res.contactForms[0];
        this.loaded = true;
      });
    });
  }

  scrollToAnchor(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageDataService } from '../../../services/page-data.service';
import { ContactForm } from '../../../../api/clients/models/templates/contact-us/contact-form';
import { merchantRegisterTemplateDataResponse } from './merchant-register-response';
import { Page } from '../../../../api/clients/models/content/page';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { IntroSectionComponent } from './intro-section/intro-section.component';
import { ContentSectionComponent } from './content-section/content-section.component';
import { HomeCustomersComponent } from '../../home/home-customers/home-customers.component';
import { NgIf } from '@angular/common';
import { DigipayServicesComponent } from './digipay-services/digipay-services.component';
import { SellsStepsComponent } from './sells-steps/sells-steps.component';
import { MerchantRegisterFormComponent } from './merchant-register-form/merchant-register-form.component';
import { DigipayCatalogComponent } from './digipay-catalog/digipay-catalog.component';
import { UiFaqComponent } from '../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';

@Component({
  selector: 'app-merchant-register',
  templateUrl: './merchant-register.component.html',
  standalone: true,
  styleUrls: ['./merchant-register.component.scss'],
  imports: [
    BaseLayoutComponent,
    IntroSectionComponent,
    ContentSectionComponent,
    HomeCustomersComponent,
    NgIf,
    DigipayServicesComponent,
    SellsStepsComponent,
    MerchantRegisterFormComponent,
    DigipayCatalogComponent,
    UiFaqComponent,
  ],
})
export class MerchantRegisterComponent implements OnInit {
  creditCampaignPage!: Page<merchantRegisterTemplateDataResponse>;
  contactForm!: ContactForm;
  loaded = false;

  constructor(
    private route: ActivatedRoute,
    private pageDataService: PageDataService,
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe((segments) => {
      this.pageDataService.getPageData('campaigns', segments[0].path).subscribe((res) => {
        this.creditCampaignPage = res.page;
        this.contactForm = res.contactForms[0];
        this.loaded = true;
      });
    });
  }
}

import {Component, inject, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { RegisterBenefits } from '../../../../api/clients/models/templates/c-credit/c-credit-template-data';
import { PageDataService } from '../../../services/page-data.service';
import { ActivatedRoute } from '@angular/router';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { CreditCampaignTimerComponent } from '../../credit/credit-campaign/credit-campaign-timer/credit-campaign-timer.component';
import { CreditRegisterBenefitsComponent } from '../../../../ui/ui-components/ui-credit/credit-register-benefits/credit-register-benefits.component';
import { UiHorizontalFlowComponent } from '../../../../ui/ui-components/ui-horizontal-flow/ui-horizontal-flow/ui-horizontal-flow.component';
import { UiFaqComponent } from '../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { isPlatformBrowser, NgIf } from '@angular/common';
import {UrlService} from "../../../services/url.service";

@Component({
  selector: 'app-equipment-insurance',
  templateUrl: './equipment-insurance.component.html',
  styleUrls: ['./equipment-insurance.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    CreditCampaignTimerComponent,
    CreditRegisterBenefitsComponent,
    UiHorizontalFlowComponent,
    UiFaqComponent,
    NgIf,
  ],
})
export class EquipmentInsuranceComponent implements OnInit {
  loaded = false;

  creditCampaignPage!: any;

  contactForm!: any;

  digiPayBenefit: RegisterBenefits;

  urlService = inject(UrlService);

  constructor(
    private pageDataService: PageDataService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe((segments) => {
      this.pageDataService.getPageData('campaigns', segments[0].path).subscribe((res) => {
        this.creditCampaignPage = res.page;
        const benefits = [];
        res.page.templateData.sectionValue.values.forEach((item) => {
          benefits.push({
            icon: item.featureIcon,
            text: item.featureText,
          });
        });
        this.digiPayBenefit = {
          title: 'مزایای خرید بیمه تجهیزات الکترونیک دیجی‌پی',
          benefits: benefits,
        };
        this.loaded = true;
      });
    });
  }

  openThirdPartyInsurance(link: string) {
    if (link) {
      this.urlService.handleLink(link);
    }
  }
}

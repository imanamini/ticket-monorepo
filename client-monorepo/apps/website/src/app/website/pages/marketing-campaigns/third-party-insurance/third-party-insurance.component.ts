import {Component, inject, OnInit} from '@angular/core';
import { RegisterBenefits } from '../../../../api/clients/models/templates/c-credit/c-credit-template-data';
import { PageDataService } from '../../../services/page-data.service';
import { NobitexCreditService } from '../../../../api/clients/nobitex/nobitex-credit.service';
import { ActivatedRoute } from '@angular/router';
import { UiFaqComponent } from '../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiHorizontalFlowComponent } from '../../../../ui/ui-components/ui-horizontal-flow/ui-horizontal-flow/ui-horizontal-flow.component';
import { CreditRegisterBenefitsComponent } from '../../../../ui/ui-components/ui-credit/credit-register-benefits/credit-register-benefits.component';
import { CreditCampaignTimerComponent } from '../../credit/credit-campaign/credit-campaign-timer/credit-campaign-timer.component';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { NgIf } from '@angular/common';
import {UrlService} from "../../../services/url.service";

@Component({
  selector: 'app-third-party-insurance',
  templateUrl: './third-party-insurance.component.html',
  styleUrls: ['./third-party-insurance.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    BaseLayoutComponent,
    CreditCampaignTimerComponent,
    CreditRegisterBenefitsComponent,
    UiHorizontalFlowComponent,
    UiFaqComponent,
  ],
})
export class ThirdPartyInsuranceComponent implements OnInit {
  loaded = false;

  creditCampaignPage!: any;

  contactForm!: any;

  digiPayBenefit: RegisterBenefits;

  urlService = inject(UrlService);

  constructor(
    private pageDataService: PageDataService,
    protected nobitexCredit: NobitexCreditService,
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
          title: 'مزایای خرید بیمه شخص ثالث دیجی پی',
          benefits: benefits,
        };
        this.loaded = true;
      });
    });
  }

  openThirdPartyInsurance(link: string) {
    if(link){
      this.urlService.handleLink(link);
    }
  }
}

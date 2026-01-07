import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Page } from '../../../../api/clients/models/content/page';
import { PageDataService } from '../../../services/page-data.service';
import { MetroCampaignTemplateDataResponse } from './metro-campaign-template-data.response';
import { UiFaqComponent } from '../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { MetroCampaignMerchantsComponent } from './metro-campaign-merchants/metro-campaign-merchants.component';
import { MetroCampaignPlansComponent } from './metro-campaign-plans/metro-campaign-plans.component';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';

@Component({
  selector: 'app-metro-140302',
  templateUrl: './metro-140302.component.html',
  styleUrls: ['./metro-140302.component.scss'],
  standalone: true,
  imports: [BaseLayoutComponent, MetroCampaignPlansComponent, MetroCampaignMerchantsComponent, NgIf, UiFaqComponent],
})
export class Metro140302Component implements OnInit {
  loaded = false;
  CampaignPageData: Page<MetroCampaignTemplateDataResponse>;

  constructor(
    private pageDataService: PageDataService,
    @Inject(PLATFORM_ID) public platformId: string,
  ) {}

  ngOnInit(): void {
    this.pageDataService.getPageData('campaigns', 'buynow').subscribe((res) => {
      this.CampaignPageData = res.page;
      this.loaded = true;
    });
  }
}

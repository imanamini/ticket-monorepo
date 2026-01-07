import { Component, OnInit } from '@angular/core';
import { PageDataService } from '../../../../services/page-data.service';
import { Page } from '../../../../../api/clients/models/content/page';
import { CBnplV2TemplateDataResponse } from '../../../../../api/clients/models/templates/c-bnpl-v2/c-bnpl-v2-template-data.response';
import { ActivatedRoute } from '@angular/router';
import { UiFaqComponent } from '../../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiSeoComponent } from '../../../../../ui/ui-components/ui-seo/ui-seo/ui-seo.component';
import { CBnplVouchersComponent } from './components/c-bnpl-vouchers/c-bnpl-vouchers.component';
import { AppPromotionComponent } from './components/app-promotion/app-promotion.component';
import { BnplUsageTutorialComponent } from './components/bnpl-usage-tutorial/bnpl-usage-tutorial.component';
import { CBnplPromotionBannerComponent } from './components/c-bnpl-promotion-banner/c-bnpl-promotion-banner.component';
import { CBnplTypesComponent } from './components/c-bnpl-types/c-bnpl-types.component';
import { ValuePropositionComponent } from './components/value-proposition/value-proposition.component';
import { CBnplIntroComponent } from './components/c-bnpl-intro/c-bnpl-intro.component';
import { BaseLayoutComponent } from '../../../../layout/base-layout/base-layout.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-c-bnpl',
  templateUrl: './c-bnpl.component.html',
  styleUrls: ['./c-bnpl.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    BaseLayoutComponent,
    CBnplIntroComponent,
    ValuePropositionComponent,
    CBnplTypesComponent,
    CBnplPromotionBannerComponent,
    BnplUsageTutorialComponent,
    AppPromotionComponent,
    CBnplVouchersComponent,
    UiSeoComponent,
    UiFaqComponent,
  ],
})
export class CBnplComponent implements OnInit {
  loaded = false;
  isFromBaniMode = false;

  CBnplPageData: Page<CBnplV2TemplateDataResponse>;

  constructor(
    private pageDataService: PageDataService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if ('banimode-campaign' == queryParams['utm_term']) {
        this.isFromBaniMode = true;
      }
    });
    this.pageDataService.getPageData('bnpl', 'c-bnpl').subscribe({
      next: (res) => {
        if (this.isFromBaniMode) {
          res.page.templateData.cBnplIntro.subtitle = res.page.templateData.cBnplIntro.subtitle.replace('دیجی‌کالا', 'بانی‌مد');
        }
        this.CBnplPageData = res.page;
        this.loaded = true;
      },
      error: () => {
        this.loaded = true;
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CreditIntroCtaConfig } from '../../../ui/models/credit/credit-intro-cta.interface';
import { PageDataService } from '../../services/page-data.service';
import { Page } from '../../../api/clients/models/content/page';
import { WealthTemplateData } from '../../../api/clients/models/templates/wealth/wealth-template-data';
import { UiFaqComponent } from '../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiSectionDownloadBannerComponent } from '../../../ui/ui-components/ui-section-download-banner/ui-section-download-banner/ui-section-download-banner.component';
import { WealthIntrackSectionComponent } from './components/wealth-intrack-section/wealth-intrack-section/wealth-intrack-section.component';
import { BoursePromotionComponent } from './components/bourse-promotion/bourse-promotion.component';
import { InvestmentStepsComponent } from './components/investment-steps/investment-steps.component';
import { CreditIntroComponent } from '../../../ui/ui-components/ui-credit/credit-intro/credit-intro.component';
import { NgIf } from '@angular/common';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-wealth',
  templateUrl: './wealth.component.html',
  styleUrls: ['./wealth.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    NgIf,
    CreditIntroComponent,
    InvestmentStepsComponent,
    BoursePromotionComponent,
    WealthIntrackSectionComponent,
    UiSectionDownloadBannerComponent,
    UiFaqComponent,
  ],
})
export class WealthComponent implements OnInit {
  wealthPage: Page<WealthTemplateData>;

  loaded = false;

  creditIntroCta: {
    firstCta: CreditIntroCtaConfig;
    secondCta: CreditIntroCtaConfig;
  };

  constructor(private pageDataService: PageDataService) {}

  ngOnInit(): void {
    this.creditIntroCta = {
      firstCta: {
        isCustom: true,
        backgroundColor: '#00CC6D',
        textColor: '#fff',
        hasScrollToElement: true,
        scrollToElementId: 'bourse-promotion',
        scrollOption: 'center',
      },
      secondCta: {
        isCustom: true,
        backgroundColor: '#fff',
        textColor: '#00A34D',
        hasScrollToElement: true,
        scrollToElementId: 'investment-steps',
        scrollOption: 'start',
      },
    };
    this.pageDataService.getPageData('p', 'wealth').subscribe((response) => {
      this.wealthPage = response.page;
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

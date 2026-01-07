import {Component, OnInit} from '@angular/core';
import {MerchantsTemplateData} from '../../../api/clients/models/templates/merchants/merchants-template-data';
import {Page} from '../../../api/clients/models/content/page';
import {HttpClient} from '@angular/common/http';
import {SingleMerchant} from '../../../api/digipay/models/merchants/single-merchant.model';
import {MerchantsApiModel} from '../../../api/digipay/models/merchants/merchants-api.model';
import {PageDataService} from '../../services/page-data.service';
import {CreditIntroCtaConfig} from '../../../ui/models/credit/credit-intro-cta.interface';
import {MerchantsApiService} from '../../../api/clients/credit/merchants-api.service';
import {UiFaqComponent} from '../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import {UiSeoComponent} from '../../../ui/ui-components/ui-seo/ui-seo/ui-seo.component';
import {
  UiSectionDownloadBannerComponent
} from '../../../ui/ui-components/ui-section-download-banner/ui-section-download-banner/ui-section-download-banner.component';
import {CreditMerchantsComponent} from './components/credit-merchants/credit-merchants.component';
import {CreditIntroComponent} from '../../../ui/ui-components/ui-credit/credit-intro/credit-intro.component';
import {NgIf} from '@angular/common';
import {BaseLayoutComponent} from '../../layout/base-layout/base-layout.component';
import {delay, of} from 'rxjs';

@Component({
  selector: 'app-merchants',
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    NgIf,
    CreditIntroComponent,
    CreditMerchantsComponent,
    UiSectionDownloadBannerComponent,
    UiSeoComponent,
    UiFaqComponent,
  ],
})
export class MerchantsComponent implements OnInit {
  loaded = false;

  merchantsPage: Page<MerchantsTemplateData>;

  creditIntroCta: {
    firstCta: CreditIntroCtaConfig;
    secondCta: CreditIntroCtaConfig;
  };

  merchantsList: SingleMerchant[] = [];

  constructor(
    private pageDataService: PageDataService,
    private merchantsApiService: MerchantsApiService,
  ) {
  }

  ngOnInit() {
    this.creditIntroCta = {
      firstCta: {
        isCustom: false,
        hasScrollToElement: false,
      },
      secondCta: {
        isCustom: false,
        hasScrollToElement: true,
        scrollToElementId: 'section-credit-merchants',
        scrollOption: 'start',
      },
    };

    this.pageDataService.getPageData('credit', 'merchants').subscribe((response) => {
      this.merchantsPage = response.page;
      of('').pipe(delay(500))
        .subscribe({
          next: () => {
            this.loaded = true;
          },
        });
    });
  }
}

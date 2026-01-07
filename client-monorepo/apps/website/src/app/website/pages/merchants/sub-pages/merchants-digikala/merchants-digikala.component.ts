import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { PageClient } from '../../../../../api/clients/page-client';
import { SeoService } from '../../../../services/seo.service';
import { MerchantsDigikalaTemplateData } from '../../../../../api/clients/models/templates/merchants-digikala/merchants-digikala-template-data';
import { Page } from '../../../../../api/clients/models/content/page';
import { DigikalaProductsClient } from '../../../../../api/clients/digikala-products-client';
import { CreditMerchants, DigikalaProducts } from '../../../../../api/clients/models/templates/credit-v3/credit-config.response';
import { CreditClient } from '../../../../../api/clients/credit/credit-client';
import { CreditConfigResponse } from '../../../../../api/clients/models/templates/credit/credit-config.response';
import { FaqItem } from '../../../../../api/clients/models/templates/services/faq';
import { FaqService } from '../../../../services/faq.service';
import { MerchantsApiService } from '../../../../../api/clients/credit/merchants-api.service';
import { UiFaqComponent } from '../../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiSeoComponent } from '../../../../../ui/ui-components/ui-seo/ui-seo/ui-seo.component';
import { CreditStoresComponent } from '../../../../../ui/ui-components/ui-credit/credit-stores/credit-stores.component';
import { CreditDigikalaProductsComponent } from '../../../../../ui/ui-components/ui-credit/credit-digikala-products/credit-digikala-products.component';
import { MerchantsDigikalaCreditPromotionComponent } from './components/merchants-digikala-credit-promotion/merchants-digikala-credit-promotion.component';
import { MerchantsDigikalaCreditRoadmapComponent } from './components/merchants-digikala-credit-roadmap/merchants-digikala-credit-roadmap.component';
import { UiSectionSlidingIntroductionComponent } from '../../../../../ui/ui-components/ui-section-sliding-introduction/ui-section-sliding-introduction/ui-section-sliding-introduction.component';
import { NgIf } from '@angular/common';
import { BaseLayoutComponent } from '../../../../layout/base-layout/base-layout.component';

@Component({
  selector: 'app-merchants-digikala',
  templateUrl: './merchants-digikala.component.html',
  styleUrls: ['./merchants-digikala.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    NgIf,
    UiSectionSlidingIntroductionComponent,
    MerchantsDigikalaCreditRoadmapComponent,
    MerchantsDigikalaCreditPromotionComponent,
    CreditDigikalaProductsComponent,
    CreditStoresComponent,
    UiSeoComponent,
    UiFaqComponent,
  ],
})
export class MerchantsDigikalaComponent implements OnInit {
  loaded = false;

  merchantsDigikalaPage: Page<MerchantsDigikalaTemplateData>;

  digikalaProducts: DigikalaProducts;

  productSingle;

  creditConfig: CreditConfigResponse;

  faqItems: FaqItem[] = [];

  merchants: CreditMerchants;

  constructor(
    private pageClient: PageClient,
    private seo: SeoService,
    private digikalaProductsService: DigikalaProductsClient,
    private credit: CreditClient,
    private faqService: FaqService,
    @Inject(PLATFORM_ID) public platformId: string,
    private merchantService: MerchantsApiService,
  ) {}

  ngOnInit(): void {
    this.getPageData();
    this.getDigikalaProducts();
    this.getProductSingleModal();
    this.credit.getCreditPageConfig().subscribe((res) => {
      this.creditConfig = res;
      this.merchantService.getCreditMerchants().subscribe((res) => {
        this.merchants = res.merchants;
        this.merchants.title = this.merchantsDigikalaPage.templateData.sectionStores.title || 'قابل مصرف در فروشگاه‌های';
      });
    });
  }

  getPageData() {
    this.pageClient.getPage('merchants', 'digikala').subscribe((response) => {
      this.merchantsDigikalaPage = response.page;
      this.seo.setGlobalMetaTagsFromPage(response.page);
      if (response.page.templateData.faq.categoryId) {
        this.faqService.getFaqFromSupport(response.page.templateData.faq.categoryId).subscribe((res) => {
          this.faqItems = res;
        });
      }
      this.loaded = true;
    });
  }

  getDigikalaProducts() {
    this.digikalaProductsService.getCreditDigikalaProducts('merchants', 'digikala').subscribe(
      (res) => {
        if (res.digikalaProducts && res.digikalaProducts.length > 0) {
          this.digikalaProducts = res.digikalaProducts;
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }

  getProductSingleModal() {
    this.pageClient.getPage('p', 'product-single').subscribe((res) => {
      this.productSingle = res.page.templateData;
    });
  }
}

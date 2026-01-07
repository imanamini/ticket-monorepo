import { Component, inject, signal } from '@angular/core';
import { PageClient } from '../../../../api/clients/page-client';
import { Page } from '../../../../api/clients/models/content/page';
import { MerchantsSellerTemplateData } from '../../../../api/clients/models/templates/merchants-seller/merchants-seller-template-data';
import { ActivatedRoute } from '@angular/router';
import { UiFaqComponent } from '../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { MerchantsSellerCalculatorSectionComponent } from './components/merchants-seller-calculator-section/merchants-seller-calculator-section.component';
import { MerchantsSellerBenefitsSectionComponent } from './components/merchants-seller-benefits-section/merchants-seller-benefits-section.component';
import { MerchantsSellerBannerSectionComponent } from './components/merchants-seller-banner-section/merchants-seller-banner-section.component';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';

@Component({
  selector: 'app-merchants-seller',
  templateUrl: './merchants-seller.component.html',
  styleUrls: ['./merchants-seller.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    MerchantsSellerBannerSectionComponent,
    MerchantsSellerBenefitsSectionComponent,
    MerchantsSellerCalculatorSectionComponent,
    UiFaqComponent,
  ],
})
export class MerchantsSellerComponent {
  merchantsSellerPage = signal<Page<MerchantsSellerTemplateData> | undefined>(undefined);
  loaded = signal(false);

  private pageClient = inject(PageClient);
  private route = inject(ActivatedRoute);

  constructor() {
    const utmSource = this.route.snapshot.queryParamMap.get('utm_source');
    if (utmSource) {
      sessionStorage.setItem('utm_source', utmSource);
    }
    this.pageClient.getPage('p', 'merchants-seller').subscribe((response) => {
      this.merchantsSellerPage.set(response.page);
      this.loaded.set(true);
    });
  }
}

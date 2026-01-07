import { Component, inject, Inject, PLATFORM_ID, signal } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { PageClient } from '../../../../api/clients/page-client';
import { Page } from '../../../../api/clients/models/content/page';
import { MerchantCreditTemplateData } from '../../../../api/clients/models/templates/merchant-credit-v2/merchant-credit-template-data';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { UiFaqComponent } from '../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiSeoComponent } from '../../../../ui/ui-components/ui-seo/ui-seo/ui-seo.component';
import { MerchantCreditEarlyCheckoutActivationComponent } from './components/merchant-credit-early-checkout-activation/merchant-credit-early-checkout-activation.component';
import { MerchantCreditEarlyCheckoutCalculatorComponent } from './components/merchant-credit-early-checkout-calculator/merchant-credit-early-checkout-calculator.component';
import { MerchantCreditEarlyCheckoutBenefitsComponent } from './components/merchant-credit-early-checkout-benefits/merchant-credit-early-checkout-benefits.component';
import { UiIntroductionSectionComponent } from '../../../../ui/ui-components/ui-introduction-section/ui-introduction-section.component';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-merchant-credit',
  templateUrl: './merchant-credit.component.html',
  styleUrls: ['./merchant-credit.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    UiIntroductionSectionComponent,
    MerchantCreditEarlyCheckoutBenefitsComponent,
    MerchantCreditEarlyCheckoutCalculatorComponent,
    MerchantCreditEarlyCheckoutActivationComponent,
    UiSeoComponent,
    UiFaqComponent,
  ],
})
export class MerchantCreditComponent {
  merchantCreditPage = signal<Page<MerchantCreditTemplateData> | undefined>(undefined);
  loaded = signal(false);

  private seo = inject(SeoService);
  private pageClient = inject(PageClient);
  public scroller = inject(ViewportScroller);

  constructor(@Inject(PLATFORM_ID) public platformId: string) {
    if (isPlatformBrowser(this.platformId)) {
      const chat = document.createElement('script');
      chat.src = '/assets/scripts/goftino.js';
      document.body.appendChild(chat);
    }
    this.pageClient.getPage('p', 'merchant-credit').subscribe((res) => {
      this.merchantCreditPage.set(res.page);
      this.seo.setGlobalMetaTagsFromPage(res.page);
      of('')
        .pipe(delay(500))
        .subscribe({
          next: () => {
            this.loaded.set(true);
          },
        });
    });
  }
}

import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Page } from '../../../../api/clients/models/content/page';
import { CCreditTemplateData } from '../../../../api/clients/models/templates/c-credit/c-credit-template-data';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser, NgIf, ViewportScroller } from '@angular/common';
import { PageDataService } from '../../../services/page-data.service';
import { MerchantsApiService } from '../../../../api/clients/credit/merchants-api.service';
import { CreditMerchants } from '../../../../api/clients/models/templates/credit-v3/credit-config.response';
import { CreditIntroCtaConfig } from '../../../../ui/models/credit/credit-intro-cta.interface';
import { UiFaqComponent } from '../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiSeoComponent } from '../../../../ui/ui-components/ui-seo/ui-seo/ui-seo.component';
import { CCreditRegisteringComponent } from './components/c-credit-registering/c-credit-registering.component';
import { CCreditLoanRoadmapComponent } from './components/c-credit-loan-roadmap/c-credit-loan-roadmap.component';
import { CreditIntroComponent } from '../../../../ui/ui-components/ui-credit/credit-intro/credit-intro.component';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-c-credit',
  templateUrl: './c-credit.component.html',
  styleUrls: ['./c-credit.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    NgIf,
    CreditIntroComponent,
    CCreditLoanRoadmapComponent,
    CCreditRegisteringComponent,
    UiSeoComponent,
    UiFaqComponent,
  ],
})
export class CCreditComponent implements OnInit {
  creditIntroCta: {
    firstCta: CreditIntroCtaConfig;
    secondCta: CreditIntroCtaConfig;
  };

  cCreditPageData!: Page<CCreditTemplateData>;

  loaded = false;

  merchants: CreditMerchants;

  constructor(
    private route: ActivatedRoute,
    private scroller: ViewportScroller,
    @Inject(PLATFORM_ID) public platformId: string,
    private pageDataService: PageDataService,
    private merchantService: MerchantsApiService,
  ) {}

  ngOnInit(): void {
    this.creditIntroCta = {
      firstCta: {
        isCustom: false,
        hasScrollToElement: true,
        scrollToElementId: 'section-register',
      },
      secondCta: {
        isCustom: false,
        hasScrollToElement: true,
        scrollToElementId: 'section-load-roadmap',
        scrollOption: 'center',
      },
    };

    this.pageDataService.getPageData('credit', 'c-credit').subscribe((res) => {
      this.cCreditPageData = res.page;
      this.merchantService.getCreditMerchants().subscribe((res) => {
        this.merchants = res.merchants;
        this.merchants.title = this.cCreditPageData.templateData.sectionStores.title || 'قابل مصرف در فروشگاه‌های';
      });
      of('')
        .pipe(delay(500))
        .subscribe({
          next: () => {
            this.loaded = true;
          },
        });
    });

    if (isPlatformBrowser(this.platformId)) {
      this.route.queryParams.subscribe((paramsList) => {
        if (paramsList['section']) {
          window.addEventListener('load', () => {
            of('')
              .pipe(delay(2000))
              .subscribe({
                next: () => {
                  this.scroller.scrollToAnchor(paramsList['section']);
                },
              });
          });
        }
      });

      this.route.fragment.subscribe(fragment => {
        if (fragment === 'digipayBranch') {
          of('').pipe(delay(0)).subscribe(() => {
            console.log('digipayBranch fragment detected');
          })
        }
      });
    }
  }
}

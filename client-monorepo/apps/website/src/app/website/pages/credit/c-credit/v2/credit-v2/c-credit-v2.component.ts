import {Component, HostListener, inject, Inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {Page} from '../../../../../../api/clients/models/content/page';
import {ActivatedRoute} from '@angular/router';
import {isPlatformBrowser, ViewportScroller} from '@angular/common';
import {PageDataService} from '../../../../../services/page-data.service';
import {MerchantsApiService} from '../../../../../../api/clients/credit/merchants-api.service';
import {CreditMerchants} from '../../../../../../api/clients/models/templates/credit-v3/credit-config.response';
import {UiFaqComponent} from '../../../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import {UiSeoComponent} from '../../../../../../ui/ui-components/ui-seo/ui-seo/ui-seo.component';
import {BaseLayoutComponent} from '../../../../../layout/base-layout/base-layout.component';
import {delay, EMPTY, from, mergeMap, of} from 'rxjs';
import {CreditHeaderSectionComponent} from '../components/credit-header-section/credit-header-section.component';
import {
  CreditRegistrationSectionComponent
} from '../components/credit-registration-section/credit-registration-section.component';
import {
  CreditCalculatorV4SectionComponent
} from '../components/credit-calculator-v4/credit-calculator-v4-section.component';
import {
  CreditOnsiteRegistrationSectionComponent
} from '../components/credit-onsite-registration-section/credit-onsite-registration-section.component';
import {
  CCreditV2TemplateData
} from '../../../../../../api/clients/models/templates/c-credit/c-credit-v2-template-data';
import {CreditUsageSectionComponent} from '../components/credit-usage-section/credit-usage-section.component';
import {
  bnplUsageCategory
} from "../../../../../../api/clients/models/templates/bnpl-onboarding/bnpl-onboarding-template-data";
import {map} from "rxjs/operators";
import {BnplOnboradingApiService} from "../../../../../../api/digipay/bnpl-onborading.api.service";
import {DeviceDetectorService} from "../../../../../../core/services/device/deviceDetector.service";
import {CtaService} from "../../../../../layout/cta-bottom-sheet/cta.service";

@Component({
  selector: 'app-c-credit',
  templateUrl: './c-credit-v2.component.html',
  styleUrls: ['./c-credit-v2.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    UiSeoComponent,
    UiFaqComponent,
    CreditHeaderSectionComponent,
    CreditRegistrationSectionComponent,
    CreditCalculatorV4SectionComponent,
    CreditOnsiteRegistrationSectionComponent,
    CreditUsageSectionComponent
  ]
})
export class CCreditV2Component implements OnInit {

  cCreditPageData = signal<Page<CCreditV2TemplateData> | undefined>(undefined);
  BnplOnboradingApiService = inject(BnplOnboradingApiService);
  loaded = false;

  merchants: CreditMerchants;

  deviceService = inject(DeviceDetectorService);
  ctaService = inject(CtaService);


  constructor(
    private route: ActivatedRoute,
    private scroller: ViewportScroller,
    @Inject(PLATFORM_ID) public platformId: string,
    private pageDataService: PageDataService,
    private merchantService: MerchantsApiService,
  ) {
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const creditRegistration = document.getElementById('credit-registration');

      if (!creditRegistration) return;

      const scrollPos = window.scrollY + window.innerHeight / 2;
      const creditRegistrationTop = creditRegistration.offsetTop;


      if (scrollPos >= creditRegistrationTop) {
        this.ctaService.setCtaVisibilityByScroll(true);
      } else {
        this.ctaService.setCtaVisibilityByScroll(false);
      }
    }
  }

  ngOnInit(): void {

    this.pageDataService.getPageData('credit', 'c-credit-v2').subscribe((res) => {
      this.cCreditPageData.set(res.page);
      const categories: bnplUsageCategory[] = res.page.templateData.bnplUsage.categories as bnplUsageCategory[];

      from(categories).pipe(
        mergeMap(category => {
          const merchantCodes = category.merchants.map(m => m.trackingCode);
          return merchantCodes.length > 0
            ? this.BnplOnboradingApiService.fetchRecappedMerchants(merchantCodes).pipe(
              map(response => {
                category.recappedMerchants = response.merchants;
                return category;
              })
            )
            : EMPTY;
        })
      ).subscribe();

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
      this.ctaService.setCtaVisibilityByScroll(false);

    }
  }
}

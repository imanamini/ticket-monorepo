import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
  signal
} from '@angular/core';
import {CommonModule, isPlatformBrowser, ViewportScroller} from '@angular/common';
import {Page} from "../../../../../../api/clients/models/content/page";
import {PageDataService} from "../../../../../services/page-data.service";
import {BaseLayoutComponent} from "../../../../../layout/base-layout/base-layout.component";
import {CBnplPlansComponent} from "./bnp-plans/c-bnpl-plans.component";
import {BnplBenefitsComponent} from "./bnpl-benefits/bnpl-benefits.component";
import {BnplInstallmentInfoComponent} from "./bnpl-installment-info/bnpl-installment-info.component";
import {BnplUsageComponent} from "../../../../static-landings/landing-onboarding/bnpl-usage/bnpl-usage.component";
import {BnplStepsComponent} from "../../../../static-landings/landing-onboarding/bnpl-steps/bnpl-steps.component";
import {UiFaqComponent} from "../../../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component";
import {UiSeoComponent} from "../../../../../../ui/ui-components/ui-seo/ui-seo/ui-seo.component";
import {BnplIntroComponent} from "./bnpl-intro/bnpl-intro.component";
import {CBnplV2Template} from "../../../../../../api/clients/models/templates/c-bnpl-v2/CBnplV2Template";
import {CtaService} from "../../../../../layout/cta-bottom-sheet/cta.service";
import {ActivatedRoute} from "@angular/router";
import {MerchantsApiService} from "../../../../../../api/clients/credit/merchants-api.service";
import {
  bnplUsageCategory
} from "../../../../../../api/clients/models/templates/bnpl-onboarding/bnpl-onboarding-template-data";
import {EMPTY, from, mergeMap} from "rxjs";
import {map} from "rxjs/operators";
import {BnplOnboradingApiService} from "../../../../../../api/digipay/bnpl-onborading.api.service";

@Component({
  selector: 'app-c-bnpl',
  standalone: true,
  imports: [CommonModule, BaseLayoutComponent, CBnplPlansComponent, BnplBenefitsComponent, BnplInstallmentInfoComponent, BnplStepsComponent, BnplUsageComponent, UiFaqComponent, UiSeoComponent, BnplIntroComponent],
  templateUrl: './c-bnpl.component.html',
  styleUrl: './c-bnpl.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CBnplComponent implements OnInit {
  loaded = false;
  CBnplPageData = signal<Page<CBnplV2Template> | undefined>(undefined);
  private readonly ctaService = inject(CtaService);
  BnplOnboradingApiService = inject(BnplOnboradingApiService);

  constructor(
    @Inject(PLATFORM_ID) public platformId: string,
    private pageDataService: PageDataService,
  ) {
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const bnplPlans = document.getElementById('bnpl-plans');

      if (!bnplPlans) return;

      const scrollPos = window.scrollY + window.innerHeight / 2;
      const bnplPlansTop = bnplPlans.offsetTop;


      if (scrollPos >= bnplPlansTop) {
        this.ctaService.setCtaVisibilityByScroll(true);
      } else {
        this.ctaService.setCtaVisibilityByScroll(false);
      }
    }
  }


  ngOnInit(): void {

    this.pageDataService.getPageData('bnpl', 'c-bnpl-v2').subscribe({
      next: (res) => {
        this.CBnplPageData.set(res.page);

        const bnplCta = this.CBnplPageData().templateData.benefitSection.cta.link;
        if (bnplCta) {
          this.ctaService.setCta({
            icon: 'bnpl',
            iconType: 'due',
            iconSize: '20px',
            text: 'اعتبار خرید اقساطی',
            link: bnplCta,
            ctaTitle: 'درخواست اعتبار',
            textStyles: 'c-2 text-oninvert-high'
          })
        }
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

        this.loaded = true;
      },
      error: () => {
        this.loaded = true;
      },
    });
  }
}

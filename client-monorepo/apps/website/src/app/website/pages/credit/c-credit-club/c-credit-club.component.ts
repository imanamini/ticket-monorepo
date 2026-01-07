import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Page } from '../../../../api/clients/models/content/page';
import { CCreditTemplateData } from '../../../../api/clients/models/templates/c-credit/c-credit-template-data';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser, NgIf, ViewportScroller } from '@angular/common';
import { PageDataService } from '../../../services/page-data.service';
import { CreditCalculatorService } from '../../../../api/clients/credit/credit-calculator/credit-calculator.service';
import { CreditIntroCtaConfig } from '../../../../ui/models/credit/credit-intro-cta.interface';
import { UiFaqComponent } from '../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiHorizontalFlowComponent } from '../../../../ui/ui-components/ui-horizontal-flow/ui-horizontal-flow/ui-horizontal-flow.component';
import { CCreditClubRegisteringComponent } from './components/c-credit-club-registering/c-credit-club-registering.component';
import { CreditIntroComponent } from '../../../../ui/ui-components/ui-credit/credit-intro/credit-intro.component';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';
import { UserType } from './models/user-type-model';

@Component({
  selector: 'app-c-credit-club',
  templateUrl: './c-credit-club.component.html',
  styleUrls: ['./c-credit-club.component.scss'],
  standalone: true,
  imports: [BaseLayoutComponent, NgIf, CreditIntroComponent, CCreditClubRegisteringComponent, UiHorizontalFlowComponent, UiFaqComponent],
})
export class CCreditClubComponent implements OnInit {
  cCreditPageData!: Page<CCreditTemplateData>;

  creditIntroCta: {
    firstCta: CreditIntroCtaConfig;
    secondCta: CreditIntroCtaConfig;
  };

  loaded = false;
  isEntekhab = false;

  selectedBank: number;

  userType: UserType;

  constructor(
    private route: ActivatedRoute,
    private scroller: ViewportScroller,
    @Inject(PLATFORM_ID) public platformId: string,
    private pageDataService: PageDataService,
    private creditCalculatorService: CreditCalculatorService,
  ) {}

  ngOnInit(): void {
    this.creditIntroCta = {
      firstCta: {
        isCustom: false,
        hasScrollToElement: true,
        scrollToElementId: 'section-flow',
        scrollOption: 'center',
      },
      secondCta: {
        isCustom: false,
        hasScrollToElement: true,
        scrollToElementId: 'section-register',
        scrollOption: 'center',
      },
    };

    this.route.data.subscribe((data) => {
      this.getPageData(data['prefix'], data['slug']);
      this.userType = data['userType'];
      this.selectedBank = this.creditCalculatorService.fundProviders.find(
        (o) => o.fundProviderName === data['slug'].replace('-club', ''),
      )?.fundProviderCode;
    });
  }

  getPageData(prefix: string, slug: string) {

    this.pageDataService.getPageData(prefix, slug).subscribe((res) => {
      if (slug === 'entekhab') {
        this.isEntekhab = true;
      }
      this.cCreditPageData = res.page;
      this.loaded = true;
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
    }
  }
}

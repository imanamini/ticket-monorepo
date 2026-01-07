import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { RegisterBenefits } from '../../../../api/clients/models/templates/c-credit/c-credit-template-data';
import { PageDataService } from '../../../services/page-data.service';
import { UiDialogLoginComponent } from '../../../../ui/ui-components/ui-dialogs/ui-dialog-login/ui-dialog-login.component';
import { delay, Observable, of, Subscription } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';

import { NobitexStepperDialogComponent } from './nobitex-stepper-dialog/nobitex-stepper-dialog.component';
import { NobitexCreditService } from '../../../../api/clients/nobitex/nobitex-credit.service';
import { Calculator } from '../../../../api/clients/models/templates/merchant-credit-v2/merchant-credit-template-data';
import { MatDialog } from '@angular/material/dialog';
import { DialogBottomSheetService } from '../../../../core/services/dialog-bottom-sheet.service';
import { AsyncPipe, isPlatformBrowser, NgIf, ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UiFaqComponent } from '../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiHorizontalFlowComponent } from '../../../../ui/ui-components/ui-horizontal-flow/ui-horizontal-flow/ui-horizontal-flow.component';
import { CBnplStoresComponent } from '../../credit/c-bnpl/c-bnpl/components/c-bnpl-stores/c-bnpl-stores.component';
import { NobitexSubmittedComponent } from './nobitex-submitted/nobitex-submitted.component';
import { NobitexNoPlanComponent } from './nobitex-no-plan/nobitex-no-plan.component';
import { NobitexCalculatorComponent } from './nobitex-calculator/nobitex-calculator.component';
import { CreditRegisterBenefitsComponent } from '../../../../ui/ui-components/ui-credit/credit-register-benefits/credit-register-benefits.component';
import { CreditCampaignTimerComponent } from '../../credit/credit-campaign/credit-campaign-timer/credit-campaign-timer.component';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';

@Component({
  selector: 'app-nobitex',
  templateUrl: './nobitex.component.html',
  styleUrls: ['./nobitex.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    BaseLayoutComponent,
    CreditCampaignTimerComponent,
    CreditRegisterBenefitsComponent,
    NobitexCalculatorComponent,
    NobitexNoPlanComponent,
    NobitexSubmittedComponent,
    CBnplStoresComponent,
    UiHorizontalFlowComponent,
    UiFaqComponent,
    AsyncPipe,
  ],
})
export class NobitexComponent implements OnInit, OnDestroy {
  @ViewChild('nobitexPlans') nobitexPlans: ElementRef;

  loaded = false;
  data = {
    page: {
      templateData: {
        pathPrefix: 'campaigns',
        mainForm: {
          title: 'مبلغ اعتبار را مشخص کنید',
          subtitle: '',
          modal: {
            promotionServices: {
              title: null,
              services: [],
            },
            modalBannerDesktop: null,
            modalBannerMobile: null,
            bannerLink: null,
          },
        },
      },
    },
    contactForms: {
      rows: [
        [
          {
            id: 'mobile',
            label: '\u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06cc\u0644',
            childPosition: 0,
            mandatory: true,
            options: [],
            pattern: null,
            type: 'CELL_NUMBER',
            rowNumber: 0,
            hint: null,
          },
          {
            id: 'national-id',
            label: '\u06a9\u062f \u0645\u0644\u06cc',
            childPosition: 0,
            mandatory: true,
            options: [],
            pattern: null,
            type: 'NATIONAL_ID',
            rowNumber: 0,
            hint: null,
          },
        ],
        [
          {
            id: 'birth-date',
            label: '\u062a\u0627\u0631\u06cc\u062e \u062a\u0648\u0644\u062f',
            childPosition: 1,
            mandatory: true,
            options: [],
            pattern: null,
            type: 'DATE',
            rowNumber: 1,
            datePickerOptions: {
              allowFuture: false,
              allowPast: true,
            },
            hint: null,
          },
        ],
      ],
    },
  };
  cBnplStores = {
    title: 'فروشگاه های طرف قرارداد',
    storeCategories: [
      {
        category: '0',
      },
      {
        category: '9',
      },
      {
        category: '3',
      },
      {
        category: '2',
      },
      {
        category: '1',
      },
    ],
  };

  creditCampaignPage!: any;

  contactForm!: any;

  digiPayBenefit: RegisterBenefits;

  nobitexCalculator: Calculator;

  isUserLogedIn = false;
  isUserLogedInSubscription!: Subscription;

  constructor(
    private pageDataService: PageDataService,
    private userService: UserService,
    private dialog: MatDialog,
    private dialogref: DialogBottomSheetService,
    protected nobitexCredit: NobitexCreditService,
    private scroller: ViewportScroller,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) public platformId: string,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.pageDataService.getPageData('campaigns', 'nobitex').subscribe((res) => {
        this.creditCampaignPage = res.page;
        this.creditCampaignPage.templateData.mainForm = this.data.page.templateData.mainForm;
        this.creditCampaignPage.templateData.cBnplStores = this.cBnplStores;
        const benefits = [];
        res.page.templateData.sectionValue.values.forEach((item) => {
          benefits.push({
            icon: item.featureIcon,
            text: item.featureText,
          });
        });
        this.digiPayBenefit = {
          title: 'مزایای خرید اعتباری دیجی‌پی',
          benefits: benefits,
        };
        this.contactForm = this.data.contactForms;
        this.loaded = true;

        this.route.queryParams.subscribe((params) => {
          if (Object.prototype.hasOwnProperty.call(params, 'openStepper')) {
            this.openNobitexSttepperDialog();
            this.removeQueryParam('openStepper');
          }
        });
      });
      this.isUserLogedInSubscription = this.userService.isLoggedIn.subscribe((isLogedIn) => {
        this.isUserLogedIn = isLogedIn;
      });
      this.nobitexCalculator = this.nobitexCredit.nobitexCalculator;

      this.nobitexCredit.estimate$.subscribe((estimate) => {
        if (estimate) {
          this.timer().subscribe({
            next: () => {
              this.scroller.scrollToAnchor('nobitexPlans');
            },
          });
        }
      });

      this.nobitexCredit.submittedNobitexCreit$.subscribe((submitted) => {
        if (submitted) {
          this.timer().subscribe({
            next: () => {
              this.scroller.scrollToAnchor('nobitex-submited');
            },
          });
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.isUserLogedInSubscription?.unsubscribe();
  }

  removeQueryParam(param: string): void {
    const queryParams = { ...this.route.snapshot.queryParams };
    delete queryParams[param];
    this.router.navigate([]);
  }

  showNobitexStepper() {
    if (!this.isUserLogedIn) {
      this.login();
    } else {
      this.openNobitexSttepperDialog();
    }
  }

  login() {
    if (isPlatformBrowser(this.platformId)) {
      const queryObject = new URLSearchParams();
      const queryParams = {
        ...this.route.snapshot.queryParams,
        openStepper: true,
      };
      for (const key in queryParams) {
        queryObject.set(key, queryParams[key]);
      }

      this.userService.redirectUrlAfterLogin = window.location.origin + '/campaigns/nobitex?' + queryObject.toString();
      if (!this.userService.isLoggedIn.getValue()) {
        this.dialogref.open(UiDialogLoginComponent, {}).then((result) => {
          if (!result?.success) {
            this.userService.redirectUrlAfterLogin = '';
          }
        });
      }
    }
  }

  openNobitexSttepperDialog() {
    this.dialog.closeAll();
    this.dialog.open(NobitexStepperDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: {
        fullHeightBottomSheet: true,
        image: this.creditCampaignPage.templateData.sectionCounter.image,
        contactForm: this.contactForm,
      },
    });
  }

  private timer(): Observable<string> {
    return of('').pipe(delay(1));
  }
}

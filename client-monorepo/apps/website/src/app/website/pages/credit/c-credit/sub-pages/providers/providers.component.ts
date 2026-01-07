import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageClient } from '../../../../../../api/clients/page-client';
import { SeoService } from '../../../../../services/seo.service';
import { Page } from '../../../../../../api/clients/models/content/page';
import { ActivatedRoute, Router } from '@angular/router';
import { ProvidersTemplateData } from '../../../../../../api/clients/models/templates/c-credit/providers/providers-template-data';
import { environment } from '../../../../../../../environments/environment';
import { CreditCalculatorService } from '../../../../../../api/clients/credit/credit-calculator/credit-calculator.service';
import { FaqService } from '../../../../../services/faq.service';
import { FaqItem } from '../../../../../../api/clients/models/templates/services/faq';
import { UiFaqComponent } from '../../../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiSeoComponent } from '../../../../../../ui/ui-components/ui-seo/ui-seo/ui-seo.component';
import { UiButtonComponent } from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { ProvidersSegmentsComponent } from './components/providers-segments/providers-segments.component';
import { ProvidersCalculatorComponent } from './components/providers-calculator/providers-calculator.component';
import { BaseLayoutComponent } from '../../../../../layout/base-layout/base-layout.component';
import { NgIf } from '@angular/common';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    BaseLayoutComponent,
    ProvidersCalculatorComponent,
    ProvidersSegmentsComponent,
    UiButtonComponent,
    UiSeoComponent,
    UiFaqComponent,
  ],
})
export class ProvidersComponent implements OnInit, AfterContentChecked {
  providersPageData!: Page<ProvidersTemplateData>;

  fundProvider: any;

  loaded = false;

  selectedCollateral: string;

  isContinueCtaDisplayed = false;

  selectedAmount = '';

  selectedInstallment = '';

  faqItems: FaqItem[] = [];

  buttonLink: string;

  constructor(
    private pageClient: PageClient,
    private seo: SeoService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private creditCalculatorService: CreditCalculatorService,
    private faqService: FaqService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.getPageData();
    this.isContinueCtaDisplayed = this.router.url.includes(this.fundProvider.fundProviderName);
  }

  ngAfterContentChecked() {
    this.buttonLink = `${environment.appUrl}/service/credit/pre-register?fundProviderCode=${this.fundProvider.fundProviderCode}&amount=${this.selectedAmount}&installmentCount=${this.selectedInstallment}&utm_source=website&utm_medium=${this.fundProvider.fundProviderName}`;
  }

  getPageData() {
    this.fundProvider = this.findFundProvider((fundProvider) => this.router.url.includes(fundProvider.fundProviderName));
    this.pageClient.getPage('c-credit', this.fundProvider.fundProviderName).subscribe((res) => {
      this.providersPageData = res.page;
      this.seo.setGlobalMetaTagsFromPage(res.page);
      this.route.queryParams.subscribe((params) => {
        if (params.collateral) {
          this.selectedCollateral = params.collateral;
        }
      });
      if (res.page.templateData.faq && res.page.templateData.faq.categoryId) {
        this.faqService.getFaqFromSupport(res.page.templateData.faq.categoryId).subscribe((res) => {
          this.faqItems = res;
          of('')
            .pipe(delay(500))
            .subscribe({
              next: () => {
                this.loaded = true;
              },
            });
        });
      } else {
        of('')
          .pipe(delay(500))
          .subscribe({
            next: () => {
              this.loaded = true;
            },
          });
      }
    });
  }

  findFundProvider(findProviderCriteria) {
    return this.creditCalculatorService.fundProviders.find(findProviderCriteria);
  }

  changeCollateral(collateral: string) {
    this.selectedCollateral = collateral;
    this.changeDetector.detectChanges();
  }

  selectedAmountChange(selectedAmount) {
    this.selectedAmount = selectedAmount;
  }

  selectedInstallmentChange(selectedInstallment) {
    this.selectedInstallment = selectedInstallment;
  }
}

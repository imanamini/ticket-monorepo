import { AfterContentChecked, Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Page } from '../../../../api/clients/models/content/page';
import { InstallmentSaleData } from '../../../../api/clients/models/templates/installment-sale/installment-sale.data';
import { PageDataService } from '../../../services/page-data.service';
import { DOCUMENT, NgIf } from '@angular/common';
import { UiFaqComponent } from '../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiHorizontalFlowComponent } from '../../../../ui/ui-components/ui-horizontal-flow/ui-horizontal-flow/ui-horizontal-flow.component';
import { CreditCalculatorBasedOnBasketAmountComponent } from '../../../../ui/ui-components/ui-credit/credit-calculator-based-on-basket-amount/credit-calculator-based-on-basket-amount.component';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiBasicSegmentComponent } from '../../../../ui/ui-components/ui-basic-segment/ui-basic-segment/ui-basic-segment.component';
import { InstallmentSaleIntroComponent } from './components/installment-sale-intro/installment-sale-intro.component';
import { InstallmentSaleHeaderComponent } from './components/installment-sale-header/installment-sale-header.component';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-installment-sale',
  templateUrl: './installment-sale.component.html',
  styleUrls: ['./installment-sale.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    BaseLayoutComponent,
    InstallmentSaleHeaderComponent,
    InstallmentSaleIntroComponent,
    UiBasicSegmentComponent,
    UiButtonComponent,
    CreditCalculatorBasedOnBasketAmountComponent,
    UiHorizontalFlowComponent,
    UiFaqComponent,
  ],
})
export class InstallmentSaleComponent implements OnInit, AfterContentChecked {
  installmentSellsPage!: Page<InstallmentSaleData>;

  loaded = false;

  constructor(
    private pageDataService: PageDataService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) public platformId: string,
  ) {}

  @HostListener('window:scroll', []) // for window scroll events
  onScroll() {
    this.reveal();
  }

  ngOnInit(): void {
    this.pageDataService.getPageData('credit', 'installment-sale').subscribe((res) => {
      this.installmentSellsPage = res.page;
      of('')
        .pipe(delay(500))
        .subscribe({
          next: () => {
            this.loaded = true;
          },
        });
    });
  }

  ngAfterContentChecked() {
    this.reveal();
  }

  reveal() {
    if (isPlatformBrowser(this.platformId)) {
      const reveals = this.document.querySelectorAll('ui-basic-segment');
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 250;

        if (elementTop < windowHeight - elementVisible) {
          if (i % 2 != 0) {
            if (isPlatformBrowser(this.platformId)) {
              reveals[i].classList.add('fade-right', 'active');
            }
          } else {
            if (isPlatformBrowser(this.platformId)) {
              reveals[i].classList.add('fade-left', 'active');
            }
          }
        }
      }
    }
  }
}

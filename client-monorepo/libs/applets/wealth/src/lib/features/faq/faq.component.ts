import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxTabsComponent, NgxTabComponent } from '@digipay/ngx-tabs';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { HOME_ROUTE } from '../../data-access/constants/app-routes';
import { FaqItemComponent } from './components/faq-item/faq-item.component';
import { IFaqResponse } from './data-access/models';
import { FaqService } from './data-access/services/faq.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  imports: [NgxAppBarComponent, SpinnerComponent, NgxTabsComponent, NgxTabComponent, FaqItemComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqComponent implements OnInit {
  private faqService = inject(FaqService);
  private navigationService = inject(WealthNavigationService);

  isLoading = signal<boolean>(false);
  faqs = signal<IFaqResponse | undefined>(undefined);
  selectedTabType = signal<string>('fixedIncome');

  fxTab = computed(() => {
    return {
      label: 'صندوق درامد ثابت',
      faqs: this.faqs()?.fixedIncome || [],
      type: 'fixedIncome',
    };
  });
  stockTab = computed(() => {
    return {
      label: 'صندوق سهامی',
      faqs: this.faqs()?.stock || [],
      type: 'stock',
    };
  });
  tabs = computed(() => {
    return [this.fxTab(), this.stockTab()];
  });

  ngOnInit(): void {
    this.faqService.getFaq().subscribe((faqs) => {
      this.faqs.set(faqs);
    });
  }

  onBackHandler() {
    this.navigationService.navigate([HOME_ROUTE]);
  }
}

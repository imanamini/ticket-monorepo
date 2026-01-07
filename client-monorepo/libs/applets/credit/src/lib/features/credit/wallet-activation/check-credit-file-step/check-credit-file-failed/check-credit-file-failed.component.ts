import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { SwitchOption } from '../../../data-access/models/switch-option.model';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CheckCreditFileFailedResult, CheckCreditFileFailedResultType } from './check-credit-file-failed-result';
import { CheckCreditFileChequeAndLoan } from '../../../data-access/models/credit/activation/check-credit-file/check-credit-file-status.response';
import { FormsModule } from '@angular/forms';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { TabGroupComponent } from '../../../components/tab-group/tab-group.component';
import { CheckCreditFileFailedService } from './services/check-credit-file-failed.service';
import { CheckCreditFileFailedChequesComponent } from './check-credit-file-failed-cheques/check-credit-file-failed-cheques.component';
import { CheckCreditFileFailedLoansComponent } from './check-credit-file-failed-loans/check-credit-file-failed-loans.component';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { TabConfig } from '../../../data-access/models/tabs-config';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';

const TAB_CONFIGURATIONS = [
  {
    id: CheckCreditFileFailedResultType.LOANS,
    label: 'اقساط معوق',
    component: CheckCreditFileFailedLoansComponent,
    isActive: true,
  },
  {
    id: CheckCreditFileFailedResultType.CHEQUES,
    label: 'چک برگشتی',
    component: CheckCreditFileFailedChequesComponent,
    isActive: false,
  },
] as const;

@Component({
  selector: 'app-check-credit-file-failed',
  standalone: true,
  imports: [
    PipesModule,
    FormsModule,
    NgxButtonComponent,
    TabGroupComponent,
    NgxCheckboxComponent,
    NgxCalloutComponent,
    CreditScrollableViewComponent,
  ],
  templateUrl: './check-credit-file-failed.component.html',
  styleUrl: './check-credit-file-failed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckCreditFileFailedComponent implements OnInit {
  // Alert messages
  readonly alertTitle = ' توجه داشته باشید';
  readonly alertDescription =
    'بدون تسویه موارد نام برده ادامه مراحل دریافت وام امکان‌پذیر نیست. لذا به بانکی که در آن بدهی دارید مراجعه نمائید و پس از تسویه به دیجی‌پی بازگردید.';

  // Inputs and signals
  creditCheckFileDetails = input<CheckCreditFileFailedResult>();

  operatorSwitchOptions = computed<SwitchOption[]>(() =>
    TAB_CONFIGURATIONS.map(() => {
      const switchOption = new SwitchOption();
      switchOption.isActive = true;
      return switchOption;
    }),
  );

  accepted = signal<boolean>(false);
  selectedOption = signal<SwitchOption>(this.operatorSwitchOptions()[0]);

  // Tabs configuration
  tabs = signal<Array<TabConfig>>([]);

  // Outputs
  reloadStatus = output<void>();
  checkCreditFileFailedService = inject(CheckCreditFileFailedService);

  ngOnInit(): void {
    this.initTabs();
    this.checkCreditFileFailedService.setFailedData(this.creditCheckFileDetails()!);
  }

  private initTabs() {
    this.tabs.set(
      TAB_CONFIGURATIONS.map((config) => ({
        id: config.id,
        label: signal(config.label),
        isActive: signal(config.isActive),
        component: signal(config.component),
      })),
    );
  }

  // Retrieve documents for the selected option
  getDocumentsForSelectedOption(): CheckCreditFileChequeAndLoan[] {
    const activeTab = this.tabs().find((tab) => tab.isActive() === true);
    const selectedOptionId = activeTab?.id;
    if (selectedOptionId === CheckCreditFileFailedResultType.LOANS || selectedOptionId === CheckCreditFileFailedResultType.CHEQUES) {
      return this.creditCheckFileDetails()?.[selectedOptionId] || [];
    }
    return [];
  }

  // New method to help with debugging
  hasDocuments(): boolean {
    const documents = this.getDocumentsForSelectedOption();
    return documents.length > 0;
  }
}

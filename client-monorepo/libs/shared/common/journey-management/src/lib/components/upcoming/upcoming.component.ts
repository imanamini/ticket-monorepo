import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BaseJmRendererComponent,
  BaseJourney,
  buttonConfig,
  DisplayState,
  JmConfig,
  JmMode,
  JourneyManagerActions,
  NextAction,
} from '@client-monorepo/common/journey-management';
import { BillApiResponse, BillApiService, BillPayment } from '@client-monorepo/daily-fintech/bill';
import { Action } from '@client-monorepo/common/action-handler';
import { Observable, zip } from 'rxjs';
import { JourneyManagementService } from '../../data-access/services/journey-management.service';
import {
  Payment,
  TransactionApiResponse,
  TransactionsApiService,
  UpcomingBillPayload,
  UpcomingInstallmentPayload,
} from '@client-monorepo/payment/transactions';

@Component({
  selector: 'common-journey-management-upcoming',
  standalone: true,
  imports: [CommonModule, BaseJmRendererComponent],
  templateUrl: './upcoming.component.html',
  styleUrl: './upcoming.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpcomingComponent implements OnInit {
  // Injections
  billApiService = inject(BillApiService);
  transactionsApiService = inject(TransactionsApiService);
  // Inputs
  data = input<NextAction>();
  jmMode = input<JmMode>(JmMode.NEXT_ACTION);

  // Variables
  baseJourneyData = signal<BaseJourney | undefined>(undefined);
  jmConfig = computed<JmConfig>(() => {
    return {
      data: this.baseJourneyData(),
      mode: this.jmMode(),
    } as JmConfig;
  });
  isLoading = computed(() => this.displayState() === 'pending');

  displayState = signal<DisplayState>('pending');
  journeyManagementService = inject(JourneyManagementService);
  title = '';
  subtitle = '';
  action = signal<Action | undefined>(undefined);

  ngOnInit(): void {
    this.getUpcomingJobs();
  }

  getUpcomingJobs(): void {
    this.setDisplayState('pending');
    zip([this.getUpcomingInstallments(), this.getUpcomingBills()]).subscribe({
      next: ([installments, bills]) => {
        this.extractBaseDataFromNextAction(installments.paymentList, bills.paymentList);
      },
    });
  }

  getUpcomingBills(): Observable<BillApiResponse> {
    return this.billApiService.getUpcomingBills();
  }

  getUpcomingInstallments(): Observable<TransactionApiResponse> {
    return this.transactionsApiService.getUpcomingInstallmentTransactions();
  }

  generateBaseJourneyData(): void {
    this.baseJourneyData.set({
      title: this.title,
      description: this.subtitle,
      primaryAction: this.generatePrimaryAction(),
      secondaryActions: [],
      badges: [],
    });
  }

  extractBaseDataFromNextAction(installments: Payment[], bills: BillPayment[]): void {
    const paymentCount = installments.length + bills.length;
    if (paymentCount === 0) {
      this.setDisplayState('hidden');
      return;
    }
    this.generateTitle(paymentCount);
    this.generateSubtitle(installments, bills);
    this.generatePrimaryAction();
    this.generateBaseJourneyData();
    this.setDisplayState('visible');
  }

  generateTitle(paymentCount: number): void {
    this.title = paymentCount + ' پرداخت پیش رو';
  }

  generateSubtitle(installments: Payment[], bills: BillPayment[]): void {
    for (const payment of installments) {
      this.subtitle += ' | ' + (payment.payload as UpcomingInstallmentPayload).fundProviderTitle;
    }

    for (const payment of bills) {
      this.subtitle += ' | ' + (payment as UpcomingBillPayload).payload.billInfo.name;
    }

    this.subtitle = this.subtitle.replace(' | ', '');
  }

  generatePrimaryAction(): buttonConfig {
    return {
      text: 'پرداخت',
      action: {
        actionType: JourneyManagerActions.REDIRECT,
        actionData: {
          target: '/transactions',
        },
      },
    };
  }

  setDisplayState(state: DisplayState) {
    this.displayState.set(state);
    this.journeyManagementService.setDisplayState(String(this.data()?.id), state);
  }
}

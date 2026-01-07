import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnInit, signal, untracked } from '@angular/core';
import { ContractInstallmentSummary } from '../../data-access/models/credit/installment/contract-installment-summary';
import { Router } from '@angular/router';
import { CreditUrlService } from '../../data-access/utils/url';
import { CONTRACT_DEBT_STATUS, CONTRACT_DEBT_STATUS_TRANSLATION } from '../../data-access/models/credit/installment/contract-debt-status';
import { CreditWalletContractCardComponent } from './credit-wallet-contract-card/credit-wallet-contract-card.component';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { CreditInstallmentWidgetComponent } from '../credit-installment-widget/credit-installment-widget.component';
import {
  InstallmentsOverviewBnplHistoryStateKey,
  InstallmentsOverviewBnplInitSelected,
} from '../../installments-overview/data-access/installments-overview-bnpl';
import { CallbackInstallmentsOverviewKey } from '../../credit-payment-callback/components/credit-payment-callback-installments-overview/credit-payment-callback-installments-overview.component';

interface WidgetInfo {
  show: boolean;
  state: 'DueWithPenalty' | 'Due';
  amount: number;
  count: number;
  singleInstallmentDueDate?: number;
}

@Component({
  selector: 'app-credit-wallet-detail-multi-contract',
  templateUrl: './credit-wallet-detail-multi-contract.component.html',
  styleUrls: ['./credit-wallet-detail-multi-contract.component.scss'],
  standalone: true,
  imports: [CreditWalletContractCardComponent, CreditInstallmentWidgetComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditWalletDetailMultiContractComponent implements OnInit {
  creditId = input.required<string>();

  contracts = input<ContractInstallmentSummary[]>();

  fundProviderCode = input.required<number>();

  totalInstallmentCount = input<number>();

  aggregationEnabled = input<boolean>();

  maxPaymentAmount = input<number>();

  categorizedData = signal<
    | {
        title: string;
        contracts: ContractInstallmentSummary[];
      }[]
    | null
  >(null);

  widgetInfo = computed<WidgetInfo>(() => this.setWidgetInfo());

  private router = inject(Router);
  private creditUrlService = inject(CreditUrlService);
  private eventService = inject(NgxEventTrackerService);
  statusGroupsOrder: CONTRACT_DEBT_STATUS[] = [
    CONTRACT_DEBT_STATUS.DUE,
    CONTRACT_DEBT_STATUS.CURRENT,
    CONTRACT_DEBT_STATUS.SETTLED,
    CONTRACT_DEBT_STATUS.UNPAYABLE,
  ];
  statusTranslation = CONTRACT_DEBT_STATUS_TRANSLATION;

  constructor() {
    effect(
      () => {
        const contractsValue = this.contracts();
        if (contractsValue) {
          untracked(() => {
            this.categorizeContracts();
          });
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.categorizeContracts();
  }

  private setWidgetInfo() {
    const widgetInfo: WidgetInfo = {
      show: false,
      state: 'Due',
      count: 0,
      amount: 0,
    };
    const dueContracts = this.contracts()?.filter((contract) => contract.status === CONTRACT_DEBT_STATUS.DUE);
    if (dueContracts && dueContracts.length > 0) {
      widgetInfo.show = true;
      dueContracts.forEach((contract) => {
        contract.installmentGroups.forEach((group) => {
          if (group.payable) {
            group.installments?.forEach((ins) => {
              if (ins.penaltyAmount) {
                widgetInfo.state = 'DueWithPenalty';
              }
              widgetInfo.count += 1;
              widgetInfo.amount += ins.amount + ins.penaltyAmount - ins.penaltyWaiverAmount;
            });
          }
        });
      });
    }
    return widgetInfo;
  }

  categorizeContracts() {
    this.categorizedData.set([]);
    if (!this.contracts()) {
      return;
    }
    this.statusGroupsOrder.forEach((status) => {
      const filteredContracts = this.contracts()?.filter((item) => item.status === status);
      if (filteredContracts && filteredContracts.length > 0) {
        this.categorizedData.update((data) => [
          ...data!,
          {
            title: this.statusTranslation[status],
            contracts: filteredContracts,
          },
        ]);
      }
    });
  }

  goToContractDetail(contract: ContractInstallmentSummary) {
    this.router
      .navigateByUrl(this.creditUrlService.getInnerServicePath(`/contract/detail/${contract.contractTrackingCode}/${this.creditId()}`))
      .then(() => {
        this.eventService.sendEvent({
          eventName: 'BNPL_BD',
          eventData: {},
        });
      });
  }

  goToInstallmentsOverview() {
    this.router.navigate(['service/credit/installments-overview'], {
      queryParams: {
        serviceType: 'bnpl',
        [CallbackInstallmentsOverviewKey]: encodeURIComponent(window.location.pathname + window.location.search),
      },
      state: {
        [InstallmentsOverviewBnplHistoryStateKey]: {
          type: 'Account',
          creditId: this.creditId(),
        } as InstallmentsOverviewBnplInitSelected,
      },
    });
  }
}

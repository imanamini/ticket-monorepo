import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractInstallmentSummary } from '../../data-access/models/credit/installment/contract-installment-summary';
import { CONTRACT_DEBT_STATUS } from '../../data-access/models/credit/installment/contract-debt-status';
import { CreditEmptyBillViewComponent } from '../credit-empty-bill-view/credit-empty-bill-view.component';
import { getContractTitle } from '../utils/get-contract-title';
import { NgxIcon } from '@digipay/ngx-icon';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { RouterLink } from '@angular/router';

interface SerializedContract {
  contractTrackingCode: string;
  title: string;
  amount: number;
}

@Component({
  selector: 'app-bnpl-contracts-settled-segment',
  standalone: true,
  imports: [CommonModule, CreditEmptyBillViewComponent, NgxIcon, PipesModule, RouterLink],
  templateUrl: './bnpl-contracts-settled-segment.component.html',
  styleUrl: './bnpl-contracts-settled-segment.component.scss',
})
export class BnplContractsSettledSegmentComponent {
  contracts = input.required<ContractInstallmentSummary[]>();
  creditId = input.required<string>();

  settledInstallmentExists = computed(() => this.contracts().some((c) => c.status === CONTRACT_DEBT_STATUS.SETTLED));
  serializedContracts = computed<SerializedContract[]>(() => {
    const settledContracts = this.contracts()
      .filter((c) => c.status === CONTRACT_DEBT_STATUS.SETTLED)
      .sort((a, b) => a.startDate - b.startDate);

    return settledContracts.map((c) => {
      return {
        contractTrackingCode: c.contractTrackingCode,
        title: getContractTitle(c.title, c.billingCycleDate),
        amount: c.debtAmount!,
      };
    });
  });
}

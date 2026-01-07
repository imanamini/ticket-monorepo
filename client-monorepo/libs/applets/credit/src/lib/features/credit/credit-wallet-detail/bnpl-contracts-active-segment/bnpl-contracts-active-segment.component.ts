import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractInstallmentSummary } from '../../data-access/models/credit/installment/contract-installment-summary';
import { InstallmentsBrickViewerComponent } from './installments-brick-viewer/installments-brick-viewer.component';
import { NgxIcon } from '@digipay/ngx-icon';
import { CreditEmptyBillViewComponent } from '../credit-empty-bill-view/credit-empty-bill-view.component';
import { CONTRACT_DEBT_STATUS } from '../../data-access/models/credit/installment/contract-debt-status';
import { InstallmentBrick } from './installments-brick-viewer/data-access/installment-brick';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { RouterLink } from '@angular/router';
import { getContractTitle } from '../utils/get-contract-title';

interface SerializedContract {
  contractTrackingCode: string;
  title: string;
  installmentsBrick: InstallmentBrick[];
  amount: number;
}

@Component({
  selector: 'app-bnpl-contracts-active-segment',
  standalone: true,
  imports: [CommonModule, InstallmentsBrickViewerComponent, NgxIcon, CreditEmptyBillViewComponent, PipesModule, RouterLink],
  templateUrl: './bnpl-contracts-active-segment.component.html',
  styleUrl: './bnpl-contracts-active-segment.component.scss',
})
export class BnplContractsActiveSegmentComponent {
  contracts = input.required<ContractInstallmentSummary[]>();
  creditId = input.required<string>();

  activeInstallmentExists = computed<boolean>(() => {
    return this.contracts().some((c) => c.status !== CONTRACT_DEBT_STATUS.SETTLED);
  });
  serializedContracts = computed<SerializedContract[]>(() => {
    const activeContracts = this.contracts()
      .filter((c) => c.status !== CONTRACT_DEBT_STATUS.SETTLED)
      .sort((a, b) => a.startDate - b.startDate);

    return activeContracts.map((c) => {
      return {
        contractTrackingCode: c.contractTrackingCode,
        title: getContractTitle(c.title, c.billingCycleDate),
        amount: c.debtAmount!,
        installmentsBrick: this.getContractInstallmentsBrick(c),
      };
    });
  });

  private getContractInstallmentsBrick(contract: ContractInstallmentSummary): InstallmentBrick[] {
    const bricksCount: Record<InstallmentBrick, number> = {
      success: 0,
      error: 0,
      default: 0,
    };
    contract.installmentGroups.forEach((group) => {
      switch (group.order) {
        case 0:
          bricksCount.error = group.installments?.length ?? 0;
          break;
        case 1:
          bricksCount.default = group.installments?.length ?? 0;
          break;
        case 2:
          bricksCount.success = group.installments?.length ?? 0;
          break;
      }
    });
    const errorBrick = Array(bricksCount.error).fill('error');
    const defaultBrick = Array(bricksCount.default).fill('default');
    const successBrick = Array(bricksCount.success).fill('success');
    return successBrick.concat(errorBrick).concat(defaultBrick);
  }
}

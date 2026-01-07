import { Component, inject, OnInit, signal } from '@angular/core';
import { CreditApiService } from '../data-access/services/credit-api.service';
import { FormattedInstallmentsShowModel } from './models/formatted-installments-show.model';
import { TotalInstallmentsResponse } from '../data-access/models/credit/total-installments/total-installments';
import { CreditNavigationService } from '../data-access/services/credit-navigation.service';
import { TotalInstallmentsErrorComponent } from './total-installments-error/total-installments-error.component';
import { TotalInstallmentsEmptyComponent } from './total-installments-empty/total-installments-empty.component';
import { TotalInstallmentsSkeletonComponent } from './total-installments-skeleton/total-installments-skeleton.component';
import { TotalInstallmentListComponent } from './total-installment-list/total-installment-list.component';
import { CreditAppBarComponent } from '../components/credit-app-bar/credit-app-bar.component';

enum Status {
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  EMPTY = 'EMPTY',
  SUCCESS = 'SUCCESS',
}

@Component({
  selector: 'app-total-installments',
  templateUrl: './total-installments.component.html',
  styleUrl: './total-installments.component.scss',
  standalone: true,
  imports: [
    CreditAppBarComponent,
    TotalInstallmentListComponent,
    TotalInstallmentsSkeletonComponent,
    TotalInstallmentsEmptyComponent,
    TotalInstallmentsErrorComponent,
  ],
})
export class TotalInstallmentsComponent implements OnInit {
  status = signal<Status | null>(null);
  totalInstallments = signal<any>([]);
  formattedInstallments = signal<FormattedInstallmentsShowModel | null>(null);
  protected statusEnum = Status;
  private apiService = inject(CreditApiService);
  private creditNavigationService = inject(CreditNavigationService);

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.status.set(Status.LOADING);
    this.apiService.getTotalInstallments().subscribe({
      next: (response) => {
        this.totalInstallments.set(response);
        this.formattedInstallments.set(this.formatDataToInstallmentList(response));
        if (this.formattedInstallments()?.dueInstallments?.length! > 0 || this.formattedInstallments()?.currentInstallments?.length! > 0) {
          this.status.set(Status.SUCCESS);
        } else {
          this.status.set(Status.EMPTY);
        }
      },
      error: () => {
        this.status.set(Status.ERROR);
      },
    });
  }

  formatDataToInstallmentList(data: TotalInstallmentsResponse): FormattedInstallmentsShowModel {
    const formattedInstallments: FormattedInstallmentsShowModel = {
      dueInstallments: [],
      currentInstallments: [],
    };
    data.installmentDebt.forEach((contract) => {
      contract.installments.forEach((ins) => {
        const installmentsWithContractInfo = {
          ...ins,
          contract: {
            contractTrackingCode: contract.contractTrackingCode,
            billingCycleDate: contract.billingCycleDate,
            count: contract.count,
            penaltyPercentagePerDay: contract.penaltyPercentagePerDay,
            feeDetails: contract.feeDetails,
          },
        };

        if (ins.isDue) {
          formattedInstallments?.dueInstallments?.push(installmentsWithContractInfo);
        } else {
          formattedInstallments?.currentInstallments?.push(installmentsWithContractInfo);
        }
      });
    });

    formattedInstallments?.dueInstallments?.sort((a, b) => a.dueDate - b.dueDate);
    formattedInstallments?.currentInstallments?.sort((a, b) => a.dueDate - b.dueDate);
    return formattedInstallments;
  }

  back() {
    window.history.back();
  }
}

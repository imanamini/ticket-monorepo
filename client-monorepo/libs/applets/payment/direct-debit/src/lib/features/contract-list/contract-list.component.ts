import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractListCardComponent } from '../../components/contract-list-card/contract-list-card.component';
import { DirectDebitApiService } from '../../data-access/services/direct-debit-api.service';
import { DirectDebitContract, DirectDebitContractStatus } from '../../data-access/model/direct-debit.model';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { Router } from '@angular/router';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { NgxSkeletonLoadingComponent } from "@digipay/ngx-skeleton-loading";

@Component({
  selector: 'direct-debit-contract-list',
  standalone: true,
  imports: [CommonModule, ContractListCardComponent, NgxSpinnerModule, PageLayoutComponent, NgxSkeletonLoadingComponent],
  templateUrl: './contract-list.component.html',
  styleUrl: './contract-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DirectDebitApiService],
})
export class ContractListComponent {
  private readonly api = inject(DirectDebitApiService);
  private readonly router = inject(Router);

  public loading = signal<boolean>(false);
  public data = signal<DirectDebitContract[]>([]);

  ngOnInit(): void {
    this.getContracts();
  }

  onBack() {
    this.router.navigate(['/wallet-management']);
  }

  getContracts() {
    this.loading.set(true);
    this.api
      .getContractSearch({
        size: 1,
        orders: [
          {
            field: 'creationDate',
            order: 'desc',
          },
        ],
        restrictions: [
          {
            type: 'and',
            field: 'status',
            restrictions: [
              {
                field: 'status',
                type: 'simple',
                operation: 'ne',
                value: DirectDebitContractStatus.PENDING,
              },
              {
                field: 'status',
                type: 'simple',
                operation: 'ne',
                value: DirectDebitContractStatus.FAILED,
              },
              {
                field: 'status',
                type: 'simple',
                operation: 'ne',
                value: DirectDebitContractStatus.ABANDONED,
              },
              {
                field: 'status',
                type: 'simple',
                operation: 'ne',
                value: DirectDebitContractStatus.INITIATED,
              },
            ],
          },
        ],
      })

      .subscribe({
        next: (data) => {
          const { contracts } = data;
          this.data.set([...contracts]);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }

  navigateToFaq() {
    this.router.navigate(['/direct-debit/faq']);
  }
}

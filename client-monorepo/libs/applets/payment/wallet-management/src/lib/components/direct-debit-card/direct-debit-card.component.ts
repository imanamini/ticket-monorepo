import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxIcon } from '@digipay/ngx-icon';
import {
  DirectDebitContract,
  DirectDebitContractStatus,
} from 'libs/applets/payment/direct-debit/src/lib/data-access/model/direct-debit.model';
import { DirectDebitApiService } from 'libs/applets/payment/direct-debit/src/lib/data-access/services/direct-debit-api.service';
import { AutoCashInApiService } from '../../data-access/services/auto-cash-in-api.service';
import { DirectDebitAutoCashIn } from '../../data-access/models/direct-debit.model';

@Component({
  selector: 'wallet-mng-applet-direct-debit-card',
  standalone: true,
  imports: [CommonModule, NgxIcon, NgxButtonComponent],
  templateUrl: './direct-debit-card.component.html',
  styleUrl: './direct-debit-card.component.scss',
  providers: [DirectDebitApiService],
})
export class DirectDebitCardComponent implements OnInit {
  private router = inject(Router);
  private directDebit = inject(DirectDebitApiService);
  private api = inject(AutoCashInApiService);


  directDebitContractActive = computed(() =>
    (this.directDebitContract() ?? []).filter((item) => item.status === DirectDebitContractStatus.ACTIVE),
  );
  directDebitContract = signal<DirectDebitContract[] | null>(null);
  loading = signal<boolean>(false);
  config = signal<DirectDebitAutoCashIn | null>(null);

  ngOnInit(): void {
    this.getDirectDebitContracts();
    this.getAutoCashInData();
  }

  getAutoCashInData() {
    this.loading.set(true);
    this.api.getConfig().subscribe({
      next: (data) => {
        this.config.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
  private getDirectDebitContracts() {
    this.directDebit
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
          this.directDebitContract.set(contracts);
        },
      });
  }

  navigateToDirectDebitCreate(): void {
    this.router.navigate(['/direct-debit/create']);
  }
  navigateToAutoCashIn(): void {
    this.router.navigate(['/wallet-management/auto-cash-in']);
  }
  navigateToDirectDebitList(): void {
    this.router.navigate(['/direct-debit/list']);
  }
}

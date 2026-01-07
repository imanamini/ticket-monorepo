import { ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '@digipay/ui-form-field-builder';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { AutoCashInApiService } from '../../data-access/services/auto-cash-in-api.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { DirectDebitAutoCashInResponse } from '../../data-access/models/direct-debit.model';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { Router } from '@angular/router';
import { DirectDebitApiService } from 'libs/applets/payment/direct-debit/src/lib/data-access/services/direct-debit-api.service';
import {
  DirectDebitContract,
  DirectDebitContractStatus,
} from 'libs/applets/payment/direct-debit/src/lib/data-access/model/direct-debit.model';

@Component({
  selector: 'wallet-mng-applet-direct-debit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DpIconComponent, FormFieldComponent, NgxButtonComponent, PageLayoutComponent],
  templateUrl: './direct-debit-form.component.html',
  styleUrl: './direct-debit-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DirectDebitApiService],
})
export class DirectDebitFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(AutoCashInApiService);
  private directDebit = inject(DirectDebitApiService);
  private route = inject(Router);
  private message = inject(MessageService);
  loading = signal<boolean>(false);
  defaultSuggest = [500_000, 1_000_000, 5_000_000];

  form = this.fb.group({
    cashInAmount: [0, [Validators.required]],
    minimumBalance: [0, [Validators.required]],
  });
  cashInAmountSuggest = signal<number[]>([]);
  config = signal<DirectDebitAutoCashInResponse | null>(null);
  contract: DirectDebitContract[] = [];

  ngOnInit(): void {
    this.getAutoCashInData();
    this.getDirectDebitContracts();
  }

  getAutoCashInData() {
    this.api.getConfig().subscribe({
      next: (data) => {
        this.config.set({ ...data });
        this.patchFormValue();
      },
    });
  }

  private getDirectDebitContracts() {
    this.loading.set(true);

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
          this.contract = contracts;
          this.calculationCashInAmountSuggest();
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }

  patchFormValue() {
    const config = this.config();
    if (!config?.active) return;
    const { minimumBalance, cashInAmount } = config;
    this.form.patchValue({ cashInAmount: (cashInAmount ?? 0) / 10, minimumBalance: (minimumBalance ?? 0) / 10 });
  }

  isSuggestActive(suggest: number) {
    return Boolean(this.cashInAmountSuggest().find((item) => suggest === item));
  }

  calculationCashInAmountSuggest() {
    const contract = this.contract[0];

    const { maxDailyTransactionAmount } = contract;
    const availableOptions = this.defaultSuggest.filter((option) => option <= (maxDailyTransactionAmount ?? 0) / 10);
    if (availableOptions.length === 0) {
      availableOptions.push(maxDailyTransactionAmount);
    }
    this.cashInAmountSuggest.set(availableOptions);
  }

  patchSuggestionMinimumBalance(value: number) {
    this.form.patchValue({
      minimumBalance: value,
    });
  }

  patchSuggestionCashInAmount(value: number) {
    this.form.patchValue({
      cashInAmount: value,
    });
  }

  deactivate() {
    this.loading.set(true);

    this.api.deactivateConfig().subscribe({
      next: (data) => {
        this.message.showSuccessMessage('عملیات با موفقیت انجام شد');
        this.onBack();
      },
      complete: () => {
        this.loading.set(false);
      },
      error: (error) => {
        this.message.showErrorOfErrorResponse(error);
      },
    });
  }
  onSubmit() {
    const contract = this.contract[0];

    const { maxDailyTransactionAmount } = contract;
    const { cashInAmount, minimumBalance } = this.form.getRawValue();
    if ((cashInAmount ?? 0) * 10 > (maxDailyTransactionAmount ?? 0)) {
      this.message.showErrorMessage(`مبلغ شارژ خودکار کیف پول با مفاد قرارداد ایجاد شده هم‌خوانی ندارد.`);
      return;
    }
    this.api.sendConfig({ cashInAmount: (cashInAmount ?? 0) * 10, minimumBalance: (minimumBalance ?? 0) * 10 }).subscribe({
      next: (data) => {
        this.message.showSuccessMessage('عملیات با موفقیت انجام شد');
        this.onBack();
      },
      complete: () => {
        this.loading.set(false);
      },
      error: (error) => {
        this.message.showErrorOfErrorResponse(error);
      },
    });
  }

  onBack() {
    this.route.navigate(['/wallet-management']);
  }
}

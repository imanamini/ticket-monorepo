import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FundDataService } from '../../../../components/core/services/fund-data.service';
import { PORTFO, RESULT_ROUTE } from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { PortfoService } from '../../services/portfo.service';
import { CashOutConfirmPaymentComponent } from '../../components/cashout-confirm-payment/cash-out-confirm-payment.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { WalletAmountFormComponent } from '../../../wallet/components/wallet-amount-form/wallet-amount-form.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { IWalletInfo } from '../../models/wallet-info.interface';
import { WalletBalanceInfoComponent } from '../../components/wallet-balance-info/wallet-balance-info.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-cash-out',
  standalone: true,
  imports: [
    PipesModule,
    NgxButtonComponent,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    NgxAppBarComponent,
    WalletAmountFormComponent,
    SpinnerComponent,
    WalletBalanceInfoComponent,
  ],
  templateUrl: './cash-out.component.html',
  styleUrl: './cash-out.component.scss',
})
export class CashOutComponent implements OnInit {
  isLoading = signal<boolean>(false);
  isValid = signal<boolean>(false);
  showError = signal<boolean>(false);
  amount = signal<string | undefined>(undefined);
  minAmount = signal<number | undefined>(100_000);
  walletInfo = signal<IWalletInfo[] | undefined>(undefined);
  maxAmount = computed(() => this.getWalletValue(2));

  private portfoService = inject(PortfoService);
  private fundDataService = inject(FundDataService);
  private bottomSheet = inject(NgxBottomSheetService);
  private navigationService = inject(WealthNavigationService);

  ngOnInit(): void {
    this.getData();
  }

  showCashoutConfirmPayment(all?: 'all') {
    this.isLoading.set(true);
    this.portfoService
      .getEtfWalletInfo()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((res) => {
        if (!res?.success) return;

        this.bottomSheet.openBottomSheet(
          CashOutConfirmPaymentComponent,
          {
            data: {
              bankName: res.result?.bankName,
              shebaNumber: res.result?.shabaNumber,
              amount: all ? this.getWalletValue(1) : this.amount(),
            },
          },
          {
            noPadding: true,
          },
        );

        const closeSubscription = this.bottomSheet.onClose.subscribe(() => {
          closeSubscription.unsubscribe();
          if (this.bottomSheet.outputData()) {
            this.cashout(all);
          }
        });
      });
  }

  onBackHandler() {
    this.navigationService.navigate([PORTFO]);
  }

  amountChanged(data: { value: string; valid: boolean }) {
    this.isValid.set(data.valid);
    this.amount.set(data.value);
  }

  cashout(all?: 'all') {
    this.isLoading.set(true);
    this.fundDataService
      .walletCashout({
        amount: all ? this.getWalletValue(1) : this.amount(),
      })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.navigationService.navigate([RESULT_ROUTE], {
            queryParams: {
              isSuccess: res.success ? 'true' : 'false',
              action: 'cashout',
              receiptNumber: res.result,
            },
          });
        },
        error: () => {
          this.navigationService.navigate([RESULT_ROUTE], {
            queryParams: {
              isSuccess: 'false',
              action: 'cashout',
            },
          });
        },
      });
  }

  private getData() {
    this.isLoading.set(true);
    this.portfoService
      .getWalletInfo()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((res) => {
        if (res?.success) {
          this.walletInfo.set(this.mapWalletInfo(res.result));
        }
      });
  }

  private mapWalletInfo(result: any): IWalletInfo[] {
    return [
      { title: 'قدرت خرید', value: result?.balance, id: 1 },
      { title: 'موجودی قابل برداشت', value: result?.withdrawalBalance, id: 2 },
    ];
  }

  private getWalletValue(id: number): number {
    return this.walletInfo()?.find((x) => x.id === id)?.value ?? 0;
  }
}

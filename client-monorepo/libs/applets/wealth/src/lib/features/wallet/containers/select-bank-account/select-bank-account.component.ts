import { ActivatedRoute } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CommonModule } from '@angular/common';
import { WalletService } from '../../services/wallet.service';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { WALLET_WITHDROW_PROCESS_API } from '../../../../data-access/constants/api';
import { MessageService, RouteStateService } from '@client-monorepo/common/utilities';
import { IBankAccount } from '../../../../components/core/models/bank-account.interface';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { BankAccountService } from '../../../../components/core/services/v1/bank-account.service';
import { WALLET_FX_WITHDRAW, WALLET_GOLD_WITHDRAW, WALLET_IBAN_ROUTE } from '../../../../data-access/constants/app-routes';
import { IProcessData, IWalletProcessData } from '../../models/wallet-process.interface';
import { AppBarWrapperComponent } from '../../../../components/core/components/app-bar-wrapper/app-bar-wrapper.component';
import { BankAccountCardComponent } from '../../components/bank-account-card/bank-account-card.component';

@Component({
  selector: 'wealth-applet-select-bank-account',
  standalone: true,
  imports: [CommonModule, AppBarWrapperComponent, NgxButtonComponent, SpinnerComponent, BankAccountCardComponent],
  templateUrl: './select-bank-account.component.html',
  styleUrl: './select-bank-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectBankAccountComponent implements OnInit {
  private walletService = inject(WalletService);
  private messageService = inject(MessageService);
  private routerState = inject(RouteStateService);
  private activatedRoute = inject(ActivatedRoute);
  private bankAccountService = inject(BankAccountService);
  private navigationService = inject(WealthNavigationService);

  loading = signal<boolean>(true);
  state = signal<IProcessData | undefined>(undefined);
  btnLoading = signal<boolean>(false);
  bankAccounts = signal<IBankAccount[]>([]);
  selectedAccountId = signal<number | null>(null);

  private walletId = signal<string>('');

  ngOnInit(): void {
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    this.state.set(this.routerState.getAll());
    this.getBankAccounts();
  }

  getBankAccounts() {
    this.loading.set(true);
    this.bankAccountService.getBankAcccounts().subscribe((bankAccounts) => {
      if (bankAccounts.success && bankAccounts.result.length > 0) {
        this.bankAccounts.set(bankAccounts.result);
        const defaultAccount = bankAccounts.result.find((a) => a.isDefault) || bankAccounts.result[0];
        this.selectedAccountId.set(defaultAccount?.shebaNumberId);
      }
      this.loading.set(false);
    });
  }

  onBackHandler() {
    const withdrawPath = this.state().walletName === 'WALLET_GOLD' ? WALLET_GOLD_WITHDRAW : WALLET_FX_WITHDRAW;
    this.navigationService.navigate([withdrawPath, 'treasury'], {
      state: {
        ...this.state(),
      },
    });
  }

  onSelectAccount(selectedAccount: IBankAccount) {
    this.selectedAccountId.set(selectedAccount.shebaNumberId);
  }

  onDeleteAccount(deletedAccount: IBankAccount) {
    this.bankAccountService.deleteBankAccount(deletedAccount.shebaNumberId).subscribe({
      next: (res) => {
        if (res.success) {
          this.bankAccounts.update((accounts) => accounts.filter((item) => item.shebaNumberId !== deletedAccount.shebaNumberId));

          if (this.selectedAccountId() === deletedAccount.shebaNumberId) {
            const remaining = this.bankAccounts().find((a) => a.isDefault) || this.bankAccounts()[0];
            this.selectedAccountId.set(remaining ? remaining.shebaNumberId : null);
          }
        }
      },
    });
  }

  onAddNewAccount() {
    this.navigationService.navigate([WALLET_IBAN_ROUTE, 'treasury'], {
      state: this.state(),
    });
  }

  cashout() {
    this.btnLoading.set(true);
    const processData: IWalletProcessData = {
      data: {
        ...this.state(),
        walletId: this.walletId(),
        shebaNumberId: this.selectedAccountId(),
      },
    };

    this.walletService.walletProcess(WALLET_WITHDROW_PROCESS_API, processData).subscribe((res) => {
      if (res.result?.action === 'error') {
        this.messageService.showErrorMessage(res.result?.data?.message);
      }
      this.btnLoading.set(false);
    });
  }
}

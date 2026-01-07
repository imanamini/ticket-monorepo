import { ActivatedRoute } from '@angular/router';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { Component, inject, OnInit, signal } from '@angular/core';
import { WalletService } from '../../services/wallet.service';

import { MessageService, RouteStateService } from '@client-monorepo/common/utilities';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { PROSPECTUS_ROUTE, WALLETS_ROUTE } from '../../../../data-access/constants/app-routes';
import { WalletPayableInfoComponent } from '../../components/wallet-payable-info/wallet-payable-info.component';
import { WalletAmountFormComponent } from '../../components/wallet-amount-form/wallet-amount-form.component';
import { WalletTransactionInfoComponent } from '../../components/wallet-transaction-info/wallet-transaction-info.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { IProcessData, IWalletProcessData } from '../../models/wallet-process.interface';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { WALLET_WITHDROW_PROCESS_API } from '../../../../data-access/constants/api';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { EpdfType } from '../../../../components/core/models/instruments.enum';
import { IProspectusRouteState } from '../../../../components/core/models/prospectus-route-state.interface';
import { CustomerService } from '../../../../components/core/services/v1/customer.service';
import { ServiceResult } from '../../../../data-access/models/base/service-result';
import { catchError, EMPTY, filter, finalize, of, switchMap, tap } from 'rxjs';
import { NgClass } from '@angular/common';

@Component({
  selector: 'wealth-applet-wallet-cash-out',
  standalone: true,
  imports: [
    PipesModule,
    NgxButtonComponent,
    NgxAppBarComponent,
    WalletPayableInfoComponent,
    WalletAmountFormComponent,
    NgxCheckboxComponent,
    NgClass,
  ],
  templateUrl: './wallet-cashout.component.html',
  styleUrl: './wallet-cashout.component.scss',
})
export class WalletCashoutComponent implements OnInit {
  btnLoading = signal<boolean>(false);
  isValid = signal<boolean>(false);
  state = signal<IProcessData | undefined>(undefined);
  walletId = signal<string | undefined>(undefined);
  amount = signal<string | undefined>(undefined);
  iban = signal<string | undefined>(undefined);
  agreementChecked = signal<boolean>(false);

  private walletService = inject(WalletService);
  private routeState = inject(RouteStateService);
  private activatedRoute = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private navigationService = inject(WealthNavigationService);
  private customerService = inject(CustomerService);
  protected readonly pdfType = EpdfType;

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    if (!this.state()?.walletName) {
      this.navigationService.navigate([WALLETS_ROUTE, this.walletId()]);
    } else {
      if (this.state().bottomSheetName === 'page_wallet_cach_out_landing_confirmed') {
        this.openBottomSheet(this.state());
      }
      if (this.state().amount) {
        this.isValid.set(true);
      }
    }
  }

  private openBottomSheet(data: IProcessData) {
    const bottomSheetData = {
      type: 'cashOut',
      walletId: this.walletId(),
      walletName: data.walletName,
      walletTitle: data.walletTitle,
      iban: data.shebaNumber,
      amount: data.amount,
    };
    this.bottomSheetService.openBottomSheet(
      WalletTransactionInfoComponent,
      {
        data: bottomSheetData,
      },
      {
        noPadding: true,
      },
    );

    this.bottomSheetService.onClose.subscribe(() => {
      const result = this.bottomSheetService.outputData();
      if (result?.editing) {
        this.amount.set(' ');
        this.state().amount = ' ';
      }
    });
  }

  onBackHandler() {
    this.navigationService.navigate([WALLETS_ROUTE, this.walletId()], {
      state: {
        ...this.state(),
      },
    });
  }

  cashout(segment?: string) {
    if (segment === 'all') {
      this.amount.set(`${this.state().walletWithdrawableBalance}`);
      this.state().amount = this.amount();
    }
    this.btnLoading.set(true);
    const processData: IWalletProcessData = {
      action: 'confirmed',
      data: {
        walletTitle: this.state().walletTitle,
        walletUncollectibleBalance: this.state().walletUncollectibleBalance,
        walletWithdrawableBalance: this.state().walletWithdrawableBalance,
        minAmount: this.state().minAmount,
        amount: this.amount(),
        walletId: this.walletId(),
        walletName: this.state().walletName,
      },
    };

    const sign$ = this.state().requireAgreement
      ? this.customerService.signAgreements(this.state().walletName).pipe(filter((sign) => !!sign?.success))
      : of(new ServiceResult(null, '', true));

    sign$
      .pipe(
        switchMap(() => this.walletService.walletProcess(WALLET_WITHDROW_PROCESS_API, processData)),
        tap((res) => {
          if (res.success) {
            if (res?.result?.action === 'error') {
              this.messageService.showErrorMessage(res.result?.data?.message);
            } else if (res?.result?.action === 'bottomSheet') {
              this.openBottomSheet(res.result?.data);
            }
          }
        }),
        catchError(() => EMPTY),
        finalize(() => this.btnLoading.set(false)),
      )
      .subscribe();
  }

  onToggleAgreement(val: any) {
    this.agreementChecked.set(val);
  }

  agreementView(pdfType: EpdfType) {
    const state: IProspectusRouteState = {
      pdfType,
      symbol: this.walletId(),
      backToProfile: false,
      ...this.state(),
      amount: this.amount(),
      type: 'cashout',
      agreementChecked: this.agreementChecked(),
    };

    this.navigationService.navigateWithState([PROSPECTUS_ROUTE], {
      state: state,
    });
  }

  amountChange(data: { value: string; valid: boolean }) {
    this.isValid.set(data.valid);
    this.amount.set(data.value);
    this.state().amount = data.value;
  }
}

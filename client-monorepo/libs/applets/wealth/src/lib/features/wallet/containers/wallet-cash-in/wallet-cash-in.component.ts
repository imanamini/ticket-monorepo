import { Component, inject, OnInit, signal } from '@angular/core';
import { EMPTY, of } from 'rxjs';
import { catchError, finalize, switchMap, tap, filter } from 'rxjs/operators';

import { PipesModule } from '@digipay/ng-lib-pipes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { PROSPECTUS_ROUTE, RESULT_ROUTE, WALLETS_ROUTE } from '../../../../data-access/constants/app-routes';
import { FundDataService } from '../../../../components/core/services/fund-data.service';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { WalletTransactionInfoComponent } from '../../components/wallet-transaction-info/wallet-transaction-info.component';
import { ActivatedRoute } from '@angular/router';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { WalletAmountFormComponent } from '../../components/wallet-amount-form/wallet-amount-form.component';
import { WalletPayableInfoComponent } from '../../components/wallet-payable-info/wallet-payable-info.component';
import { WalletService } from '../../services/wallet.service';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { WALLET_DEPOSIT_PROCESS_API } from '../../../../data-access/constants/api';
import { IProcessData, IWalletProcessData } from '../../models/wallet-process.interface';
import { EpdfType } from '../../../../components/core/models/instruments.enum';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { IProspectusRouteState } from '../../../../components/core/models/prospectus-route-state.interface';
import { NgClass } from '@angular/common';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { ErrorService } from '../../../../components/core/services/error.service';
import { CustomerService } from '../../../../components/core/services/v1/customer.service';
import { ServiceResult } from '../../../../data-access/models/base/service-result';

@Component({
  selector: 'wealth-applet-wallet-cash-in',
  standalone: true,
  imports: [
    PipesModule,
    NgxButtonComponent,
    NgxAppBarComponent,
    WalletPayableInfoComponent,
    WalletAmountFormComponent,
    NgxCheckboxComponent,
    NgClass,
    NgxCalloutComponent,
  ],
  templateUrl: './wallet-cash-in.component.html',
  styleUrl: './wallet-cash-in.component.scss',
})
export class WalletCashInComponent implements OnInit {
  fundDataService = inject(FundDataService);
  btnLoading = signal<boolean>(false);
  isValid = signal<boolean>(false);
  state = signal<IProcessData | undefined>(undefined);
  walletId = signal<string | undefined>(undefined);
  amount = signal<string | undefined>(undefined);
  agreementChecked = signal<boolean>(false);
  protected readonly pdfType = EpdfType;

  private bottomSheet = inject(NgxBottomSheetService);
  private activatedRoute = inject(ActivatedRoute);
  private walletService = inject(WalletService);
  private navigationService = inject(WealthNavigationService);
  private routeState = inject(RouteStateService);
  private errorService = inject(ErrorService);
  private customerService = inject(CustomerService);

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    const qparams = this.activatedRoute.snapshot.queryParams;
    const expire = qparams['expired'];
    if (expire) {
      this.errorService.setErrorPageExpired(false);
      this.navigationService.navigate([RESULT_ROUTE], {
        queryParams: {
          expired: true,
        },
      });
      return;
    }
    if (!this.state()?.walletName) {
      this.navigationService.navigate([WALLETS_ROUTE, this.walletId()]);
    }

    if (this.state()?.bottomSheetName === 'page_wallet_cash_in_landing_confirmed') {
      this.openBottomSheet();
    }

    this.agreementChecked.set(this.state().agreementChecked);
    if (this.state().amount) {
      this.amountChange({
        value: this.state().amount,
        valid: +this.state().amount <= this.state().maxAmount && +this.state().amount >= this.state().minAmount,
      });
    }
  }

  private openBottomSheet() {
    this.bottomSheet.openBottomSheet(
      WalletTransactionInfoComponent,
      {
        data: {
          type: 'cashIn',
          walletId: this.walletId(),
          walletName: this.state().walletName,
          walletTitle: this.state().walletTitle,
          amount: this.amount() || this.state().amount,
        },
      },
      {
        noPadding: true,
      },
    );
  }

  onBackHandler() {
    this.navigationService.navigate([WALLETS_ROUTE, this.walletId()], {
      state: {
        ...this.state(),
      },
    });
  }

  cashin() {
    this.btnLoading.set(true);
    const processData: IWalletProcessData = {
      data: {
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
        switchMap(() => this.walletService.walletProcess(WALLET_DEPOSIT_PROCESS_API, processData)),
        tap((res) => {
          if (res?.success && res?.result?.action === 'bottomSheet') {
            const amount = res?.result?.data?.amount ?? this.amount();
            if (amount !== undefined) this.amount.set(amount);
            this.openBottomSheet();
          }
        }),
        catchError(() => EMPTY),
        finalize(() => this.btnLoading.set(false)),
      )
      .subscribe();
  }

  amountChange(data: { value: string; valid: boolean }) {
    this.isValid.set(data.valid);
    this.amount.set(data.value);
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
      type: 'cashin',
      agreementChecked: this.agreementChecked(),
    };

    this.navigationService.navigateWithState([PROSPECTUS_ROUTE], {
      state: state,
    });
  }
}

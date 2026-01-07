import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouteStateService, MessageService } from '@client-monorepo/common/utilities';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { filter, of, switchMap, tap, catchError, EMPTY, finalize } from 'rxjs';
import { EpdfType } from '../../../../components/core/models/instruments.enum';
import { IProspectusRouteState } from '../../../../components/core/models/prospectus-route-state.interface';
import { CustomerService } from '../../../../components/core/services/v1/customer.service';
import { WALLET_WITHDROW_PROCESS_API } from '../../../../data-access/constants/api';
import { WALLETS_ROUTE, PROSPECTUS_ROUTE } from '../../../../data-access/constants/app-routes';
import { ServiceResult } from '../../../../data-access/models/base/service-result';
import { WalletTransactionInfoComponent } from '../../components/wallet-transaction-info/wallet-transaction-info.component';
import { IProcessData, IWalletProcessData } from '../../models/wallet-process.interface';
import { WalletService } from '../../services/wallet.service';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { DetailWithdrowComponent } from '../../components/detail-withdrow/detail-withdrow.component';
import { FormFieldComponent } from '@digipay/ui-form-field-builder';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SeparateThousandsPipe } from '@digipay/ng-lib-pipes';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
// import { WithdrawType } from '../../models/withdraw.type';

@Component({
  selector: 'wealth-applet-withdrow-from-fx-wallet',
  standalone: true,
  imports: [
    CommonModule,
    NgxButtonComponent,
    NgxAppBarComponent,
    NgxCheckboxComponent,
    DetailWithdrowComponent,
    FormFieldComponent,
    ReactiveFormsModule,
    NgxCalloutComponent,
  ],
  templateUrl: './withdrow-from-fx-wallet.component.html',
  styleUrl: './withdrow-from-fx-wallet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrowFromFxWalletComponent implements OnInit {
  btnLoading = signal<boolean>(false);
  isValid = signal<boolean>(false);
  state = signal<IProcessData | undefined>(undefined);
  walletId = signal<string | undefined>(undefined);
  iban = signal<string | undefined>(undefined);
  agreementChecked = signal<boolean>(false);
  amountController = new FormControl('', { validators: [Validators.required] });

  private separateThousands = new SeparateThousandsPipe();
  maxAmountError = computed(() => {
    return `حداکثر مبلغ قابل فروش ${this.separateThousands.transform(this.state().walletWithdrawableBalance)} ریال است`;
  });

  minAmountError = computed(() => {
    return `حداقل مبلغ فروش  ${this.separateThousands.transform(this.state().minAmount)} ریال است`;
  });

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
    this.amountController.setValidators([Validators.min(this.state().minAmount), Validators.max(this.state().walletWithdrawableBalance)]);
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    if (!this.state()?.walletName) {
      this.navigationService.navigate([WALLETS_ROUTE, this.walletId()]);
    } else {
      if (this.state().bottomSheetName === 'page_wallet_cach_out_landing_confirmed') {
        this.openBottomSheet(this.state());
      }
    }

    if (this.state()?.amount) {
      this.amountController.setValue(this.state().amount);
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
  }

  onBackHandler() {
    this.navigationService.navigate([WALLETS_ROUTE, this.walletId()], {
      state: {
        ...this.state(),
      },
    });
  }

  setMaximumAmount() {
    this.amountController.setValue(Math.floor(this.state().walletWithdrawableBalance).toString(), { emitEvent: false });
  }

  withdraw() {
    const currentState = this.state();
    const processData: IWalletProcessData = {
      data: {
        walletTitle: currentState.walletTitle,
        walletUncollectibleBalance: currentState.walletUncollectibleBalance,
        walletWithdrawableBalance: currentState.walletWithdrawableBalance,
        minAmount: currentState.minAmount,
        maxAmount: currentState.maxAmount,
        amount: this.amountController.value,
        walletId: this.walletId(),
        walletName: currentState.walletName,
        commissionPercentage: currentState.commissionPercentage,
        hasCommission: currentState.hasCommission,
      },
    };
    if (this.amountController.value === currentState.walletWithdrawableBalance.toString()) {
      processData.data.withdrawAll = true;
    }
    this.btnLoading.set(true);
    const sign$ = currentState.requireAgreement
      ? this.customerService.signAgreements(currentState.walletName).pipe(filter((sign) => !!sign?.success))
      : of(new ServiceResult(null, '', true));

    sign$
      .pipe(
        switchMap(() => this.walletService.walletProcess(WALLET_WITHDROW_PROCESS_API, processData)),
        tap((res) => {
          if (res.success) {
            if (res?.result?.action === 'error') {
              this.messageService.showErrorMessage(res.result?.data?.message);
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
      amount: this.amountController.value,
      type: 'withdraw_fx',
      agreementChecked: this.agreementChecked(),
    };

    this.navigationService.navigateWithState([PROSPECTUS_ROUTE], {
      state: state,
    });
  }
}

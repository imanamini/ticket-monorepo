import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { filter, of, switchMap, tap, catchError, EMPTY, finalize } from 'rxjs';
import { EpdfType } from '../../../../components/core/models/instruments.enum';
import { IProspectusRouteState } from '../../../../components/core/models/prospectus-route-state.interface';
import { ErrorService } from '../../../../components/core/services/error.service';
import { FundDataService } from '../../../../components/core/services/fund-data.service';
import { CustomerService } from '../../../../components/core/services/v1/customer.service';
import { WALLET_DEPOSIT_PROCESS_API } from '../../../../data-access/constants/api';
import { RESULT_ROUTE, WALLETS_ROUTE, PROSPECTUS_ROUTE } from '../../../../data-access/constants/app-routes';
import { ServiceResult } from '../../../../data-access/models/base/service-result';
import { IProcessData, IWalletProcessData } from '../../models/wallet-process.interface';
import { WalletService } from '../../services/wallet.service';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { DetailDepositComponent } from '../../components/detail-deposit/detail-deposit.component';
import { IDepositReview } from '../../models/deposit-review.interface';
import { DepositReviewSheetComponent } from '../../components/deposit-review-sheet/deposit-review-sheet.component';
import { FormFieldComponent } from '@digipay/ui-form-field-builder';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { SeparateThousandsPipe } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'wealth-applet-deposit-to-fx-wallet',
  standalone: true,
  imports: [
    CommonModule,
    NgxButtonComponent,
    NgxAppBarComponent,
    NgxCalloutComponent,
    NgxCheckboxComponent,
    DetailDepositComponent,
    FormFieldComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './deposit-to-fx-wallet.component.html',
  styleUrl: './deposit-to-fx-wallet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositToFxWalletComponent implements OnInit {
  fundDataService = inject(FundDataService);
  btnLoading = signal<boolean>(false);
  isValid = signal<boolean>(false);
  state = signal<IProcessData | undefined>(undefined);
  walletId = signal<string | undefined>(undefined);
  amount = signal<string | undefined>(undefined);
  agreementChecked = signal<boolean>(false);
  amountController = new FormControl('', { validators: [Validators.required] });

  private separateThousands = new SeparateThousandsPipe();
  maxAmountError = computed(() => {
    return `حداکثر مبلغ قابل پرداخت درگاه بانکی، روزانه ${this.separateThousands.transform(this.state().maxAmount)} ریال است`;
  });

  minAmountError = computed(() => {
    return `حداقل مبلغ خرید، ${this.separateThousands.transform(this.state().minAmount)} ریال است`;
  });

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
      this.amountController.setValue(this.state().amount);
    }
    this.amountController.setValidators([Validators.min(this.state().minAmount), Validators.max(this.state().maxAmount)]);
  }

  private openBottomSheet() {
    const payload: IDepositReview = {
      walletName: this.state().walletName,
      walletTitle: this.state().walletTitle,
      amount: this.state().amount,
      payableAmount: this.state().payableAmount,
      walletId: this.walletId(),
    };

    this.bottomSheet.openBottomSheet(DepositReviewSheetComponent, payload);
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
        amount: this.amountController.value,
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
            this.state().amount = res?.result?.data?.amount;
            this.state().payableAmount = res?.result?.data?.payableAmount;
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
      type: 'deposit_fx',
      agreementChecked: this.agreementChecked(),
    };

    this.navigationService.navigateWithState([PROSPECTUS_ROUTE], {
      state: state,
    });
  }
}

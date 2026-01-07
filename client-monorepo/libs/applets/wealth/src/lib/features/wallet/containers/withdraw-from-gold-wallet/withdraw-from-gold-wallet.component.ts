import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { FormFieldComponent } from '@digipay/ui-form-field-builder';
import { DetailWithdrowComponent } from '../../components/detail-withdrow/detail-withdrow.component';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouteStateService, MessageService } from '@client-monorepo/common/utilities';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { PipesModule, SeparateThousandsPipe } from '@digipay/ng-lib-pipes';
import { filter, of, switchMap, tap, catchError, EMPTY, take, map, Observable } from 'rxjs';
import { EpdfType } from '../../../../components/core/models/instruments.enum';
import { IProspectusRouteState } from '../../../../components/core/models/prospectus-route-state.interface';
import { CustomerService } from '../../../../components/core/services/v1/customer.service';
import { WALLET_WITHDROW_PROCESS_API } from '../../../../data-access/constants/api';
import { WALLETS_ROUTE, PROSPECTUS_ROUTE } from '../../../../data-access/constants/app-routes';
import { ServiceResult } from '../../../../data-access/models/base/service-result';
import { IProcessData, IWalletProcessData } from '../../models/wallet-process.interface';
import { WalletService } from '../../services/wallet.service';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxIcon } from '@digipay/ngx-icon';
import { IGoldPricePublisher } from '../../models/gold-price-publisher.interface';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { WithdrawGoldNoticeBottomSheetComponent } from '../../components/withdraw-gold-notice-bottomSheet/withdraw-gold-notice-bottomSheet.component';

@Component({
  selector: 'wealth-applet-withdraw-from-gold-wallet',
  standalone: true,
  imports: [
    CommonModule,
    NgxButtonComponent,
    NgxCheckboxComponent,
    FormFieldComponent,
    DetailWithdrowComponent,
    NgxAppBarComponent,
    ReactiveFormsModule,
    PipesModule,
    NgxTooltipDirective,
    SpinnerComponent,
    NgxBadgeModule,
    NgxDividerComponent,
    NgxIcon,
  ],
  templateUrl: './withdraw-from-gold-wallet.component.html',
  styleUrl: './withdraw-from-gold-wallet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrawFromGoldWalletComponent implements OnInit {
  private walletService = inject(WalletService);
  private routeState = inject(RouteStateService);
  private activatedRoute = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private navigationService = inject(WealthNavigationService);
  private customerService = inject(CustomerService);
  private destroyRef = inject(DestroyRef);
  private bottomsheetService = inject(NgxBottomSheetService);
  protected readonly pdfType = EpdfType;
  protected readonly BorderColorsEnum = BorderColorsEnum;
  private separateThousands = new SeparateThousandsPipe();

  btnLoading = signal<boolean>(false);
  isValid = signal<boolean>(false);
  state = signal<IProcessData | undefined>(undefined);
  walletId = signal<string | undefined>(undefined);
  iban = signal<string | undefined>(undefined);
  agreementChecked = signal<boolean>(false);
  amountController = new FormControl('', { validators: [Validators.required] });
  loading = signal<boolean>(true);
  calculatedCommission = signal<number>(0);
  calculatedAmount = signal<number>(0);
  calculatedGram = signal<string>('0');
  withdrawAmount = signal<string | undefined>(undefined);
  withdrawAllAmount = signal<boolean>(false);

  maxAmountError = computed(() => {
    return `حداکثر مبلغ قابل فروش ${this.separateThousands.transform(this.state().maxAmount)} ریال است`;
  });

  minAmountError = computed(() => {
    return `حداقل مبلغ فروش${this.separateThousands.transform(this.state().minAmount)} ریال است`;
  });

  goldPricePublisher = toSignal<IGoldPricePublisher | null>(this.walletService.goldPricingPublisher$, {
    initialValue: null,
  });

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());

    this.amountController.setValidators([
      Validators.min(this.state().minAmount),
      Validators.max(this.goldPricePublisher()?.withdrawalBalance),
    ]);

    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    if (!this.state()?.walletName) {
      this.navigationService.navigate([WALLETS_ROUTE, this.walletId()]);
    }

    if (this.state()?.amount) {
      const normilizedAmount = this.state().amount.replace(/,/g, '');
      this.amountController.setValue(normilizedAmount);
      this.calcCommission(Number(normilizedAmount));
    }

    this.amountController.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res) => {
      const currentState = this.state();
      if (!currentState) {
        return;
      }

      let amount = Number(res ?? 0);
      if (!Number.isFinite(amount)) {
        amount = 0;
      }

      if (amount > currentState.maxAmount) {
        const actualAmount = amount;
        const clampedAmount = currentState.maxAmount;
        const clampedAmountValue = clampedAmount.toString();
        if (this.amountController.value !== clampedAmountValue) {
          this.amountController.setValue(Math.floor(clampedAmount).toString(), { emitEvent: false });
        }
        const existingErrors = this.amountController.errors ?? {};
        this.amountController.setErrors({
          ...existingErrors,
          max: {
            max: clampedAmount,
            actual: actualAmount,
          },
        });
        this.amountController.markAsTouched({ onlySelf: true });
        amount = clampedAmount;
      } else if (this.amountController.errors?.max) {
        const { max, ...otherErrors } = this.amountController.errors;
        const hasOtherErrors = Object.keys(otherErrors).length > 0;
        this.amountController.setErrors(hasOtherErrors ? otherErrors : null);
      }

      if (amount != currentState.maxAmount) {
        this.withdrawAllAmount.set(false);
      }

      this.calcCommission(amount);
    });

    this.getGoldPrice();
  }

  private getGoldPrice() {
    this.walletService.getWalletIndexValueStream('WALLET_GOLD').subscribe({
      next: () => {
        this.loading.set(false);
      },
    });
  }

  onBackHandler() {
    this.navigationService.navigate([WALLETS_ROUTE, this.walletId()], {
      state: {
        ...this.state(),
      },
    });
  }

  setMaximumAmount() {
    this.amountController.setValue(Math.floor(this.state().maxAmount).toString());
    this.calcCommission(this.state().maxAmount);
    this.withdrawAllAmount.set(true);
  }

  withdraw() {
    const currentState = this.state();
    const processData: IWalletProcessData = {
      data: {
        walletTitle: currentState.walletTitle,
        walletUncollectibleBalance: currentState.walletUncollectibleBalance,
        walletWithdrawableBalance: this.goldPricePublisher().withdrawalBalance,
        minAmount: currentState.minAmount,
        maxAmount: currentState.maxAmount,
        amount: this.amountController.value,
        walletId: this.walletId(),
        walletName: currentState.walletName,
        commissionPercentage: currentState.commissionPercentage,
        hasCommission: currentState.hasCommission,
      },
    };
    const clampedAmount = currentState.maxAmount;
    const clampedAmountValue = Math.floor(clampedAmount).toString();
    if (this.amountController.value === clampedAmountValue) {
      processData.data.withdrawAll = true;
      processData.data.amount = clampedAmountValue;
    }
    this.btnLoading.set(true);

    if (this.withdrawAllAmount()) {
      this.bottomsheetService.openBottomSheet(
        WithdrawGoldNoticeBottomSheetComponent,
        {},
        {
          noPadding: true,
        },
      );
      this.bottomsheetService.onClose
        .pipe(
          take(1),
          map(() => this.bottomsheetService.outputData()),
          tap({ finalize: () => this.btnLoading.set(false) }),
          filter((result) => result === 'continue'),
          switchMap(() => this._withdraw(processData)),
        )
        .subscribe();
    } else {
      this._withdraw(processData).subscribe();
    }
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
      type: 'withdraw_gold',
      agreementChecked: this.agreementChecked(),
    };

    this.navigationService.navigateWithState([PROSPECTUS_ROUTE], {
      state: state,
    });
  }

  calcCommission(amount: number) {
    const currentState = this.state();
    const goldPrice = this.goldPricePublisher();
    if (!currentState || !goldPrice || !Number.isFinite(amount)) {
      this.calculatedCommission.set(0);
      this.calculatedAmount.set(0);
      this.calculatedGram.set('0');
      return;
    }

    const gross = Math.trunc((100 * amount) / (100 - currentState.commissionPercentage));
    this.calculatedCommission.set(gross - amount);
    const finalAmount = currentState.hasCommission ? amount + this.calculatedCommission() : amount;
    this.calculatedAmount.set(finalAmount);
    const gramText = goldPrice.value ? this.formatGramValue(this.trunc3(this.calculatedAmount() / goldPrice.value)) : '0';
    this.calculatedGram.set(gramText);
  }

  private _withdraw(processData: IWalletProcessData): Observable<ServiceResult> {
    const currentState = this.state();

    const stream$ = currentState.requireAgreement
      ? this.customerService.signAgreements(currentState.walletName).pipe(filter((sign) => !!sign?.success))
      : of(new ServiceResult(null, '', true));

    return stream$.pipe(
      switchMap(() => this.walletService.walletProcess(WALLET_WITHDROW_PROCESS_API, processData)),
      tap((res) => {
        if (res?.success && res.result?.action === 'error') {
          this.messageService.showErrorMessage(res.result.data?.message);
        }
      }),
      catchError((err) => {
        return EMPTY;
      }),
    );
  }

  private formatGramValue(value: number): string {
    return Number.isFinite(value) ? value.toFixed(3) : '0';
  }

  private trunc3(n: number) {
    return (n < 0 ? Math.ceil(n * 1000) : Math.floor(n * 1000)) / 1000;
  }
}

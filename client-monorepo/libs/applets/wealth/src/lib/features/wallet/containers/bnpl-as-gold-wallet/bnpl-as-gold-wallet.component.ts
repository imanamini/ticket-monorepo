import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService, RouteStateService } from '@client-monorepo/common/utilities';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { PipesModule, SeparateThousandsPipe } from '@digipay/ng-lib-pipes';
import { catchError, EMPTY, filter, finalize, of, switchMap, take, tap } from 'rxjs';
import { EpdfType } from '../../../../components/core/models/instruments.enum';
import { CustomerService } from '../../../../components/core/services/v1/customer.service';
import { WALLET_COORDINATOR_PROCESS_API } from '../../../../data-access/constants/api';
import { HOME_ROUTE, PROSPECTUS_ROUTE, WALLETS_ROUTE } from '../../../../data-access/constants/app-routes';
import { ServiceResult } from '../../../../data-access/models/base/service-result';
import { IProcessData, IWalletProcessData } from '../../models/wallet-process.interface';
import { WalletService } from '../../services/wallet.service';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { FormFieldComponent } from '@digipay/ui-form-field-builder';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { DetailBnplComponent } from '../../components/detail-bnpl/detail-bnpl.component';
import { IAutoFill } from '../../../purchase/models';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxIcon } from '@digipay/ngx-icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { IProspectusRouteState } from '../../../../components/core/models/prospectus-route-state.interface';

type AutoFillOption = IAutoFill & {
  id: number;
  value: number;
  label?: string;
};

const AUTO_FILL_AMOUNTS: ReadonlyArray<number> = [200000000, 500000000, 1000000000, 2000000000];

@Component({
  selector: 'wealth-applet-bnpl-as-gold-wallet',
  standalone: true,
  imports: [
    CommonModule,
    NgxButtonComponent,
    FormFieldComponent,
    NgxAppBarComponent,
    ReactiveFormsModule,
    DetailBnplComponent,
    PipesModule,
    NgxDividerComponent,
    NgxIcon,
    NgxBadgeModule,
    SpinnerComponent,
    NgxCheckboxComponent,
  ],
  templateUrl: './bnpl-as-gold-wallet.component.html',
  styleUrl: './bnpl-as-gold-wallet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BnplAsGoldWalletComponent implements OnInit {
  loading = signal<boolean>(false);
  btnLoading = signal<boolean>(false);
  state = signal<IProcessData | undefined>(undefined);
  walletId = signal<string | undefined>(undefined);
  amountController = new FormControl('', { validators: [Validators.required] });
  selectedAutoCompleteButton = signal<number>(0);
  finalAmount = signal<number>(0);
  payableAmount = signal<number>(0);
  calculatedCommerssion = signal<number>(0);
  agreementChecked = signal<boolean>(false);

  private timeoutId: any;
  private isProgrammaticChange = false;
  private readonly messageService = inject(MessageService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly walletService = inject(WalletService);
  private readonly navigationService = inject(WealthNavigationService);
  private readonly routeState = inject(RouteStateService);
  private readonly customerService = inject(CustomerService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly separateThousands = new SeparateThousandsPipe();

  autoCompleteButtons = signal<AutoFillOption[]>([]);
  protected readonly pdfType = EpdfType;
  readonly BorderColorEnum = BorderColorsEnum;

  maxAmountError = computed(() => {
    return `حداکثر مبلغ قابل اعتبار ${this.separateThousands.transform(this.state()?.maxBnplAmount)} ریال است`;
  });

  minAmountError = computed(() => {
    return `حداقل مبلغ اعتبار  ${this.separateThousands.transform(this.state()?.minBnplAmount)} ریال است`;
  });

  ngOnInit(): void {
    const walletId = this.activatedRoute.snapshot.paramMap.get('id') ?? undefined;
    this.walletId.set(walletId);

    const processState = this.routeState.getAll();
    if (!processState?.walletName) {
      this.navigateBack();
      return;
    }
    this.state.set(processState);
    this.observeAmountChanges();
    this.setupFormValidators(processState);
    this.agreementChecked.set(processState.agreementChecked);
    this.amountController.setValue(processState.amount || '');
    this.autoCompleteButtons.set(this.buildAutoFillOptions());
    this.walletService.goldPricingPublisher$.pipe(take(1)).subscribe((value) => {
      if (!value) {
        this.walletService.getWalletIndexValueStream('WALLET_GOLD').pipe(take(1)).subscribe();
      }
    });
  }

  onBackHandler() {
    this.navigateBack();
  }

  handleAutoFill(option: AutoFillOption) {
    const selectedId = this.selectedAutoCompleteButton();
    if (selectedId === option.id) {
      this.resetSelection();
      this.amountController.setValue('');
      return;
    }

    const amount = this.resolveAutoFillValue(option);
    this.selectedAutoCompleteButton.set(option.id);
    this.updateAutoFillSelection(option.id);
    this.amountController.setValue(amount.toString());
  }

  continue() {
    if (!this.canContinue()) {
      return;
    }

    const processState = this.state();
    if (!processState) {
      return;
    }

    this.btnLoading.set(true);
    const processData: IWalletProcessData = {
      data: {
        walletName: processState.walletName,
        walletId: this.walletId(),
        amount: this.finalAmount().toString(),
      },
    };

    const sign$ = processState.requireAgreement
      ? this.customerService.signAgreements(processState.walletName).pipe(filter((sign) => !!sign?.success))
      : of(new ServiceResult(null, '', true));

    sign$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.walletService.walletProcess(WALLET_COORDINATOR_PROCESS_API, processData)),
        tap((res) => {
          if (!res?.success || !res?.result) {
            return;
          }

          if (res.success && (res.result.action === 'error' || res.result.action === 'snackbar')) {
            this.messageService.showErrorMessage(res.result.data.message || res.result.data.title, res.result.data.description || '');
          }
        }),
        catchError(() => EMPTY),
        finalize(() => this.btnLoading.set(false)),
      )
      .subscribe();
  }

  private observeAmountChanges(): void {
    this.amountController.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      const amount = this.toNumber(value);
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      if (!Number.isFinite(amount) || amount <= 0) {
        this.resetSelection();
        this.resetCalculatedAmounts();
        return;
      }

      const normalizedAmount = this.applyRounding(amount);
      if (normalizedAmount !== amount) {
        this.timeoutId = setTimeout(() => {
          if (this.amountController.value !== normalizedAmount.toString()) {
            this.isProgrammaticChange = true;
            this.amountController.setValue(normalizedAmount > 0 ? normalizedAmount.toString() : '', { emitEvent: false });
          }
        }, 1500);
      }

      this.calcCommission(normalizedAmount);
      this.updateCalculatedAmounts(normalizedAmount);
      this.syncSelectionWithAmount(normalizedAmount);
    });
  }

  private setupFormValidators(processState: IProcessData): void {
    const validators = [Validators.required];

    if (typeof processState.minBnplAmount === 'number') {
      validators.push(Validators.min(processState.minBnplAmount));
    }

    if (typeof processState.maxBnplAmount === 'number') {
      validators.push(Validators.max(processState.maxBnplAmount));
    }

    this.amountController.setValidators(validators);
    this.amountController.updateValueAndValidity({ emitEvent: false });
  }

  private buildAutoFillOptions(): AutoFillOption[] {
    return AUTO_FILL_AMOUNTS.map((amount, index) => {
      const id = index + 1;
      const value = amount;
      const label = amount.toString();

      return {
        id,
        value,
        amount: amount.toString() || value.toString(),
        selected: false,
        ...(label ? { label } : {}),
      };
    });
  }

  private resolveAutoFillValue(option: AutoFillOption): number {
    return option.value;
  }

  private applyRounding(amount: number): number {
    this.finalAmount.set(amount);
    const roundDown = this.state().roundDown;
    const walletBalance = this.state().walletWithdrawableBalance;
    const mod = amount % roundDown;
    const rounded = amount - mod;
    const final = rounded - walletBalance;
    this.payableAmount.set(Math.max(0, final));
    return rounded;
  }

  private updateCalculatedAmounts(amount: number): void {
    const processState = this.state();
    if (!processState) {
      this.resetCalculatedAmounts();
      return;
    }

    const walletBalance = processState.walletWithdrawableBalance ?? 0;
    this.finalAmount.set(amount);

    const alocation = (amount * 100) / this.state().bnplAllocationPercent;
    this.payableAmount.set(
      Math.max(0, Math.floor(alocation - walletBalance + (processState?.hasCommission ? this.calculatedCommerssion() : 0))),
    );
  }

  private resetCalculatedAmounts(): void {
    this.finalAmount.set(0);
    this.payableAmount.set(0);
  }

  private syncSelectionWithAmount(amount: number): void {
    const match = this.autoCompleteButtons().find((option) => option.value === amount);
    if (match) {
      this.selectedAutoCompleteButton.set(match.id);
      this.updateAutoFillSelection(match.id);
      return;
    }

    this.resetSelection();
  }

  private updateAutoFillSelection(selectedId: number): void {
    this.autoCompleteButtons.update((options) =>
      options.map((option) => ({
        ...option,
        selected: selectedId !== 0 && option.id === selectedId,
      })),
    );
  }

  private resetSelection(): void {
    this.selectedAutoCompleteButton.set(0);
    this.updateAutoFillSelection(0);
  }

  private toNumber(value: unknown): number {
    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      const normalized = value.replace(/,/g, '').trim();
      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? parsed : NaN;
    }

    return NaN;
  }

  private canContinue(): boolean {
    const processState = this.state();
    if (!processState || !this.amountController.valid) {
      return false;
    }

    const amount = this.finalAmount();
    if (!Number.isFinite(amount) || amount <= 0) {
      return false;
    }

    const min = processState.minBnplAmount ?? 0;
    const max = processState.maxBnplAmount ?? Number.MAX_SAFE_INTEGER;
    return amount >= min && amount <= max;
  }

  private navigateBack(): void {
    const id = this.walletId();
    const target = id ? [WALLETS_ROUTE, id] : [HOME_ROUTE];
    const currentState = this.state();
    const navigationExtras = currentState ? { state: { ...currentState } } : undefined;

    this.navigationService.navigate(target, navigationExtras);
  }

  calcCommission(amount: number) {
    const currentState = this.state();
    if (!currentState || !Number.isFinite(amount)) {
      this.calculatedCommerssion.set(0);
      return;
    }
    const r = (amount * currentState.commissionPercentage) / 100;
    this.calculatedCommerssion.set(r);
  }

  agreementView(pdfType: EpdfType) {
    const state: IProspectusRouteState = {
      pdfType,
      symbol: this.walletId(),
      backToProfile: false,
      ...this.state(),
      type: 'bnpl_gold',
      agreementChecked: this.agreementChecked(),
    };

    this.navigationService.navigateWithState([PROSPECTUS_ROUTE], {
      state: state,
    });
  }
}

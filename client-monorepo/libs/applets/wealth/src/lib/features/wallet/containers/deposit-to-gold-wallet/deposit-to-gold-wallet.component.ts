import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { filter, of, switchMap, tap, catchError, EMPTY, finalize, map, merge, takeUntil } from 'rxjs';
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
import { DetailDepositComponent } from '../../components/detail-deposit/detail-deposit.component';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { PipesModule, SeparateThousandsPipe } from '@digipay/ng-lib-pipes';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxIcon } from '@digipay/ngx-icon';
import { DepositReviewSheetComponent } from '../../components/deposit-review-sheet/deposit-review-sheet.component';
import { IDepositReview } from '../../models/deposit-review.interface';
import { FormFieldComponent } from '@digipay/ui-form-field-builder';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { BaseComponent } from '../../../../components/core/components/base/base.component';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { IGoldPricePublisher } from '../../models/gold-price-publisher.interface';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'wealth-applet-deposit-to-gold-wallet',
  standalone: true,
  imports: [
    CommonModule,
    NgxButtonComponent,
    NgxCheckboxComponent,
    DetailDepositComponent,
    NgxAppBarComponent,
    PipesModule,
    NgxDividerComponent,
    NgxIcon,
    FormFieldComponent,
    FormsModule,
    ReactiveFormsModule,
    NgxBadgeModule,
    NgxTooltipDirective,
  ],
  templateUrl: './deposit-to-gold-wallet.component.html',
  styleUrl: './deposit-to-gold-wallet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepositToGoldWalletComponent extends BaseComponent implements OnInit {
  fundDataService = inject(FundDataService);
  btnLoading = signal<boolean>(false);
  isAmountValid = signal<boolean>(false);
  isGramValid = signal<boolean>(false);
  state = signal<IProcessData | undefined>(undefined);
  walletId = signal<string | undefined>(undefined);
  amount = signal<string | undefined>(undefined);
  gram = signal<string | undefined>(undefined);
  agreementChecked = signal<boolean>(false);
  hints = signal<string[]>([
    'محاسبه دقیق میزان گرم طلا، بعد از نهایی شدن پرداخت انجام خواهد شد.',
    'خرید فقط از طریق کارت بانکی خودتان امکان پذیر است.',
  ]);

  calculatedCommerssion = signal<number>(0);

  amountController = new FormControl('', { validators: [Validators.required] });
  gramController = new FormControl('');

  private separateThousands = new SeparateThousandsPipe();

  maxAmountError = computed(() => {
    return `حداکثر مبلغ قابل پرداخت درگاه بانکی، روزانه ${this.separateThousands.transform(this.state().maxAmount)} ریال است`;
  });

  minAmountError = computed(() => {
    return `حداقل مبلغ خرید، ${this.separateThousands.transform(this.state().minAmount)} ریال است`;
  });

  tooltipMessage = computed(() => {
    if (this.state().hasFxCommission) {
      return 'مبلغی که وارد می‌کنید معادل واریزی شما است و از آن کارمزد کسر خواهد شد، اما مقدار گرم نمایش داده شده (حداکثر با دقت ۳ رقم اعشار نمایش داده می‌شود) بعد از کسر کارمزد است.';
    } else {
      return 'مقدار طلا حداکثر با دقت سه رقم اعشار نمایش داده می‌شود.';
    }
  });

  protected readonly pdfType = EpdfType;
  private _syncing = false;
  private errorService = inject(ErrorService);
  walletService = inject(WalletService);
  private routeState = inject(RouteStateService);
  private activatedRoute = inject(ActivatedRoute);
  private customerService = inject(CustomerService);
  private bottomSheet = inject(NgxBottomSheetService);
  private navigationService = inject(WealthNavigationService);
  goldPricePublisher = toSignal<IGoldPricePublisher | null>(this.walletService.goldPricingPublisher$, {
    initialValue: null,
  });

  protected readonly BorderColorsEnum = BorderColorsEnum;

  constructor() {
    super();
  }

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

    if (this.state().weightInGrams) {
      this.gramController.setValue(this.state().weightInGrams);
    }

    this.amountController.setValidators([Validators.min(this.state().minAmount), Validators.max(this.state().maxAmount)]);

    this.getGoldPrice();
    this.controllersHandler();
  }

  private getGoldPrice() {
    this.walletService.getWalletIndexValueStream('WALLET_GOLD').pipe(takeUntil(this.destroyObservable)).subscribe();
  }

  private controllersHandler() {
    const amount$ = this.amountController.valueChanges.pipe(map((v) => ({ src: 'amount' as const, val: this.toNumber(v) })));

    const gram$ = this.gramController.valueChanges.pipe(map((v) => ({ src: 'gram' as const, val: this.toNumber(v) })));

    merge(amount$, gram$).subscribe(({ src, val }) => {
      if (this._syncing) return;
      this._syncing = true;

      if (src === 'amount') {
        const amount = Math.max(val, 0);
        const gram = this.trunc3(Math.max(amount / this.goldPricePublisher()?.value, 0));
        const gramText = this.formatGramValue(gram);
        if (this.gramController.value !== gramText) {
          this.gramController.setValue(gramText, { emitEvent: false });
        }
        if (this.amountController.value !== amount.toString()) {
          this.amountController.setValue(amount.toString(), { emitEvent: false });
        }
        this.calcCommission(amount);
      } else {
        const gram = Math.max(val, 0);
        const amountRaw = gram * this.goldPricePublisher()?.value;
        const amount = Math.floor(amountRaw);
        if (this.amountController.value !== amount.toString()) {
          this.amountController.setValue(amount.toString(), { emitEvent: false });
        }
        const gramText = this.formatGramValue(this.trunc3(gram));
        if (this.gramController.value !== gramText) {
          this.gramController.setValue(gramText, { emitEvent: false });
        }
        this.calcCommission(amount);
      }

      this._syncing = false;
    });
  }

  private openBottomSheet() {
    const payload: IDepositReview = {
      walletName: this.state().walletName,
      walletTitle: this.state().walletTitle,
      amount: this.state().amount,
      payableAmount: this.state().payableAmount,
      commission: this.state().commission,
      hasCommission: this.state().hasCommission,
      walletId: this.walletId(),
      notes: ['محاسبه دقیق میزان گرم طلا، بعد از بازگشت از درگاه انجام خواهد شد.', 'خرید فقط از طریق کارت بانکی خودتان امکان پذیر است.'],
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
        weightInGrams: this.gramController.value,
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
            this.state().payableAmount = res?.result?.data?.payableAmount;
            this.state().amount = res?.result?.data?.amount;
            this.state().commission = res?.result?.data?.commission;
            this.openBottomSheet();
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
      type: 'deposit_gold',
      agreementChecked: this.agreementChecked(),
    };

    this.navigationService.navigateWithState([PROSPECTUS_ROUTE], {
      state: state,
    });
  }

  calcCommission(amount: number) {
    const r = (amount * this.state().commissionPercentage) / 100;
    this.calculatedCommerssion.set(r);
  }

  private formatGramValue(value: number): string {
    return Number.isFinite(value) ? value.toFixed(3) : '0';
  }

  private trunc3(n: number) {
    return (n < 0 ? Math.ceil(n * 1000) : Math.floor(n * 1000)) / 1000;
  }

  private toNumber(v: any) {
    if (typeof v === 'string') {
      const s = v.replace(/[^\d.]/g, '').replace(',', '.');
      return +s || 0;
    }
    return +v || 0;
  }
}

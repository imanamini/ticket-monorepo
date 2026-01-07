import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { PROSPECTUS_ROUTE, WALLETS_ROUTE } from '../../../../data-access/constants/app-routes';
import { ActivatedRoute } from '@angular/router';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { PipesModule, SeparateThousandsPipe } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxRadioButtonComponent } from '@digipay/ngx-radio-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { WalletBnplExteraCreditDetailComponent } from '../../components/wallet-bnpl-extera-credit-detail/wallet-bnpl-extera-credit-detail.component';
import { IBnplPlan, IWalletProcessData, IWalletProcessState } from '../../models/wallet-process.interface';
import { MessageService, RouteStateService } from '@client-monorepo/common/utilities';
import { WalletService } from '../../services/wallet.service';
import { WALLET_COORDINATOR_PROCESS_API } from '../../../../data-access/constants/api';
import { IAutoFill } from '../../../purchase/models/purchase-auto-fill.model';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, filter, finalize, of, switchMap, tap } from 'rxjs';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { EpdfType } from '../../../../components/core/models/instruments.enum';
import { IProspectusRouteState } from '../../../../components/core/models/prospectus-route-state.interface';
import { CustomerService } from '../../../../components/core/services/v1/customer.service';
import { ServiceResult } from '../../../../data-access/models/base/service-result';

@Component({
  selector: 'wealth-applet-wallet-bnpl-request',
  standalone: true,
  imports: [
    CommonModule,
    NgxAppBarComponent,
    PipesModule,
    NgxButtonComponent,
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    NgxDividerComponent,
    NgxRadioButtonComponent,
    NgxCheckboxComponent,
  ],
  templateUrl: './wallet-bnpl-request.component.html',
  styleUrl: './wallet-bnpl-request.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBnplRequestComponent implements OnInit {
  amount = new FormControl();
  unit = signal<number>(500000);
  selectedOptionId = signal<number>(1);
  finalAmount = signal<number>(0);

  customAmount = signal<boolean>(false);
  walletId = signal<string | undefined>(undefined);
  errorMessage = signal<string | undefined>(undefined);
  state = signal<IWalletProcessState | undefined>(undefined);
  payableAmount = signal<number>(0);
  unsecureAmount = signal<number>(0);
  autoCompleteButtons = signal<IAutoFill[]>([
    {
      id: 1,
      amount: '200000000',
      selected: false,
    },
    {
      id: 2,
      amount: '500000000',
      selected: false,
    },
    {
      id: 3,
      amount: '1000000000',
      selected: false,
    },
    {
      id: 4,
      amount: '2000000000',
      selected: false,
    },
  ]);
  agreementChecked = signal<boolean>(false);
  protected readonly pdfType = EpdfType;

  private selectedAmount = signal<IAutoFill | undefined>(undefined);

  private thousends = new SeparateThousandsPipe();

  selectedAutoCompleteButton = signal<number>(0);

  walletInfo = computed(() => {
    const state = this.state();
    if (!state) return [];
    return [
      {
        key: 'موجودی کیف ثروت:',
        value: state.walletWithdrawableBalance,
      },
      {
        key: 'نیاز به افزایش موجودی:',
        value: this.payableAmount() || 0,
      },
    ];
  });

  minAmountMessage = computed(() => {
    return `حداقل مبلغ ${this.thousends.transform(this.state().minBnplAmount)} ریال است.`;
  });
  maxAmountMessage = computed(() => {
    return `حداکثر مبلغ ${this.thousends.transform(this.state().maxBnplAmount)} ریال است.`;
  });

  btnLoading = signal<boolean>(false);

  form: FormGroup;
  private formBuilder = inject(FormBuilder);
  private walletService = inject(WalletService);
  private activatedRoute = inject(ActivatedRoute);
  private routeState = inject(RouteStateService);
  protected readonly BorderColorsEnum = BorderColorsEnum;
  private navigationService = inject(WealthNavigationService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private messageService = inject(MessageService);
  private customerService = inject(CustomerService);

  ngOnInit(): void {
    this.initialState();
  }

  toggleCustomAmount() {
    this.customAmount.set(!this.customAmount());
  }

  onBackHandler() {
    this.navigationService.navigate([WALLETS_ROUTE, this.walletId()]);
  }

  handleSelectedAmount(amount: IBnplPlan) {
    this.form.controls['amount'].setValue(0);
    this.customAmount.set(false);
    this.selectedOptionId.set(amount.id);
    this.finalAmount.set(amount.rechargeAmount);
  }

  decreaseAmount() {
    if (this.form.controls['amount'].value === 0) return;

    const previousValue = Math.floor(this.form.controls['amount'].value / this.unit()) * this.unit();
    this.form.controls['amount'].setValue(previousValue - this.unit());

    if (this.form.controls['amount'].value < 0) {
      this.form.controls['amount'].setValue(0);
    }
  }

  increaseAmount() {
    const nextValue = Math.ceil(this.form.controls['amount'].value / this.unit()) * this.unit();
    this.form.controls['amount'].setValue(nextValue + this.unit());
  }

  continue() {
    if (this.continuCondition()) {
      this.btnLoading.set(true);
      const processData: IWalletProcessData = {
        data: {
          walletName: this.state().walletName,
          walletId: this.walletId(),
          amount: this.finalAmount().toString(),
        },
      };

      const sign$ = this.state().requireAgreement
        ? this.customerService.signAgreements(this.state().walletName).pipe(filter((sign) => !!sign?.success))
        : of(new ServiceResult(null, '', true));

      sign$
        .pipe(
          switchMap(() => this.walletService.walletProcess(WALLET_COORDINATOR_PROCESS_API, processData)),
          tap((res) => {
            if (res.result.action === 'error') {
              this.messageService.showErrorMessage(res.result.data.message);
            }
          }),
          catchError(() => EMPTY),
          finalize(() => this.btnLoading.set(false)),
        )
        .subscribe();
    }
  }

  private continuCondition(): boolean {
    return +this.finalAmount() >= this.state().minBnplAmount && +this.finalAmount() <= this.state().maxBnplAmount;
  }

  openBottomsheet() {
    this.bottomSheetService.openBottomSheet(WalletBnplExteraCreditDetailComponent, {});
  }

  private initialState() {
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    this.state.set(this.routeState.getAll());
    if (!this.state()?.walletName) {
      this.onBackHandler();
    }

    if (this.state().walletWithdrawableBalance >= this.state().minBnplAmount) {
      this.autoCompleteButtons().find((x) => x.id === 1).amount = 'به اندازه موجودی';
    }

    this.form = this.formBuilder.group({
      amount: new FormControl('', [
        Validators.required,
        Validators.min(this.state().minBnplAmount),
        Validators.max(this.state().maxBnplAmount),
      ]),
    });

    if (this.state().unsecureAmount > 0) {
      this.unsecureAmountForm();
    } else {
      this.amountForm();
    }
  }

  private findClosestPlan(amount: number): IBnplPlan | null {
    const eligiblePlans = this.state().plans.filter((plan) => plan.credit <= amount);
    if (eligiblePlans.length === 0) {
      return this.state().plans[0];
    }
    let closestPlan = eligiblePlans[0];
    let closestDiff = amount - closestPlan.credit;
    for (let i = 1; i < eligiblePlans.length; i++) {
      const diff = amount - eligiblePlans[i].credit;
      if (diff < closestDiff) {
        closestDiff = diff;
        closestPlan = eligiblePlans[i];
      }
    }
    return closestPlan;
  }

  private unsecureAmountForm() {
    this.selectedOptionId.set(1);
    this.unsecureAmount.set(this.state().plans[0].unsecureAmount);
    this.finalAmount.set(this.state().plans[0].rechargeAmount);
    this.form.controls['amount'].valueChanges.subscribe((res) => {
      if (res) {
        this.unsecureAmount.set(this.findClosestPlan(res).unsecureAmount);
        this.finalAmount.set(res);
        this.selectedOptionId.set(0);
        this.payableAmount.set(Math.max(0, res - this.state().walletWithdrawableBalance - this.unsecureAmount()));
      }
    });
  }

  private isProgrammaticChange = false;
  private timeoutId: any;
  private amountForm() {
    this.form.controls['amount'].valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter((res) => res !== null && res !== undefined),
        tap((res) => {
          if (this.isProgrammaticChange) {
            this.isProgrammaticChange = false; // reset flag
            return; // skip this value change
          }
          this.selectedAutoCompleteButton.set(0);
          const roundedAmount = this.checkValueConditions(res);
          if (this.timeoutId) {
            clearTimeout(this.timeoutId);
          }
          if (+res > this.state().minBnplAmount && +res < this.state().maxBnplAmount) {
            this.timeoutId = setTimeout(() => {
              if (this.form.controls['amount'].value !== roundedAmount) {
                this.isProgrammaticChange = true;
                this.form.controls['amount'].setValue(roundedAmount > 0 ? roundedAmount : '', { emitEvent: false });
              }
            }, 1000);
          }
        }),
      )
      .subscribe();
  }

  handleAutoFill(button: IAutoFill) {
    if (button !== this.selectedAmount()) {
      this.selectedAmount.set(button);
      this.autoCompleteButtons().forEach((btn) => {
        btn.amount === this.selectedAmount().amount ? (btn.selected = true) : (btn.selected = false);
      });
      this.checkValueConditions(+button.amount, true);
      this.selectedAutoCompleteButton.set(button.id);
    } else {
      this.selectedAmount.set(undefined);
      this.form.controls['amount'].setValue(null);
      this.selectedAutoCompleteButton.set(0);
      this.checkValueConditions(0, true);
      this.autoCompleteButtons().forEach((btn) => {
        btn.selected = false;
      });
    }
    if (button.id === 1 && this.state().walletWithdrawableBalance >= this.state().minBnplAmount) {
      const btn: IAutoFill = {
        id: 1,
        selected: true,
        amount: this.state().walletWithdrawableBalance.toString(),
      };
      this.checkValueConditions(+btn.amount, true);
      this.selectedAutoCompleteButton.set(btn.id);
    }
  }

  private checkValueConditions(amount: number, fromButtonClick?: boolean): number {
    this.finalAmount.set(amount);
    const roundDown = this.state().roundDown;
    const walletBalance = this.state().walletWithdrawableBalance;
    const mod = amount % roundDown;
    const rounded = amount - mod;
    const final = rounded - walletBalance;
    this.payableAmount.set(Math.max(0, final));
    if (fromButtonClick) {
      this.isProgrammaticChange = true;
      this.form.controls['amount'].setValue(rounded, { emitEvent: true });
    }
    return rounded;
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
      amount: this.form.controls['amount'].value,
      type: 'bnplRequest',
      agreementChecked: this.agreementChecked(),
    };

    this.navigationService.navigateWithState([PROSPECTUS_ROUTE], {
      state: state,
    });
  }
}

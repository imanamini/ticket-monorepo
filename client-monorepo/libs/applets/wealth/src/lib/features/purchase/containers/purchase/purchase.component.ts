import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PriceUnitComponent } from '../../components/price-unit/price-unit.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { EMPTY, takeUntil } from 'rxjs';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PaymentHandlerService } from '../../services/payment-handler.service';
import { BaseComponent } from '../../../../components/core/components/base/base.component';
import { User } from '../../../../data-access/models/user.model';
import { FormErrorStatus } from '../../../../data-access/models/form-error-status.model';
import { EpdfType } from '../../../../components/core/models/instruments.enum';
import { FundDataService } from '../../../../components/core/services/fund-data.service';
import { numberToString } from '../../../../components/utils/number-to-string';
import { EIntrackEventName } from '../../../../components/core/models/intrack-event-name.enum';
import {
  CROWD_LIST_ROUTE,
  INVESTMENT_LIST_ROUTE,
  PROSPECTUS_ROUTE,
  RESULT_ROUTE,
  SEJAM_ERROR_ROUTE,
  TERMS_AND_CONDITIONS_ROUTE,
} from '../../../../data-access/constants/app-routes';
import { ErrorCodes } from '../../../../data-access/enums/error-codes';
import { IProspectusRouteState } from '../../../../components/core/models/prospectus-route-state.interface';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { catchError, finalize, map, switchMap, take, tap } from 'rxjs/operators';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { IAutoFill } from '../../models/purchase-auto-fill.model';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { DecimalPipe, NgClass } from '@angular/common';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { FundsService } from '../../../../components/core/services/v1/funds.service';
import { IPriceUnitProps } from '../../models';
import { IFundDetail, IOrderRequest, ProviderKey } from '../../../../components/core/models/fund-schemas';
import { IPurchaseRouteState } from '../../models/purchase-state.interface';
import { OrderService } from '../../../../shared/services/payment/order.service';
import { ICheckoutRequest } from '../../../../components/core/models/fund-schemas/fund-checkout-request.interface';
import { PaymentDetailBottomSheetComponent } from '../../components/payment-detail-bottom-sheet/payment-detail-bottom-sheet.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { ICreateFundPayment } from '../../../../components/core/models/create-fund-payment.interface';
import { EVerifyCustomerState } from '../../../../components/core/models/verify-customer-state.enum';
import { ValueLimiter } from '../../models/value-limiter.interface';
import { crowdProfileAdapter, fundProfileAdapter } from '../../utils/values-adapter';
import { CrowdFundingModel, ICrowdFundingPurchaseData } from '../../../crowds/data-access/models';
import { CrowdFundingService } from '../../../crowds/data-access/services/crowd-funding.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss'],
  standalone: true,
  imports: [
    NgxButtonComponent,
    PriceUnitComponent,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    NgxAppBarComponent,
    PipesModule,
    NgxCheckboxComponent,
    NgxCalloutComponent,
    DecimalPipe,
    SpinnerComponent,
    NgClass,
  ],
})
export class PurchaseComponent extends BaseComponent implements OnInit, OnDestroy {
  form: FormGroup;
  pdfType = EpdfType;
  state = signal<IPurchaseRouteState | undefined>(undefined);
  agreementChecked = signal<boolean>(false);
  showAgreementCheckbox = signal<boolean>(true);
  userInfo = signal<User | undefined>(undefined);
  isLoading = signal<boolean>(true);
  tomanValue = signal<string | undefined>(undefined);
  unitCount = signal<number>(0);
  showError = signal<FormErrorStatus>('hidden');
  onlineNav = signal<number | undefined>(undefined);
  symbol = signal<string | undefined>(undefined);
  buttonLoading = signal<boolean>(false);
  isCrowd = signal<boolean>(false);
  crowd = signal<CrowdFundingModel | undefined>(undefined);
  crowdData = signal<ICrowdFundingPurchaseData | undefined>(undefined);
  autoCompleteButtons = signal<IAutoFill[]>([
    {
      amount: '50000000',
      selected: false,
    },
    {
      amount: '150000000',
      selected: false,
    },
    {
      amount: '300000000',
      selected: false,
    },
    {
      amount: '500000000',
      selected: false,
    },
  ]);

  priceProps = signal<IPriceUnitProps | undefined>(undefined);

  fundProfile = signal<IFundDetail | undefined>(undefined);

  private navigationService = inject(WealthNavigationService);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private fundsService = inject(FundsService);
  private routeState = inject(RouteStateService);
  private fundDataService = inject(FundDataService);
  private crowdFundingService = inject(CrowdFundingService);
  private paymentHandlerService = inject(PaymentHandlerService);
  private eventService = inject(NgxEventTrackerService);
  private selectedAmount = signal<IAutoFill | undefined>(undefined);
  private bottomSheet = inject(NgxBottomSheetService);

  private readonly orderService = inject(OrderService);
  provider: ProviderKey = 'fund';

  constructor() {
    super();
  }

  private normalizeAmount(value: unknown): number | null {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === 'string') {
      const sanitized = value.replace(/,/g, '').trim();
      if (!sanitized) {
        return null;
      }

      const numericValue = Number(sanitized);
      return Number.isFinite(numericValue) ? numericValue : null;
    }

    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null;
    }

    return null;
  }

  private resetAmountState() {
    this.showError.set('hidden');
    this.tomanValue.set(undefined);
    this.unitCount.set(0);
  }

  private getAmountValue(): number | null {
    return this.normalizeAmount(this.form?.value?.amount);
  }

  private handlePaymentFailure() {
    this.buttonLoading.set(false);
  }

  ngOnInit(): void {
    this.initialPage();
    this.checkLoading();
    this.handleStateData();
    this.eventHandler(EIntrackEventName.FUND_BUY_PAGE);
    this.amountValueHandler();
    this.getData();
  }

  isValid() {
    const amount = this.getAmountValue();
    if (amount === null) {
      return false;
    }

    const adapter: ValueLimiter | null = this.fundProfile()
      ? new fundProfileAdapter(this.fundProfile()!)
      : this.crowdData()
        ? new crowdProfileAdapter(this.crowdData()!)
        : null;

    if (!adapter) return false;

    const minValue = adapter.minValue();
    const maxValue = adapter.maxValue();

    return amount >= minValue && (maxValue ? amount <= maxValue : true);
  }

  agreementView(pdfType: EpdfType) {
    const state: IProspectusRouteState = {
      symbol: this.symbol(),
      backToProfile: false,
      pdfType,
      type: 'buy',
      amount: this.form.value.amount,
      investmentType: this.crowdData() ? this.crowdData().investmentType : this.fundProfile()?.investmentType,
      agreementChecked: this.agreementChecked(),
    };

    this.navigationService.navigateWithState([PROSPECTUS_ROUTE], {
      state: state,
    });
  }

  onBackHandler() {
    const currentState = this.state();
    const query: Record<string, unknown> = {
      type: currentState?.type || this.fundProfile()?.type,
    };

    if (currentState?.referrer) {
      query['referrer'] = currentState.referrer;
    }

    if (currentState?.backTo) {
      this.navigationService.navigate([INVESTMENT_LIST_ROUTE, this.symbol()], {
        queryParams: query,
      });
    } else if (this.crowd()) {
      this.navigationService.navigate([CROWD_LIST_ROUTE, this.symbol()], {
        queryParams: query,
      });
    } else {
      this.navigationService.navigate([INVESTMENT_LIST_ROUTE], {
        queryParams: query,
      });
    }
  }

  onToggleAgreement(val: any) {
    this.agreementChecked.set(val);
  }

  handleAutoFill(button: IAutoFill) {
    if (button !== this.selectedAmount()) {
      this.selectedAmount.set(button);
      this.autoCompleteButtons().forEach((btn) => {
        btn.amount === this.selectedAmount()?.amount ? (btn.selected = true) : (btn.selected = false);
      });
      const normalizedAmount = this.normalizeAmount(button.amount);
      this.form.controls['amount'].setValue(normalizedAmount ?? null);
    } else {
      this.selectedAmount.set(undefined);
      this.form.controls['amount'].setValue(null);
      this.autoCompleteButtons().forEach((btn) => {
        btn.selected = false;
      });
    }
  }

  termsAndConditions() {
    this.navigationService.navigate([TERMS_AND_CONDITIONS_ROUTE]);
  }

  private checkLoading() {
    this.paymentHandlerService.loading$.pipe(takeUntil(this.destroyObservable)).subscribe((res) => {
      this.buttonLoading.set(res);
    });
  }

  private handleStateData() {
    if (this.state()?.amount) {
      this.form.controls['amount'].setValue(this.state().amount);
      this.tomanValue.set(numberToString(+this.state()?.amount / 10));
      this.showError.set('hidden');
    }
    if (this.state()?.agreementChecked) {
      this.agreementChecked.set(this.state()?.agreementChecked);
    }
  }

  private getData() {
    if (this.route.snapshot.queryParamMap.get('crowdFunding')) {
      this.isCrowd.set(true);
      this.crowdFundingService
        .getCrowdProject(this.symbol())
        .pipe(
          switchMap((res) => {
            if (res?.success) {
              this.crowd.set(res.result);
            }
            return this.crowdFundingService.getCrowdProfile(this.symbol());
          }),
          takeUntil(this.destroyObservable),
        )
        .subscribe((res) => {
          this.crowdData.set(res.result);
          this.showAgreementCheckbox.set(false);
          this.isLoading.set(false);
          if (this.state().callShowDetail) {
            this.createOrder(this.state(), this.state().investmentType === 'CrowdFund');
          }
        });
    } else {
      const currentState = this.state();
      if (currentState?.fundProfile) {
        this.handleFundData(currentState.fundProfile);
        this.isLoading.set(false);
      } else {
        this.fundsService.getFundProfileBySymbol(this.symbol()).subscribe((res) => {
          if (res.success) {
            this.handleFundData(res.result);
          }
          this.isLoading.set(false);
          if (this.state().callShowDetail) {
            this.createOrder(this.state(), this.state().investmentType === 'CrowdFund');
          }
        });
      }
    }
  }

  private handleFundData(fund: IFundDetail) {
    this.fundProfile.set(fund);
    this.priceProps.set({
      title: this.fundProfile()?.title,
      customerPortfolioUnit: 0,
      description: '',
      purchaseNav: this.fundProfile().purchaseNav,
      sectionType: 'BUY',
      type: this.fundProfile()?.type,
      sellNav: 0,
    });
  }

  private initialPage() {
    this.symbol.set(this.route.snapshot.paramMap.get('id'));
    this.state.set(this.routeState.getAll());
    this.form = this.formBuilder.group({
      amount: this.state()?.amount ?? null,
    });
    if (this.route.snapshot.queryParamMap.get('expired')) {
      this.navigationService.navigate([RESULT_ROUTE], {
        queryParams: {
          incomplete: true,
          instrumentSymbol: this.route.snapshot.queryParamMap.get('symbol'),
          instrumentType: this.isCrowd() ? 'CrowdFund' : this.fundProfile()?.type,
        },
      });
      return;
    }
  }

  private eventHandler(eventName: string) {
    const eventData = {
      eventName: eventName,
      eventData: {
        amount: this.state()?.amount ?? 0,
        units: this.state()?.units ?? 0,
        fundId: this.symbol() ?? 'unknown-fund',
      },
    };
    this.eventService.sendEvent(eventData);
  }

  private amountValueHandler() {
    this.form.controls['amount'].valueChanges.pipe(takeUntil(this.destroyObservable)).subscribe((res) => {
      const amount = this.normalizeAmount(res);
      if (amount === null) {
        this.resetAmountState();
        return;
      }

      this.amountChanged(amount);
    });
  }

  private verifyCustomerAndPaymentHandler() {
    const symbol = this.symbol();
    const isCrowdFunding = this.crowdData()?.investmentType === 'CrowdFund' || this.state().investmentType === 'CrowdFund';

    const state = this.generateStateDate();
    this.fundDataService
      .verifyCustomer(symbol)
      .pipe(
        takeUntil(this.destroyObservable),
        switchMap((verifyResult) => {
          if (!verifyResult?.success) {
            if (verifyResult?.error?.code === ErrorCodes.CustomerIsNotSejami) {
              this.eventHandler(EIntrackEventName.SEJAM_SERVICE_ERROR);
              this.navigationService.navigate([SEJAM_ERROR_ROUTE], {
                state: {
                  title: verifyResult.error.title,
                  description: verifyResult.error.description,
                },
              });
            } else {
              this.handlePaymentFailure();
            }
            return EMPTY;
          }
          if (verifyResult.result.state === EVerifyCustomerState.Verified) {
            this.createOrder(state, isCrowdFunding);
            return EMPTY;
          } else {
            this.paymentHandlerService.handleState(verifyResult.result.state, state);
            this.checkVerification(state, isCrowdFunding);
            return EMPTY;
          }
        }),
        catchError((err) => {
          this.handlePaymentFailure();
          return EMPTY;
        }),
        finalize(() => {
          this.buttonLoading.set(false);
        }),
      )
      .subscribe();
  }

  private createOrder(state, isCrowdFunding) {
    this.orderService
      .submitOrder(this.provider, this.generatePaymentData())
      .pipe(
        take(1),
        switchMap((res) => {
          if (!res?.success) {
            this.handlePaymentFailure();
            return EMPTY;
          }
          const enriched = {
            ...res.result,
            amountRounded: state.amount,
            isIPO: state.type === 'IPO',
            investmentType: state.type,
          };
          this.bottomSheet.openBottomSheet(PaymentDetailBottomSheetComponent, { data: enriched }, { noPadding: true });
          return this.bottomSheet.onClose.pipe(
            take(1),
            map(() => this.bottomSheet.outputData()),
            tap((bsRes: { paymentData: ICreateFundPayment; aggreement: boolean }) => {
              if (bsRes?.aggreement && bsRes?.paymentData?.orderId) {
                const payload = this.buildCheckoutPayload(bsRes, state, isCrowdFunding);
                this.orderService.submitCheckout(this.provider, payload);
              }
            }),
          );
        }),
      )
      .subscribe();
  }

  private checkVerification(state, isCrowdFunding) {
    this.paymentHandlerService.continuePayment$.subscribe((res) => {
      if (res) {
        this.createOrder(state, isCrowdFunding);
      }
    });
  }

  private buildCheckoutPayload(res: { paymentData: any }, state: { amount: number }, isCrowdFunding: boolean): ICheckoutRequest {
    return {
      orderId: res.paymentData.orderId,
      isCrowdFunding,
      ipoPaymentMethod: res.paymentData.ipoPaymentMethod,
      symbol: res.paymentData.instrumentSymbol,
      amount: state.amount,
    };
  }

  getVerifyResult() {
    this.buttonLoading.set(true);
    this.verifyCustomerAndPaymentHandler();
  }

  private generatePaymentData(): IOrderRequest {
    const unitCount = this.crowdData() ? 1 : this.unitCount();

    return {
      symbol: this.symbol(),
      amount: this.state().amount || this.form.controls['amount'].value,
      instrumentUnit: unitCount,
      units: unitCount || 1,
      ipoPaymentMethod: 'ByCredit',
    };
  }

  private generateStateDate() {
    return {
      ...this.state(),
      symbol: this.symbol(),
      amount: this.form.controls['amount'].value,
      ...(this.crowdData() ? this.crowdData() : this.fundProfile()),
    };
  }

  private amountChanged(val: number) {
    this.showError.set('hidden');
    this.tomanValue.set(numberToString(val / 10));
    if (!this.isCrowd()) {
      this.unitCount.set(this.fundProfile() ? Math.floor(val / this.fundProfile().purchaseNav) : 0);
    }
  }
}

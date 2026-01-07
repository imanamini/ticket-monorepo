import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CashInConfig } from '../../data-access/models/cash-in-config';
import { ActivatedRoute, Router } from '@angular/router';
import { CashInApisService } from '../../data-access/services/cash-in-apis.service';
import { AppNameService, MessageService } from '@client-monorepo/common/utilities';
import { WalletPayService } from '@client-monorepo/applets/cash-in';
import { UrlService } from '../../data-access/services/url.service';
import { Hint } from '../../data-access/utils/hint';
import { RangeNumber } from '../../data-access/models/range-number.model';
import { RangeValidator } from '../../data-access/utils/range.validator';
import { convertNonEnglishDigits, currencyFormat } from '@digipay/strings';
import { VoucherCodeFormResult } from '../../data-access/models/voucher-code-form-result';
import { PaymentResult } from '@digipay/ngx-payment-result/lib/model/payment-result.model';
import { stopPropagationInMobile, toggleTooltipInMobile } from '../../data-access/utils/tooltip';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { HintComponent } from '../../components/hint/hint.component';
import { AmountInfoComponent } from '../../components/amount-info/amount-info.component';
import { AmountSuggestionsComponent } from '../../components/ui-amount-suggestions/cash-in-applet-amount-suggestions.component';
import { CashInVoucherCodeBottomSheetComponent } from '../../components/cash-in-voucher-code-bottom-sheet/cash-in-voucher-code-bottom-sheet.component';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { finalize } from 'rxjs/operators';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { AuthenticationStorage } from '@client-monorepo/common/user';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { DigikalaService } from '@client-monorepo/pillar/digikala';
import { WALLET_GTM_TAG, WalletGtmService } from '@client-monorepo/payment/wallet';

@Component({
  selector: 'cash-in-applet-main-cash-in',
  standalone: true,
  imports: [
    AmountInfoComponent,
    HintComponent,
    UiFormFieldBuilderModule,
    FormsModule,
    NgIf,
    AmountSuggestionsComponent,
    NgxButtonComponent,
    HintComponent,
    PageLayoutComponent,
    NgxTooltipDirective,
  ],
  templateUrl: './main-cash-in.component.html',
  styleUrl: './main-cash-in.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainCashInComponent implements OnInit {
  cashInForm: UntypedFormGroup;

  isSubmitting = signal(false);

  isLoaded = false;

  cashInConfig!: CashInConfig;

  cashInDefaults: Array<string> = [];

  formattedValue = '';

  validAmount = false;

  @ViewChild('amountInput')
  amountInput!: ElementRef;

  public hintAlreadyRead = signal(false);

  public tooltipText =
    'برای این‌که افزایش موجودی کیف‌پول موفق باشد، باید از کارت بانکی که با شماره ملی و شماره موبایلی که در هنگام ثبت‌نام در دیجی‌پی وارد نموده‌اید استفاده کنید.';

  protected readonly toggleTooltipInMobile = toggleTooltipInMobile;

  protected readonly stopPropagationInMobile = stopPropagationInMobile;

  private bottomSheet = inject(NgxBottomSheetService);

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private cashInApis: CashInApisService,
    private messageService: MessageService,
    private changeDetectorRef: ChangeDetectorRef,
    private walletPayService: WalletPayService,
    private route: ActivatedRoute,
    private urlService: UrlService,
    private hybridService: NgxHybridService,
    private appNameService: AppNameService,
    private digikalaService: DigikalaService,
    private walletGtm: WalletGtmService,
  ) {
    this.cashInForm = this.fb.group({
      amount: ['', Validators.required],
      amountInteger: [''],
    });

    this.getCashInConfig();
  }

  ngOnInit() {
    this.cashInForm.valueChanges.subscribe((values) => {
      if (values.amount) {
        if (typeof values.amount === 'string') {
          values.amount = values.amount.replace(/[^\d]/g, '');
          this.cashInForm.patchValue(
            {
              amountInteger: values.amount,
            },
            {
              emitEvent: false,
            },
          );
          values.amount = this.removeSeparators(values.amount);
        }
        this.formattedValue = currencyFormat(values.amount);
        this.changeDetectorRef.markForCheck();
      } else {
        this.formattedValue = '';
      }
    });
    this.hintAlreadyRead.set(new Hint().getState() as boolean);
  }

  valueChanged($event: number) {
    
    this.cashInForm.patchValue({
      amount: $event,
    });
  }

  onSubmit(): void {
    let amount = this.cashInForm.controls['amount'].value;

    if (!amount) {
      return;
    }

    if (this.cashInForm.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);

    amount = this.removeSeparators(amount);
    amount = parseInt(amount, 10);
    const returnUrl = this.appNameService.isPillar()
      ? this.urlService.paymentCallbackUrlPillar(this.digikalaService.getPlatform(), 'cash-in')
      : this.urlService.setPaymentUrl('cash-in');
    this.createCashIn(amount, returnUrl);
  }

  private createCashIn(amount: any, returnUrl: string) {
    this.cashInApis
      .createCashInPayment(amount, returnUrl)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe(
        (result: any) => {
          this.sendPurchaseEvent(amount);
          if (this.appNameService.isPillar()) {
            return this.digikalaService.openExternalLink(result.payUrl);
          }
          if (result.payUrl) {
            if (this.hybridService.isHybrid()) {
              window.open(result.payUrl, '_blank');
            } else {
              window.open(result.payUrl, '_self');
            }
          }
        },
        (e) => {
          console.log(e);
          this.messageService.showErrorOfErrorResponse(e);
        },
      );
  }

  private sendPurchaseEvent(amount: any) {
    this.walletGtm.publishEvent(WALLET_GTM_TAG.CASHIN_PURCHASE, { amount: amount });
  }

  hideVoucherUi(): void {
    this.router.navigate([], {
      queryParams: {
        voucher: null,
      },
    });
  }

  onBack() {
    this.walletGtm.publishEvent(WALLET_GTM_TAG.CASHIN_BACK);
    history.back();
  }


  onClickTooltip() {
    this.walletGtm.publishEvent(WALLET_GTM_TAG.CASHIN_INFO);
  }
   
  displayVoucherCodeUi(): void {
    this.walletGtm.publishEvent(WALLET_GTM_TAG.CASHIN_GIFT);
    this.bottomSheet.openBottomSheet(CashInVoucherCodeBottomSheetComponent, {});

    const bottomSheetService = this.bottomSheet.onClose.subscribe(() => {
      bottomSheetService.unsubscribe();
      const result = this.bottomSheet.outputData();
      this.hideVoucherUi();
      if (!result) {
        return;
      }
      if (result.result) {
        this.handleVoucherFormResult(result);
      }
    });
  }

  onSuggestionSelect($event: any) {
    this.validAmount = true;
    this.cashInForm.patchValue({
      amount: currencyFormat($event),
    });
  }

  goToDirectDebitApp(): void {
    this.router.navigate([], {
      queryParams: {
        'direct-debit': 1,
      },
    });
  }

  redirectToDirectDebit() {
    if (!this.cashInConfig.directDebitEntrypoint || !this.cashInConfig.directDebitEntrypoint.url) {
      return;
    }

    const base = this.cashInConfig.directDebitEntrypoint.url;

    const callback = this.urlService.appCallbackUrl('/service/cash-in');

    const token = AuthenticationStorage.getToken();

    const url = base + '?token=' + token + '&redirectUrl=' + encodeURIComponent(callback);

    window.location.href = url;
  }

  private getCashInConfig() {
    this.cashInApis.getConfig().subscribe((result) => {
      this.cashInConfig = result;
      this.cashInDefaults = [...result.defaultAmounts]
        .sort((a: number, b: number) => {
          return a - b;
        })
        .map((i) => '' + i);

      this.cashInForm.controls['amount'].setValue(result.defaultAmountValue);
      this.cashInForm.controls['amountInteger'].setValue('' + result.defaultAmountValue);
      const range: RangeNumber = {
        min: result.minAmount,
        max: result.maxAmount,
      };
      this.cashInForm.controls['amount'].setValidators([RangeValidator(this.cashInForm.controls['amount'], range)]);
      this.isLoaded = true;
      this.validAmount = true;
      this.checkQueryParams();
    });
  }

  private checkQueryParams() {
    this.route.queryParams.subscribe((params) => {
      if (params['voucher']) {
        this.displayVoucherCodeUi();
      }
      if (params['direct-debit']) {
        this.redirectToDirectDebit();
      }
    });
  }

  private removeSeparators(value: any) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return convertNonEnglishDigits(value).replace(/[^\d]/g, '');
  }

  sendToolTipEvent() {
    this.walletGtm.publishEvent(WALLET_GTM_TAG.CASHIN_INFO);
  }

  private handleVoucherFormResult(result: VoucherCodeFormResult): void {
    this.walletPayService.goToPaymentResultPage(result.result as PaymentResult);
  }
}

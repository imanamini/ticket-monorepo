import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OnboardingComponent } from '../onboarding/onboarding.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { AppNameService, MessageService } from '@client-monorepo/common/utilities';
import { DirectDebitApiService } from '../../data-access/services/direct-debit-api.service';
import { DirectDebitService } from '../../data-access/services/direct-debit.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxButtonComponent } from '@digipay/ngx-button';
import {
  DirectDebitActionType,
  DirectDebitBank,
  DirectDebitContract,
  DirectDebitContractStatus,
  DirectDebitErrorCodes,
  TimeUnit,
  transactionAmountFormOptions,
} from '../../data-access/model/direct-debit.model';
import { numberToString } from '@digipay/strings';
import { TermsComponent } from '../terms/terms.component';
import { UrlService } from '../../data-access/services/url.service';
import { DigikalaService } from '@client-monorepo/pillar/digikala';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { ContractCreateConfirmationComponent } from '../contract-create-confirmation/contract-create-confirmation.component';
import { ContractCreateLoadingComponent } from '../contract-create-loading/contract-create-loading.component';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { UserApiService } from '@client-monorepo/common/user';

@Component({
  selector: 'direct-debit-contract-create-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    NgxButtonComponent,
    ContractCreateLoadingComponent,
    PageLayoutComponent,
  ],
  templateUrl: './contract-create-form.component.html',
  styleUrl: './contract-create-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractCreateFormComponent {
  private readonly bottomSheet = inject<NgxBottomSheetService<any>>(NgxBottomSheetService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(DirectDebitService);
  private readonly api = inject(DirectDebitApiService);
  private readonly message = inject(MessageService);
  private readonly url = inject(UrlService);
  private readonly appName = inject(AppNameService);
  private readonly digikala = inject(DigikalaService);
  private readonly hybrid = inject(NgxHybridService);
  private readonly user = inject(UserApiService);

  form = this.fb.group({
    validate: this.fb.group({
      nationalCode: ['', [Validators.required, NgxFormValidator.nationalCodeValidator()]],
    }),
    detail: this.fb.group({
      bankCode: [null, [Validators.required]],
      maxDailyTransactionAmount: [0, [Validators.required]],
    }),
  });
  loading = signal<boolean>(false);
  loadingRedirection = signal<boolean>(false);
  contracts: DirectDebitContract[] = [];
  bankCodeOptions = signal<{ title: string; value: string }[]>([]);
  transactionAmountOptions = signal<{ title: string; value: number }[]>(transactionAmountFormOptions);
  bankData: DirectDebitBank[] = [];
  validate: boolean = false;

  public get FormValidate() {
    return this.form.controls.validate;
  }

  public get FormDetail() {
    return this.form.controls.detail;
  }

  ngOnInit(): void {
    this.getBankList();
    this.getContracts();
    this.listenToBankCodeChanges();
    this.loadNationalCode();
  }

  loadNationalCode() {
    this.user.getProfile().subscribe({
      next: (result) => {
        const { nationalCode } = result;
        if (!nationalCode) return;
        this.form.patchValue({ validate: { nationalCode: nationalCode } });
      },
    });
  }

  restoreFormState() {
    if (this.service.getSnapshot().formValue) {
      const { validate } = this.service.getSnapshot().formValue;
      this.form.patchValue({ validate: { nationalCode: validate.nationalCode } });
      this.validate = this.service.getSnapshot().validate;
    }
  }

  private listenToBankCodeChanges(): void {
    const { bankCode, maxDailyTransactionAmount } = this.FormDetail.controls;

    bankCode.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((selectedCode) => {
      this.transactionAmountOptions.set([]);
      maxDailyTransactionAmount.reset();

      if (!this.bankCodeOptions()?.length) return;

      const selectedBank = this.bankData.find((bank) => bank.code === selectedCode);
      if (!selectedBank) return;

      const { dailyAmountMax } = selectedBank.directDebit;
      const availableOptions = transactionAmountFormOptions.filter((option) => option.value <= dailyAmountMax);
      if (availableOptions.length === 0) {
        availableOptions.push({
          title: numberToString(dailyAmountMax / 10) + ' تومان',
          value: dailyAmountMax,
        });
      }

      this.transactionAmountOptions.set(availableOptions);
      this.FormDetail.patchValue({ maxDailyTransactionAmount: availableOptions[availableOptions.length - 1].value });
    });
  }

  private openBottomSheetOnboarding() {
    if (this.contracts.length > 0) return;
    this.bottomSheet.openBottomSheet(OnboardingComponent, {});
    this.handleBottomSheetOnboardingClose();
  }

  private handleBottomSheetOnboardingClose() {
    this.bottomSheet.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {});
  }

  openBottomSheetTerms() {
    this.bottomSheet.openBottomSheet(TermsComponent, {});
    this.handleBottomSheetTermsClose();
  }

  getContracts() {
    this.loading.set(true);
    this.api
      .getContractSearch({
        size: 1,
        orders: [
          {
            field: 'creationDate',
            order: 'desc',
          },
        ],
        restrictions: [
          {
            type: 'and',
            field: 'status',
            restrictions: [
              {
                field: 'status',
                type: 'simple',
                operation: 'ne',
                value: DirectDebitContractStatus.PENDING,
              },
              {
                field: 'status',
                type: 'simple',
                operation: 'ne',
                value: DirectDebitContractStatus.FAILED,
              },
              {
                field: 'status',
                type: 'simple',
                operation: 'ne',
                value: DirectDebitContractStatus.ABANDONED,
              },
              {
                field: 'status',
                type: 'simple',
                operation: 'ne',
                value: DirectDebitContractStatus.INITIATED,
              },
            ],
          },
        ],
      })

      .subscribe({
        next: (data) => {
          const { contracts } = data;
          this.contracts = [...contracts];
          this.openBottomSheetOnboarding();
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }

  private handleBottomSheetTermsClose() {
    this.bottomSheet.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {});
  }

  getBankList() {
    this.loading.set(true);
    this.api.banksList().subscribe({
      next: (response) => {
        this.bankData = response.banks;
        this.bankCodeOptions.set(response.banks.map((bank) => ({ title: bank.name, value: bank.code })));
        this.restoreFormState();
      },
      complete: () => {
        this.loading.set(false);
      },
      error: (error) => {
        this.message.showErrorOfErrorResponse(error);
      },
    });
  }

  openBottomSheetConfirm() {
    if (this.form.invalid) return;
    this.bottomSheet.openBottomSheet(ContractCreateConfirmationComponent, {});
    this.handleBottomSheetConfirmClose();
  }

  private handleBottomSheetConfirmClose() {
    const bottomSheetService = this.bottomSheet.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      bottomSheetService.unsubscribe();
      console.log(this.bottomSheet.outputData());
      if (this.bottomSheet.outputData()) {
        this.onSubmit();
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const returnUrl = this.appName.isPillar() ? this.url.callbackUrlPillar(this.digikala.getPlatform()) : this.url.setPaymentUrl();
    const { nationalCode } = this.form.controls.validate.value;
    const { bankCode, maxDailyTransactionAmount } = this.form.controls.detail.value;

    this.loadingRedirection.set(true);
    this.loading.set(true);
    this.api
      .validate({ nationalCode: nationalCode! })
      .pipe(
        tap(() => (this.validate = true)),
        switchMap(() =>
          this.api.create({
            action: { type: DirectDebitActionType.CASH_IN, minWalletBalance: 0 },
            duration: { count: 1, timeUnit: TimeUnit.YEAR },
            maxDailyTransactionAmount: maxDailyTransactionAmount!,
            nationalCode: nationalCode!,
            bankCode: bankCode!,
            redirectUrl: returnUrl,
          }),
        ),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (data) => {
          this.service.saveState({ formValue: this.form.value, validate: this.validate });
          if (this.appName.isPillar()) {
            return this.digikala.openExternalLink(data.redirectUrl);
          }
          if (data.redirectUrl) {
            if (this.hybrid.isHybrid()) {
              window.open(data.redirectUrl, '_blank');
            } else {
              window.open(data.redirectUrl, '_self');
            }
          }
        },
        complete: () => {
          this.loading.set(false);
          this.loadingRedirection.set(false);
        },
        error: (error) => {
          this.loadingRedirection.set(false);
          if (error.error.result.status === DirectDebitErrorCodes.IDENTITY_MISMATCH) {
            this.message.showErrorMessage('کدملی نامعتبر', 'کدملی با شماره موبایل مطابقت ندارد.');
            return;
          }
          this.message.showErrorOfErrorResponse(error);
        },
      });
  }

  onBack() {
    history.back();
  }

  ngOnDestroy(): void {
    this.loading.set(false);
  }
}

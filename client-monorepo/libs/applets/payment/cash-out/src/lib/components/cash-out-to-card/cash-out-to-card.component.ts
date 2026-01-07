import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CashOutDetailComponent } from '../cash-out-detail/cash-out-detail.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CashOutStateService } from '../../data-access/services/cash-out-state.service';
import { CashOutApiService } from '../../data-access/services/cash-out-api.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { WalletInfoResponse } from '../../data-access/models/wallet-info-response.model';
import { MessageService } from '@client-monorepo/common/utilities';
import { ActivatedRoute, Router } from '@angular/router';
import { CashOutByPanService } from '../../data-access/services/cash-out-by-pan.service';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { WALLET_GTM_TAG, WalletGtmService } from '@client-monorepo/payment/wallet';

@Component({
  selector: 'cash-out-applet-card',
  standalone: true,
  imports: [CashOutDetailComponent, UiFormFieldBuilderModule, ReactiveFormsModule, NgxButtonComponent],
  templateUrl: './cash-out-to-card.component.html',
  styleUrl: './cash-out-to-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CashOutByPanService],
})
export class CashOutToCardComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly message = inject(MessageService);
  private readonly state = inject(CashOutStateService);
  private readonly api = inject(CashOutApiService);
  private readonly fb = inject(FormBuilder);
  private readonly walletGtm = inject(WalletGtmService);

  loading = signal<boolean>(false);
  isAmountValid = signal<boolean>(false);
  walletConfig = signal<WalletInfoResponse | null>(null);

  private destroy = new Subject<void>();
  form = this.fb.nonNullable.group({
    amount: [0, Validators.required],
  });

  ngOnInit(): void {
    this.getWalletConfig();
    this.sendCashOutCardEvent();
  }

  getWalletConfig() {
    this.loading.set(true);
    this.api
      .getWalletInfo()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => {
          this.walletConfig.set(data);
          this.updateWalletConfigState();
          this.setupFormValidation();
        },
        error: (err) => this.message.showErrorOfErrorResponse(err),
      });
  }
  private updateWalletConfigState() {
    const { certFile = '', tacUrl = '', feeCharge = 0 } = this.walletConfig() || {};
    this.state.dispatch({ type: 'UPDATE_WALLET_CONFIG', payload: { certFile, tacUrl, feeCharge } });
  }

  setupFormValidation(): void {
    // TODO: add access value controller for large amount field
    this.form.valueChanges.pipe(takeUntil(this.destroy)).subscribe({
      next: ({ amount = 0 }) => {
        const { minAmount = 0, maxAmount = 0, remainingCap = 0 } = this.walletConfig() || {};
        if (remainingCap < amount) return this.isAmountValid.set(false);
        amount >= minAmount && amount <= maxAmount ? this.isAmountValid.set(true) : this.isAmountValid.set(false);
      },
    });
  }

  cashOutAllAmount() {
    this.walletGtm.publishEvent(WALLET_GTM_TAG.CASHOUT_CARD_TOTAL_BALANCE);
    this.form.patchValue({ amount: this.walletConfig()?.cashoutableBalance });
  }

  storeAmount() {
    if (!this.isAmountValid()) return;
    this.walletGtm.publishEvent(WALLET_GTM_TAG.CASHOUT_CARD_CONTINUE);

    this.state.dispatch({ type: 'UPDATE_AMOUNT', payload: { amount: Number(this.form.value?.amount) } });
    this.router.navigate(['./card/choose-card'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  sendCashOutCardEvent() {
    this.walletGtm.publishEvent(WALLET_GTM_TAG.CASHOUT_CARD);
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { CashOutStateService } from '../../data-access/services/cash-out-state.service';
import { CashOutState } from '../../data-access/models/cash-out-state.model';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { CashOutApiService } from '../../data-access/services/cash-out-api.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { PanTypeEnum } from '../../data-access/models/pan-type.enum';
import { finalize, map } from 'rxjs';
import { PaymentResultInterface, WalletPayService } from '@client-monorepo/payment/purchase';
import { StoredCard } from '../../data-access/models/stored-card.model';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { convertWalletGtmToPillar, WALLET_GTM_TAG, WalletGtmService } from '@client-monorepo/payment/wallet';

@Component({
  selector: 'cash-out-applet-cash-out-confirmation',
  standalone: true,
  imports: [DpIconComponent, ApiImageModule, PipesModule, NgxButtonComponent],
  templateUrl: './cash-out-confirmation.component.html',
  styleUrl: './cash-out-confirmation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CashOutStateService],
})
export class CashOutConfirmationComponent implements OnInit, OnDestroy {
  private bottomSheet = inject<NgxBottomSheetService<any>>(NgxBottomSheetService);
  private readonly message = inject(MessageService);
  private readonly state = inject(CashOutStateService);
  private readonly api = inject(CashOutApiService);
  private readonly walletPay = inject(WalletPayService);
  private walletGtm = inject(WalletGtmService);

  amount = signal<number>(0);
  feeCharge = signal<number>(0);
  feeChargeAfterDiscount!: number;

  data = signal<CashOutState>(this.state.getState());
  formattedPan = computed(() =>
    this.data()
      .card.pan.replace(/(\d{4})/g, '$1 ')
      .trim(),
  );

  transferTimeMessage = computed(() => {
    const { aboveThreshold, belowThreshold } = this.transferTimeMessages;
    const amount = this.data()?.amount ?? 0;

    return amount > this.maxThresholdAmount ? aboveThreshold : belowThreshold;
  });

  private maxThresholdAmount = 10_000_000;
  private transferTimeMessages = {
    aboveThreshold: `واریز وجه به حساب بانکی شما بر اساس سیکل پایا انجام می‌شود. مبالغ پایین‌تر در صورت امکان به صورت آنی واریز خواهند شد.`,
    belowThreshold: `واریز وجه به حساب بانکی شما بر اساس سیکل پایا انجام می‌شود. مبالغ پایین‌تر در صورت امکان به صورت آنی واریز خواهند شد.`,
  };
  hasFeeCharge = computed<boolean>(() => this.feeCharge() > 0);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.getAmount();
    this.getFeeCharge();
  }

  private getAmount() {
    const { amount = 0 } = this.state.getState();
    this.amount.set(amount);
  }

  getFeeCharge(): void {
    this.api.getFeeChargeOfCashOutToCard(this.amount()).subscribe({
      next: (res) => {
        this.feeCharge.set(res.feeCharge);
        this.feeChargeAfterDiscount = 0;
      },
      error: (error) => {
        this.message.showErrorOfErrorResponse(error);
        this.closeBottomSheet();
      },
    });
  }

  registerCashOut() {
    this.loading.set(true);

    if (!this.data()) return;
    const { amount, card, walletConfig } = this.data();

    this.walletGtm.publishEvent(WALLET_GTM_TAG.CASHOUT_CARD_PURCHASE, { amount });
    this.api
      .registerCashOut(this.cashOutDataMapper(amount, card, walletConfig))
      .pipe(
        finalize(() => {
          this.loading.set(false);
          this.closeBottomSheet();
        }),
        map((result) => ({
          ...result,
          trackingCode: result.trackingCode,
          paymentResult: result.result.status,
          activityInfo: result.detailInfo,
        })),
      )
      .subscribe({
        next: (result: PaymentResultInterface) => {
          this.walletPay.goToPaymentResultPage(result);
        },
        error: (err) => {
          this.message.showErrorOfErrorResponse(err);
        },
      });
  }

  private cashOutDataMapper(amount: number, card: StoredCard, walletConfig: { certFile: string; tacUrl: string; feeCharge: number }) {
    return {
      amount,
      type: 'card',
      targetPan: {
        prefix: card.prefix,
        postfix: card.postfix,
        type: card.type ?? PanTypeEnum.INDEX,
        value: card.cardIndex,
        expireDate: card.expireDate,
      },
      certFile: walletConfig.certFile,
    };
  }

  closeBottomSheet() {
    this.walletGtm.publishEvent(WALLET_GTM_TAG.CASHOUT_CARD_CANCEL);
    this.bottomSheet.closeBottomSheet();
  }

  ngOnDestroy(): void {
    this.bottomSheet.closeBottomSheet();
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService, StorageService } from '@client-monorepo/common/utilities';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { SeparateThousandsPipe } from '@digipay/ng-lib-pipes';
import { NgxPaymentResult, PaymentResult } from '@digipay/ngx-payment-result';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../components/core/components/base/base.component';
import { ReceiptHandlerService } from '../../../components/core/services/receipt-handler.service';
import { PENDING_TRANSACTIONS_ROUTE, PORTFO, TRANSACTIONS_ROUTE, WALLETS_ROUTE } from '../../../data-access/constants/app-routes';
import { OrderStatus } from '../../../data-access/enums/order-status';
import { TransactionTypeEnum } from '../../../data-access/enums/transaction-type.enum';
import { IReceipt } from '../../../data-access/models/receipt.interface';
import { WalletService } from '../../../features/wallet/services/wallet.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { ReceiptService } from './receipt.service';
import { isDeposit, isPending } from './utils/predicates';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [CommonModule, NgxPaymentResult, SpinnerComponent],
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceiptComponent extends BaseComponent implements OnInit {
  uniqueId = signal<string>('');
  isLoading = signal<boolean>(true);
  from = signal<string | null>(null);
  trackingCode = signal<string | undefined>(undefined);
  walletAction = signal<string | undefined>(undefined);
  info = signal<IReceipt | undefined>(undefined);
  paymentResult = signal<PaymentResult | undefined>(undefined);
  separateThousandsPipe = new SeparateThousandsPipe();
  transactionType = TransactionTypeEnum;

  private route = inject(ActivatedRoute);
  private walletService = inject(WalletService);
  private receiptService = inject(ReceiptService);
  private messageService = inject(MessageService);
  private storageService = inject(StorageService);
  private eventService = inject(NgxEventTrackerService);
  private navigationService = inject(WealthNavigationService);
  private receiptHandlerService = inject(ReceiptHandlerService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.uniqueId.set(this.route.snapshot.queryParams['uniqueId']);
    this.trackingCode.set(this.route.snapshot.queryParams['trackingCode']);
    this.walletAction.set(this.route.snapshot.queryParams['walletAction']);
    this.from.set(this.route.snapshot.queryParams['from']);
    this.fetchReceipt();
  }

  onBackClicked() {
    if (this.info()?.instrumentType === 'Wallet') {
      this.navigationService.navigate([WALLETS_ROUTE, this.info()?.walletName.toLocaleLowerCase()]);
    } else if (this.from() === 'portfo') {
      this.navigationService.navigate([PORTFO]);
    } else if (this.from() === 'pendingTransactions') {
      this.navigationService.navigate([PENDING_TRANSACTIONS_ROUTE], {
        queryParams: {
          status: ['Waiting', 'Draft'],
          type: 'Buy',
          count: '20',
        },
      });
    } else if (this.info()?.instrumentType === 'Wallet_FixIncome' || this.info()?.instrumentType === 'Wallet_Gold') {
      this.navigationService.navigate([WALLETS_ROUTE, 'treasury']);
    } else {
      this.navigationService.navigate([TRANSACTIONS_ROUTE]);
    }
  }

  private fetchReceipt() {
    if (this.trackingCode()) {
      const isCashOut = this.walletAction() === 'cashOut';
      const request$ = isCashOut
        ? this.walletService.walletCashoutInquiry(this.trackingCode())
        : this.walletService.walletCashinInquiry(this.trackingCode());

      request$.pipe(takeUntil(this.destroyObservable)).subscribe((res) => {
        if (res.success) {
          this.handleWalletsTransaction(res.result, isCashOut ? 'cashOut' : 'cashIn');
        } else {
          if (res?.error?.title) {
            this.messageService.showErrorMessage(res.error.title);
          }
          this.navigationService.navigate([TRANSACTIONS_ROUTE]);
        }
      });
    } else {
      this.receiptService
        .getReceiptData(this.uniqueId())
        .pipe(takeUntil(this.destroyObservable))
        .subscribe((res) => {
          if (res.success) {
            this.info.set(res.result);
            const items = this.receiptHandlerService.setFields(res.result);
            const receiptInfo = this.receiptHandlerService.getReceiptInfo(res.result);

            this.paymentResult.set({
              ...(res.result.amount > 0 ? { amount: res.result.amount } : { units: res.result.units }),
              items,
              paymentResult: receiptInfo.result,
            });
          }
          this.isLoading.set(false);
        });
    }
  }

  private handleWalletsTransaction(receipt: IReceipt, type: 'cashIn' | 'cashOut') {
    this.info.set(receipt);
    const items = this.receiptHandlerService.setFields(receipt);
    const receiptInfo = this.receiptHandlerService.getReceiptInfo(receipt);

    const customTitle = this.getCustomTitle(receipt);
    const title = customTitle && customTitle + (isPending(receipt) ? 'کیف ثروت' : ` ${receipt.instrumentName}`);

    const paymentResult: PaymentResult = {
      amount: receipt.amount || 0,
      items,
      paymentResult: receiptInfo.result,
      ...(title ? { title } : {}),
    };

    this.paymentResult.set(paymentResult);
    const eventData =
      type === 'cashIn'
        ? {
            event: receipt.status === OrderStatus.Failed ? 'purchase_failed' : 'purchase',
            ecommerce: {
              value: receipt.amount,
              transaction_id: receipt?.requestId,
              transaction_type: 'cash_in_wealth',
              order_id: receipt?.receiptNumber || 'not_set',
              user_id: this.storageService.getUserId(),
              coupon: 'not_set',
              couponvalue: 'not_set',
              method: 'bank',
              biz_id: 'not_set',
              tax: 0,
              currency: 'USD',
              ...(receipt.status === OrderStatus.Failed ? { error_code: 'not_set', error_message: 'not_set' } : {}),
            },
          }
        : {
            eventName: `${receipt.walletName.toLowerCase()}_${type.toLowerCase()}_${receipt.status}`,
            eventData: {
              Status: receipt?.status,
              TransactionType: receipt?.transactionType,
              Request_Id: receipt?.requestId,
              Receipt_Number: receipt?.receiptNumber,
              User_Id: this.storageService.getUserId(),
              Amount: receipt.amount,
            },
          };
    this.eventService.sendEvent(eventData, { platforms: ['gtm'] });

    this.isLoading.set(false);
  }

  private getCustomTitle(receipt: IReceipt): string {
    const isFxOrGoldWallet = receipt.walletName === 'WALLET_FX' || receipt.walletName === 'WALLET_GOLD';
    if (!isFxOrGoldWallet) {
      return '';
    }

    if (isPending(receipt) || isDeposit(receipt)) {
      return receipt.transactionType === TransactionTypeEnum.Withdrawal ? 'فروش' : 'خرید';
    }

    return '';
  }
}

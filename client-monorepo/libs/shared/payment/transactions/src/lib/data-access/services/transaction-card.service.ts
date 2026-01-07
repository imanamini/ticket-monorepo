import { Injectable } from '@angular/core';
import { TransactionCard } from '../models/transaction-card';
import { DEFAULTTRANSACTIONCARD } from '../constants/transaction-card';
import { TransactionInterface } from '@client-monorepo/payment/transactions';
import { PendingTransaction } from '../models/pending-transaction';
import {
  FrequentBundlePayload,
  FrequentC2CPayload,
  InnerPayload,
  Payment,
  SERVICE_TYPE,
  UpcomingInstallmentPayload,
  UpcomingScheduledPayload,
} from '../models/payment';
import { BillPayment } from '@client-monorepo/daily-fintech/bill';

@Injectable({
  providedIn: 'root',
})
export class TransactionCardService {
  mapC2CFrequentTransactionsToTransactionCards(frequentTransactions: Payment[]): TransactionCard[] {
    return frequentTransactions.map((t: Payment) => {
      const amount = (t.payload as FrequentC2CPayload).info.find((p) => p.label === 'amount')?.value || '';
      const iconId = (t.payload as FrequentC2CPayload).info.find((p) => p.label === 'iconId')?.value || '';
      const transactionCard: TransactionCard = {
        ...DEFAULTTRANSACTIONCARD,
        type: 'frequent',
        status: {
          ...DEFAULTTRANSACTIONCARD.status,
          message: amount + ' ریال برای ' + (t.payload as FrequentC2CPayload).subTitle,
        },
        title: (t.payload as FrequentC2CPayload).title,
        image: {
          ...DEFAULTTRANSACTIONCARD.image,
          mode: 'single',
          type: 'logo-on-back',
          id: iconId,
        },
        showDivider: false,
        frequentType: 'c2c',
        payload: t.payload as FrequentC2CPayload,
      };
      return transactionCard;
    });
  }

  mapBundleFrequentTransactionsToTransactionCards(frequentTransactions: Payment[]): TransactionCard[] {
    return frequentTransactions.map((t: Payment) => {
      const transactionCard: TransactionCard = {
        ...DEFAULTTRANSACTIONCARD,
        type: 'frequent',
        status: {
          ...DEFAULTTRANSACTIONCARD.status,
          message: 'برای شماره ' + (t.payload as FrequentBundlePayload).data.topUpRecommendation.title,
        },
        title: (t.payload as FrequentBundlePayload).data.internetPackage.description,
        image: {
          ...DEFAULTTRANSACTIONCARD.image,
          mode: 'single',
          type: 'icon',
          icon: { icon: 'network', iconSize: '24', iconType: 'bold', classes: 'text-onback-brand' },
        },
        showDivider: false,
        frequentType: 'bundle',
        payload: t.payload as FrequentBundlePayload,
      };
      return transactionCard;
    });
  }

  mapUpcomingScheduledTransactionsToTransactionCards(upcomingTransactions: Payment[], mode = 'summary'): TransactionCard[] {
    return upcomingTransactions.map((t: Payment, index: number) => {
      const payload: InnerPayload = JSON.parse((t.payload as UpcomingScheduledPayload).payload as string);
      const isUrgent = false;
      // const isUrgent = timeNow > t.payload.nextRunDate;
      const transactionCard: TransactionCard = {
        ...DEFAULTTRANSACTIONCARD,
        type: 'upcoming',
        title: 'خرید شارژ ' + payload.chargePackage.amount / 10 + ' تومانی',
        amount: {
          ...DEFAULTTRANSACTIONCARD.amount,
          value: payload.chargePackage.amount ? payload.chargePackage.amount.toString() : '',
        },
        image: {
          ...DEFAULTTRANSACTIONCARD.image,
          mode: 'single',
          type: 'logo',
          id: payload.imageId,
          badge: isUrgent ? 'error' : undefined,
        },
        buttonType: isUrgent ? 'urgent' : 'normal',
        showDivider: mode === 'details' ? false : index !== upcomingTransactions.length - 1,
        upcomingType: 'scheduled',
      };
      if (mode === 'summary') {
        return transactionCard;
      } else {
        return {
          ...transactionCard,
          exerciseDate: (t.payload as UpcomingScheduledPayload).nextRunDate,
        };
      }
    });
  }

  getPenaltyMessage(payload: UpcomingInstallmentPayload): string {
    let penalized = false;
    let minDaysToPenalized = 9999;
    const debt = payload.contractDebts;
    if (debt.penaltyAmount > 0) {
      penalized = true;
    }
    if (debt.daysToPenalized < minDaysToPenalized) {
      minDaysToPenalized = debt.daysToPenalized;
    }
    if (penalized) {
      return 'در حال جریمه';
    }
    if (minDaysToPenalized === 0) {
      return `آخرین روز بدون جریمه`;
    }
    if (minDaysToPenalized < 9999) {
      return `بدون جریمه تا ${minDaysToPenalized} روز`;
    }
    return '';
  }

  mapUpcomingInstallmentTransactionsToTransactionCards(upcomingTransactions: Payment[], mode = 'summary'): TransactionCard[] {
    return upcomingTransactions.map((t: Payment, index: number) => {
      const payload = t.payload as UpcomingInstallmentPayload;
      const isUrgent = payload.isOverdue;
      const penaltyMessage = this.getPenaltyMessage(payload);
      const transactionCard: TransactionCard = {
        ...DEFAULTTRANSACTIONCARD,
        type: 'upcoming',
        title: this.createInstallmentTitle(payload),
        amount: { ...DEFAULTTRANSACTIONCARD.amount, value: payload.contractDebts.totalAmount.toString() },
        status: isUrgent
          ? { message: penaltyMessage, style: 'error' }
          : {
              message: payload.contractDebts.effectiveDate ? payload.contractDebts.effectiveDate.toString() : '',
              style: 'default',
            },
        image: {
          ...DEFAULTTRANSACTIONCARD.image,
          mode: 'single',
          type: 'icon',
          icon: { icon: 'Calendar', iconSize: '24', iconType: 'linear', classes: 'text-onback-brand' },
          badge: isUrgent ? 'error' : undefined,
        },
        buttonType: isUrgent ? 'urgent' : 'normal',
        showDivider: mode === 'details' ? false : index !== upcomingTransactions.length - 1,
        upcomingType: 'installment',
        creditId: payload.creditId,
        payload,
      };
      if (mode === 'summary') {
        return transactionCard;
      } else {
        return {
          ...transactionCard,
          exerciseDate: payload.contractDebts.effectiveDate,
        };
      }
    });
  }

  mapUpcomingBillTransactionsToTransactionCards(upcomingTransactions: BillPayment[], mode = 'summary'): TransactionCard[] {
    return upcomingTransactions.map((t: BillPayment, index: number) => {
      const payload = t.payload.billInfo;
      const isUrgent = false;
      const penaltyMessage = payload.payExpirationDate ?? '';
      const transactionCard: TransactionCard = {
        ...DEFAULTTRANSACTIONCARD,
        type: 'upcoming',
        title: payload.name,
        amount: { ...DEFAULTTRANSACTIONCARD.amount, value: payload.amount.toString() },
        status: isUrgent
          ? { message: penaltyMessage, style: 'error' }
          : {
              message: payload.payExpirationDate ? payload.payExpirationDate.toString() : '',
              style: 'default',
            },
        image: {
          ...DEFAULTTRANSACTIONCARD.image,
          mode: 'single',
          type: 'logo',
          id: payload.imageId,
          badge: isUrgent ? 'error' : undefined,
        },
        buttonType: isUrgent ? 'urgent' : 'normal',
        showDivider: mode === 'details' ? false : index !== upcomingTransactions.length - 1,
        upcomingType: 'bill',
        payload: t,
      };
      return transactionCard;
    });
  }

  mapPendingTransactionsToTransactionCards(pendingTransactions: PendingTransaction[]): TransactionCard[] {
    return pendingTransactions.map((t: PendingTransaction, index: number) => {
      const transactionCard: TransactionCard = {
        ...DEFAULTTRANSACTIONCARD,
        type: 'pending',
        title: t.name,
        amount: {
          ...DEFAULTTRANSACTIONCARD.amount,
          amountStyle: 'dense',
          value: t.amount.toString(),
        },
        status: { message: t.description, style: 'default' },
        image: { ...DEFAULTTRANSACTIONCARD.image, mode: 'single', type: 'logo', id: t.imageId, badge: 'pending' },
        showDivider: index !== pendingTransactions.length - 1,
      };
      return transactionCard;
    });
  }

  mapPastTransactionsToTransactionCards(pendingTransactions: Array<TransactionInterface>): TransactionCard[] {
    return pendingTransactions.map((t: TransactionInterface, index: number) => {
      const transactionCard: TransactionCard = {
        ...DEFAULTTRANSACTIONCARD,
        type: 'history',
        date: t.exerciseDate,
        title: t.mainTitle ?? t.name ?? '',
        description: t.secondaryTitle ?? '',
        amount: {
          ...DEFAULTTRANSACTIONCARD.amount,
          amountStyle: t.status == 0 ? (t.ownerSide === 1 ? 'income' : 'dense') : 'dense',
          value: t.amount?.toString() ?? '0',
        },
        status: { message: t.description ?? '', style: 'default' },
        image: {
          ...DEFAULTTRANSACTIONCARD.image,
          mode: 'single',
          type: 'logo',
          id: t.imageId,
          badge: t.status == 0 ? (t.ownerSide === 1 ? 'add' : undefined) : 'error',
        },
        showDivider: index !== pendingTransactions.length - 1,
        id: t.uid,
        trackingCode: t.trackingCode ?? '',
      };
      return transactionCard;
    });
  }

  createInstallmentTitle(data: UpcomingInstallmentPayload): string {
    if (data.serviceType === SERVICE_TYPE.BNPL) {
      return 'بدهی خرید اعتباری';
    }
    if (data.fundProviderTitle) {
      return `قسط وام ${data.fundProviderTitle}`;
    }
    return 'قسط وام';
  }
}

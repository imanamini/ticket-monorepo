import { inject, Injectable, signal } from '@angular/core';
import { SERVICE_TYPE, TransactionsApiService } from '@client-monorepo/payment/transactions';
import { map, Observable } from 'rxjs';
import { INSTALLMENT_WIDGET_STATES } from '../consts/installment-widget-states.const';
import moment from 'jalali-moment';
import { InstallmentDisplayData, InstallmentPayment } from '../models/installment-display-data';

@Injectable({ providedIn: 'root' })
export class InstallmentWidgetDataService {
  private readonly transactionsApiService = inject(TransactionsApiService);
  penaltyMode = signal<boolean>(false);

  getInstallmentData(noCache = false): Observable<InstallmentDisplayData | null> {
    return this.transactionsApiService
      .getUpcomingInstallmentTransactions(noCache)
      .pipe(map((response) => this.transformToDisplayData(response.paymentList as InstallmentPayment[])));
  }

  private transformToDisplayData(items: InstallmentPayment[]): InstallmentDisplayData | null {
    if (!items?.length) {
      return null;
    }

    // Cache penalty check result to avoid multiple iterations
    const hasPenalty = this.checkHasPenalty(items);
    this.penaltyMode.set(hasPenalty);
    const bnplInstallments = items.filter((item) => item.payload.serviceType === SERVICE_TYPE.BNPL);

    return {
      displayState: this.calculateDisplayState(items, hasPenalty),
      totalAmount: this.calculateTotalAmount(items),
      hasPenalty,
      bnplCount: bnplInstallments.length,
      creditCount: items.length - bnplInstallments.length,
      date: this.calculateDate(items),
      daysRemaining: this.calculateDaysRemaining(items),
      itemCount: items.length,
      items: items,
    };
  }

  private calculateDisplayState(items: InstallmentPayment[], hasPenalty: boolean): number {
    // Priority 1: Penalty active
    if (hasPenalty) {
      return INSTALLMENT_WIDGET_STATES.PENALTY_ACTIVE;
    }

    // Priority 2: Multiple items
    if (items.length > 1) {
      return INSTALLMENT_WIDGET_STATES.MULTIPLE_OVERDUE;
    }

    // Priority 3: Single item logic
    if (items.length === 1) {
      return items[0].payload.isOverdue ? INSTALLMENT_WIDGET_STATES.UPCOMING_PENALTY : INSTALLMENT_WIDGET_STATES.OVERDUE;
    }

    return INSTALLMENT_WIDGET_STATES.OVERDUE;
  }

  private calculateTotalAmount(items: InstallmentPayment[]): number {
    return items.reduce((sum, item) => sum + item.payload.contractDebts.totalAmount, 0);
  }

  private checkHasPenalty(items: InstallmentPayment[]): boolean {
    return items.some((item) => item.payload.contractDebts.penaltyAmount > 0);
  }

  calculateDate(items: InstallmentPayment[]): string | null {
    if (items.length === 0) return null;

    let date = items[0]?.payload?.contractDebts?.effectiveDate?.toString() || null;
    // Create "effectiveDate" for items which have no date and are bnpl = fist day of next month
    if (items[0].payload.serviceType === SERVICE_TYPE.BNPL && !date) {
      date = moment().add(1, 'jMonth').startOf('jMonth').valueOf().toString();
    }
    return date;
  }

  private calculateDaysRemaining(items: InstallmentPayment[]): number {
    if (items.length === 1) {
      return items[0].payload.contractDebts.daysToPenalized;
    }
    return 0;
  }
}

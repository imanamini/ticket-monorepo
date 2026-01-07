import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RefundResult, SubscriptionRefund } from '@client-monorepo/common/subscription';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionRefundService {
  refundResult = new BehaviorSubject<RefundResult | null>(null);

  refundData = new BehaviorSubject<SubscriptionRefund | null>(null);

  setRefundData(data: SubscriptionRefund): void {
    this.refundData.next(data);
  }

  setRefundResult(result: RefundResult): void {
    this.refundResult.next(result);
  }
}

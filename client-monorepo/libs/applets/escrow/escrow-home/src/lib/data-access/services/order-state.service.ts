import { Injectable, signal } from '@angular/core';
import { ORDER_STATE } from '../enums/order-state.enum';

@Injectable({ providedIn: 'root' })
export class PendingOrderStateService {
  private currentPendingOrderStateSignal = signal<ORDER_STATE>(ORDER_STATE.VERIFIED);

  get currentPendingOrderState() {
    return this.currentPendingOrderStateSignal;
  }

  setPendingOrderState(state: ORDER_STATE) {
    this.currentPendingOrderStateSignal.set(state);
  }
}

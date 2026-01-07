import { Injectable, signal } from '@angular/core';
import { ORDER_STATE } from '../enums/order-state.enum';

@Injectable({ providedIn: 'root' })
export class OrderStateService {
  private currentOrderStatesSignal = signal<ORDER_STATE[]>([ORDER_STATE.DELIVER_IN_PROGRESS]);
  private currentRoleSignal = signal<string>('buyer');

  get currentOrderState() {
    return this.currentOrderStatesSignal;
  }

  setOrderState(states: ORDER_STATE[]) {
    this.currentOrderStatesSignal.set(states);
  }

  get currentRole() {
    return this.currentRoleSignal;
  }

  setCurrentRole(role: string) {
    this.currentRoleSignal.set(role);
  }
}

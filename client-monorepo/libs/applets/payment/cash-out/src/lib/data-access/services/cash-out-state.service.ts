import { Injectable } from '@angular/core';
import { CASH_OUT_STORAGE_KEY, CashOutAction, CashOutState } from '../models/cash-out-state.model';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CashOutStateService {
  private readonly initialState: CashOutState = this.loadState();
  private readonly stateSubject = new BehaviorSubject<CashOutState>(this.initialState);

  state$ = this.stateSubject.asObservable();

  getState(): CashOutState {
    return this.stateSubject.getValue();
  }

  // Dispatch an action to update the state
  dispatch(action: CashOutAction): void {
    const currentState = this.getState();
    const newState = { ...currentState };

    switch (action.type) {
      case 'UPDATE_AMOUNT':
        newState['amount'] = action.payload.amount;
        break;
      case 'UPDATE_WALLET_CONFIG':
        newState['walletConfig'] = action.payload;
        break;
      case 'UPDATE_CARD_INFO':
        newState['card'] = action.payload;
        break;
      case 'CLEAR_STORAGE':
        this.clearState();
        break;
      default:
        return;
    }

    this.stateSubject.next(newState);
    this.saveState(newState);
  }

  private loadState(): CashOutState {
    const state = localStorage.getItem(CASH_OUT_STORAGE_KEY);
    return state ? JSON.parse(state) : {};
  }

  private saveState(state: CashOutState): void {
    localStorage.setItem(CASH_OUT_STORAGE_KEY, JSON.stringify(state));
  }

  private clearState() {
    localStorage.removeItem(CASH_OUT_STORAGE_KEY);
  }
}

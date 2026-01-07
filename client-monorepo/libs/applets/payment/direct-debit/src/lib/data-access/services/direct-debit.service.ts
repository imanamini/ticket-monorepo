import { Injectable } from '@angular/core';
import { ContractCreateFormState, DIRECT_DEBIT_CREATE, DIRECT_DEBIT_ONBOARDING } from '../model/direct-debit.model';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DirectDebitService {
  private stateSubject = new BehaviorSubject<ContractCreateFormState>(this.loadState());
  state$ = this.stateSubject.asObservable();

  shouldShowOnboarding(): boolean {
    const stored = localStorage.getItem(DIRECT_DEBIT_ONBOARDING);
    return stored === null ? true : stored === 'true';
  }

  setShowOnboarding(value: boolean): void {
    localStorage.setItem(DIRECT_DEBIT_ONBOARDING, String(value));
  }

  toggleOnboarding(): void {
    const current = this.shouldShowOnboarding();
    this.setShowOnboarding(!current);
  }

  saveState(state: ContractCreateFormState) {
    sessionStorage.setItem(DIRECT_DEBIT_CREATE, JSON.stringify(state));
    this.stateSubject.next(state);
  }

  private loadState(): ContractCreateFormState {
    try {
      const raw = sessionStorage.getItem(DIRECT_DEBIT_CREATE);
      return raw ? JSON.parse(raw) : { validate: false, formValue: null };
    } catch (error) {
      return { validate: false, formValue: null };
    }
  }

  clearState() {
    sessionStorage.removeItem(DIRECT_DEBIT_CREATE);
    this.stateSubject.next({ validate: false, formValue: null });
  }

  getSnapshot(): ContractCreateFormState {
    return this.stateSubject.getValue();
  }
}

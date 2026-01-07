import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Rateable } from '../models/rateable.model';
import { Store } from '@client-monorepo/stores';

@Injectable({
  providedIn: 'root',
})
export class RateService {
  private ratables$ = new BehaviorSubject<Rateable[]>([]);
  private matchingRatable = new BehaviorSubject<Rateable | null>(null);
  private subs = new Subscription();

  public checkIfRateAvailable(store: Store | undefined): boolean {
    if (!store) {
      return false;
    }
    const ratables = this.ratables$.getValue();
    if (!ratables?.length) return false;
    const matchingRatable = ratables.find((ratable) => ratable.purchase.activityBusinessId === store.businessId);
    this.matchingRatable.next(matchingRatable ?? null);
    return !!matchingRatable;
  }

  public setRatables$(items: Rateable[]): void {
    this.ratables$.next(items);
  }

  public getRatables$(): Observable<Rateable[]> {
    return this.ratables$.asObservable();
  }

  public getCurrentRatable(): Rateable | null {
    return this.matchingRatable.getValue();
  }

  public destroy(): void {
    this.subs.unsubscribe();
  }
}

import { inject, Injectable, OnDestroy } from "@angular/core";
import { RouteStateInterface } from "../models/route-state.interface";
import { BehaviorSubject, Subscription } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class RouteStateService implements RouteStateInterface, OnDestroy {
  constructor() {
    this.startListening();
  }

  router = inject(Router);
  routerSub: Subscription = new Subscription();
  navState: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  getAll(): any {
    const state = window.history.state;
    if (!state) {
      return this.navState.getValue() || {};
    }

    return state;
  }

  startListening(): void {
    this.routerSub = this.router.events.subscribe({
      next: (event) => {
        this.navState.next(this.router.getCurrentNavigation()?.extras?.state);
      },
    });
  }

  getNavState(): any {
    return this.navState.getValue();
  }

  has(key: string): boolean {
    const state = this.getAll();
    return Object.prototype.hasOwnProperty.call(state, key);
  }

  get(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.has(key)) {
        reject(new Error(`Route state key "${key}" not found`));
        return;
      }

      resolve(this.getAll()[key]);
    });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}

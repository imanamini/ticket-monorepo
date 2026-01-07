import { Injectable } from '@angular/core';
import { CreditRouteStateInterface } from './credit-route-state.interface';

@Injectable()
export class CreditRouteStateService implements CreditRouteStateInterface {
  constructor() {
  }

  getAll(): any {
    const state = window.history.state;
    if (!state) {
      return {};
    }

    return state;
  }

  has(key: string): boolean {
    const state = this.getAll();
    return state.hasOwnProperty(key);
  }

  get(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.has(key)) {
        reject();
      }

      resolve(this.getAll()[key]);
    });
  }

}

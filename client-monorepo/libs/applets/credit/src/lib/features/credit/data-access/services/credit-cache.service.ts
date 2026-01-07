import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CreditCacheService {
  private store: any = {};

  has(key: string): boolean {
    return this.store.hasOwnProperty(key);
  }

  clean() {
    this.store = {};
  }

  remove(key: string) {
    delete this.store[key];
  }

  put(key: string, value: any): void {
    this.store[key] = value;
  }

  get(key: any, defaultValue = null): any {
    if (this.has(key)) {
      return this.store[key];
    }

    return defaultValue;
  }
}

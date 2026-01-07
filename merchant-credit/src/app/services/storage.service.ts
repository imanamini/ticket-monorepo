import { Injectable } from '@angular/core';
import { StorageSchema } from './models/storage-schema';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  key = '__storage_merchant_credit__';
  expiryDuration = 55 * 60 * 1000;

  store(schema: StorageSchema): void {
    localStorage.setItem(this.key, JSON.stringify(schema));
  }

  patch(schema: StorageSchema): void {
    const json = localStorage.getItem(this.key);
    let currentSchema = {};
    if (json) {
      currentSchema = JSON.parse(json);
    }
    const newSchema = Object.assign({}, currentSchema, schema);
    this.store(newSchema);
  }

  setTicket(ticket: string | undefined): void {
    this.store({
      ticket,
      ticketExpiryTime: this.expiryDuration + new Date().getTime()
    });
  }

  getTicket(): string | null {
    const ticket = this.get('ticket');
    const ticketExpiryTime = this.get('ticketExpiryTime');
    if (ticketExpiryTime < new Date().getTime()) {
      return null;
    }
    return ticket;
  }

  get(key: string, defaultValue: any = null): any {
    const json = localStorage.getItem(this.key);
    if (json) {
      const obj = JSON.parse(json);
      if (obj.hasOwnProperty(key)) {
        return obj[key];
      }
    }

    return defaultValue;
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }

}

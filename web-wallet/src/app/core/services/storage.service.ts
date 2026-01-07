import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {PaymentConfig} from '../../api/models/payment-config.response';
import {PERSISTENT_STORAGE_KEYS} from '../constants';

export interface StorageSchema {
  ticket?: string;
  config?: PaymentConfig;
  accessToken?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  data: BehaviorSubject<StorageSchema> = new BehaviorSubject({});

  key = '__storage_1';

  store(schema: StorageSchema) {
    localStorage.setItem(this.key, JSON.stringify(schema));
  }

  patch(schema: StorageSchema) {
    const json = localStorage.getItem(this.key);
    let currentSchema = {};
    if (json) {
      currentSchema = JSON.parse(json);
    }
    const newSchema = Object.assign({}, currentSchema, schema);
    this.store(newSchema);
  }

  put(value: StorageSchema) {
    this.data.next(value);
  }

  get(key: string) {
    const items = this.getAll();
    if (items.hasOwnProperty(key)) {
      return items[key];
    }
    return null;
  }

  getAll() {
    return this.data.getValue();
  }

  clear() {
    this.data.next({});
  }

  persist(key: PERSISTENT_STORAGE_KEYS, value: string) {
    localStorage.setItem(key, value);
  }

  getPersistantItem(key: PERSISTENT_STORAGE_KEYS): string | null {
    return localStorage.getItem(key);
  }

  persistJSon(key: PERSISTENT_STORAGE_KEYS, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getPersistantJsonItem(key: PERSISTENT_STORAGE_KEYS) {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    } else {
      return null;
    }
  }

  removePersistantItem(key: PERSISTENT_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }

  setAccessToken(value: string) {
    localStorage.setItem('AccessToken', value);
  }

  getAccessToken(): string {
    return localStorage.getItem('AccessToken');
  }
}

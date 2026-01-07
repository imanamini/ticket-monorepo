import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Redirect } from '../../api/purchase/redirect.model';

export interface StorageSchema {
  ticket?: string;
  cancelRedirect?: Redirect;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  data: BehaviorSubject<StorageSchema> = new BehaviorSubject({});

  set(value: StorageSchema) {
    // merge values
    const newValue = Object.assign({}, this.data.getValue(), value);
    this.data.next(newValue);
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
}

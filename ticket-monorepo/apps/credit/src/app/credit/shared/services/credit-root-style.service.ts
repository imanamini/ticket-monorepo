import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditRootStyleService {

  #backgroundColor = new BehaviorSubject<string>('');

  getBackgroundColor() {
    return this.#backgroundColor.asObservable();
  }

  setBackgroundColor(color: string) {
    this.#backgroundColor.next(color);
  }
}

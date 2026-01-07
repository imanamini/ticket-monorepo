import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DebugWindowService {
  logs: BehaviorSubject<string> = new BehaviorSubject('');

  log(...args) {
    args.forEach(arg => {
      let val = arg;
      if (typeof val === 'object') {
        val = JSON.stringify(val);
      }
      this.logs.next(val);
    });
  }
}

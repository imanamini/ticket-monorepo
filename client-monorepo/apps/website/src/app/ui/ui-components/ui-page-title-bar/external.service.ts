import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExternalService {
  hideTitle = new BehaviorSubject<boolean>(false);

  creditTitle = new Subject<string>();

  goBack = new EventEmitter();

  inApp = new BehaviorSubject<boolean>(false);
}

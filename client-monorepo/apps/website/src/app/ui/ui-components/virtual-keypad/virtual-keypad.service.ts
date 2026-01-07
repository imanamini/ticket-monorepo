import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VirtualKeypadService {
  /**
   *
   */
  open: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * Returns an observable
   */
  openned(): Observable<any> {
    return this.open.asObservable();
  }
}

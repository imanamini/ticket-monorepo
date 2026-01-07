import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RefreshNotifierService {
  refreshNotifier = new BehaviorSubject<boolean>(false);

  change(tf: boolean): void {
    this.refreshNotifier.next(tf);
  }
}

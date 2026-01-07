import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupportMessengerService {
  isVisible = new BehaviorSubject<boolean>(false);
  showFloatButton = signal(true);

  show() {
    this.isVisible.next(true);
  }

  hide() {
    this.isVisible.next(false);
  }

  toggleSupportMessenger(): void {
    if ((window as any).Goftino && (window as any).Goftino.toggle) {
      (window as any).Goftino.toggle();
    }
  }
}

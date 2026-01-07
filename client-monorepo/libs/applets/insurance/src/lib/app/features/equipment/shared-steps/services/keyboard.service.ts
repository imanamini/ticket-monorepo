import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  private keyboardVisibleSubject: Subject<boolean> = new Subject<boolean>();

  constructor(private zone: NgZone) {
    window.addEventListener('resize', () => {
      this.zone.run(() => {
        const isKeyboardVisible = this.isKeyboardVisible();
        this.keyboardVisibleSubject.next(isKeyboardVisible);
      });
    });
  }

  getKeyboardVisibility(): Observable<boolean> {
    return this.keyboardVisibleSubject;
  }

  private isKeyboardVisible(): boolean {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.clientHeight;
    const keyboardHeight = windowHeight - documentHeight;
    return keyboardHeight > 50; // Adjust the threshold as needed
  }
}

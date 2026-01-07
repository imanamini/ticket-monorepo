import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private menuOpen = signal(false);
  // Expose the signal as a read-only signal
  menuOpen$ = this.menuOpen.asReadonly();

  toggleMenu() {
    this.menuOpen.update((isOpen) => !isOpen);
  }
}

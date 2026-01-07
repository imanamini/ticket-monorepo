import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-credit-location-trap',
  standalone: true,
  template: ''
})
export class CreditLocationTrapComponent {
  canExit = input<boolean>(false);
  canBack = input<boolean>(false);

  exit = output<void>();
  back = output<void>();

  myTrapLocationAddress: string;

  constructor() {
    this.myTrapLocationAddress = window.location.href;
    window.history.pushState(null, '', this.myTrapLocationAddress);
  }

  @HostListener('window:beforeunload', ['$event'])
  private unloadNotification($event: any): void {
    this.exit.emit();

    if (!this.canExit()) {
      $event.preventDefault();
      $event.returnValue = true;
    }
  }

  @HostListener('window:popstate', ['$event'])
  private unPopNotification(): void {
    if (!this.canBack()) {
      Promise.resolve().then(() => {
        this.back.emit();
      });
      window.history.pushState(null, '', this.myTrapLocationAddress);
    } else {
      window.history.back();
    }
  }
}

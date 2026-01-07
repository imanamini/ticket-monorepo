import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'location-trap',
  template: '',
  standalone: true,
})
export class LocationTrapComponent {
  @Input() canExit: boolean;
  @Input() canBack: boolean;

  @Output() exit = new EventEmitter();
  @Output() back = new EventEmitter();

  myTrapLocationAddress: string;
  private isNavigatingBack = false;

  constructor() {
    this.myTrapLocationAddress = window.location.href;
    window.history.pushState(null, null, this.myTrapLocationAddress);
  }

  @HostListener('window:beforeunload', ['$event'])
  private unloadNotification($event: any): void {
    this.exit.emit();
    if (!this.canExit) {
      $event.returnValue = true;
    }
  }

  @HostListener('window:popstate', ['$event'])
  private unPopNotification($event: any): void {
    if (this.isNavigatingBack) {
      this.isNavigatingBack = false;
      return;
    }

    this.back.emit();
    if (!this.canBack) {
      window.history.pushState(null, null, this.myTrapLocationAddress);
    } else {
      this.isNavigatingBack = true;
      window.history.back();
    }
  }
}

import { EventEmitter, HostListener, Directive } from '@angular/core';

interface LocationTrapInterface {
  myTrapLocationAddress: string;
  exitTrap: EventEmitter<any>;
  backTrap: EventEmitter<any>;
  canExitTrap: boolean;
  canBackTrap: boolean;
}

@Directive()
export class LocationTrap implements LocationTrapInterface {
  myTrapLocationAddress: string;
  exitTrap = new EventEmitter();
  backTrap = new EventEmitter();
  canExitTrap = false;
  canBackTrap = false;

  constructor() {
    this.myTrapLocationAddress = window.location.href;
    window.history.pushState(null, null, this.myTrapLocationAddress);
  }

  @HostListener('window:beforeunload', ['$event'])
  private unloadNotification($event: any) {
    this.exitTrap.emit();
    if (!this.canExitTrap) {
      $event.returnValue = true;
    }
  }

  @HostListener('window:popstate', ['$event'])
  private unPopNotification($event: any) {
    if (!this.canBackTrap) {
      setTimeout(() => {
        this.backTrap.emit();
      }, 0);
      window.history.pushState(null, null, this.myTrapLocationAddress);
    } else {
      window.history.back();
    }
  }
}

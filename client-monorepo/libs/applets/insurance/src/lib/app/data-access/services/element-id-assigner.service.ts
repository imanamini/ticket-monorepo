import { Injectable } from '@angular/core';
import { replaceSlashesWithDash } from '../../util/strings';

@Injectable({
  providedIn: 'root'
})
export class ElementIdAssignerService {

  counter: number = 0;

  windowPathName: string = '';

  constructor() {
    this.windowPathName = window.location.pathname;
  }

  getId(): string {

    if (this.windowPathName !== window.location.pathname) {
      this.windowPathName = window.location.pathname;
      this.counter = 0;
    }
    this.counter++;
    let pathName = window.location.pathname;
    pathName = this.removeSubModuleUrl(pathName);
    pathName = replaceSlashesWithDash(pathName);
    return pathName + '-' + this.counter;
  }

  elementDestroyed(): void {
    if (this.counter <= 0) {
      return;
    }

    this.counter--;
  }

  removeSubModuleUrl(pathName: string): string {
    return pathName.replace('/mini-app/insurance/', '');
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WalletTransferBusService {

  tabIndex: number = 0;

  infoButton = true;

  clear() {
    this.infoButton = true;
    this.tabIndex = 0;
  }
}

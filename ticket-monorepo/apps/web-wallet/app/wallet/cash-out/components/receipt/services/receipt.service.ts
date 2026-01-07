import { Injectable } from '@angular/core';
import { ReceiptInterface } from '../models/receipt.interface';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  private state: ReceiptInterface;

  public getState(): ReceiptInterface {
    if (this.state) {
      return this.state;
    }
    return JSON.parse(sessionStorage.getItem('__receipt'));
  }

  public setState(newState: ReceiptInterface): void {
    this.state = newState;
    sessionStorage.setItem('__receipt', JSON.stringify(newState));
  }
}

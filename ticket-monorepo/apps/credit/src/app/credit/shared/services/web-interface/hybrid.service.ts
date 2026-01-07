import {Injectable} from '@angular/core';
import {AppWindow} from './app-window';

declare const window: AppWindow;

@Injectable({
  providedIn: 'root'
})
export class HybridService {

  constructor(
  ) {
  }

  public setOtpCode(): Promise<string> {
    return new Promise(resolve => {
      window.digipayHybridApp.setOtpCode = (otp: string) => {
        resolve(otp);
      };
      window.digipayHybridApp.getOtpCode();
    });
  }
}

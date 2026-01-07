import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AuthClient, SignalClient } from '@digipay/ng-payment';

@Injectable({
  providedIn: 'root',
})
export class WebViewService {
  constructor(@Inject(PLATFORM_ID) public platformId: string) {}

  isWebView(): boolean {
    if (this.platformId.toUpperCase() === 'SERVER') {
      return false;
    }
    return AuthClient.isSupported();
  }

  close() {
    SignalClient.close('website');
  }

  onSetAuthToken(setTokenCallback: (newToken: string) => void) {
    AuthClient.onSetAuthToken(setTokenCallback);
  }

  getToken() {
    AuthClient.getToken();
  }

  tokenExpired() {
    AuthClient.tokenExpired();
  }
}

import { Component, OnInit } from '@angular/core';
import { RedirectFormData, RedirectService } from '../../../core/services/redirect.service';
import { SignalClient } from '@digipay/ng-payment';
import { StorageService } from '../../../core/services/storage.service';
import { PERSISTENT_STORAGE_KEYS } from '../../../core/constants';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-direct-debit-callback',
  templateUrl: './direct-debit-callback.component.html'
})
export class DirectDebitCallbackComponent implements OnInit {

  constructor(
    private redirectService: RedirectService,
    private storageService: StorageService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    SignalClient.close('direct-debit');
    const redirectUrl = this.storageService.getPersistantItem(PERSISTENT_STORAGE_KEYS.CALLBACK_URL);

    // other pages of the application might send query params to this page
    // for returning to the merchant
    // a whitelist of supported keys are stored below, other keys will be ignored
    const keyWhitelist = ['providerId', 'status'];
    const queryParams = this.route.snapshot.queryParams;
    // make array of RedirectFormData using query params object
    const redirectData: RedirectFormData[] = [];
    Object.keys(queryParams).forEach(key => {
      if (keyWhitelist.indexOf(key) >= 0) {
        redirectData.push({
          key,
          value: queryParams[key]
        });
      }
    });

    if (redirectUrl) {
      this.redirectService.url.next(redirectUrl);
      this.redirectService.setAndRedirect(redirectData);
    }
  }
}

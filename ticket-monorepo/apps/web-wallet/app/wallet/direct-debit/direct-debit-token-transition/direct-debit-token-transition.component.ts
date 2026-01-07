import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthClient } from '@digipay/ng-payment';
import { AppWindow } from '../../../core/web-interface/app-window';
import { HttpHeaders } from '@angular/common/http';
import { WalletApiService } from '../../../api/wallet-api.service';
import { environment } from '../../../../environments/environment';
import { MessageService } from '../../../core/services/message.service';
import { DIGIPAY_GLOBAL_FUNCTIONS } from '../../../core/web-interface/digipay-js';
import { DebugWindowService } from '../../../user-interface/components/ui-debug-window/debug-window.service';
import { PERSISTENT_STORAGE_KEYS } from '../../../core/constants';
import { StorageService } from '../../../core/services/storage.service';

declare const window: AppWindow;

@Component({
  selector: 'app-direct-debit-token-transition',
  templateUrl: './direct-debit-token-transition.component.html'
})
export class DirectDebitTokenTransitionComponent implements OnInit {

  redirectUrl = null;

  retryCount = 3;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private wallet: WalletApiService,
    private storageService: StorageService,
    private messageService: MessageService,
    private debugWindowService: DebugWindowService,
  ) {
  }

  ngOnInit() {

    this.storageService.removePersistantItem(PERSISTENT_STORAGE_KEYS.CALLBACK_URL);

    window.digipay = Object.assign({}, DIGIPAY_GLOBAL_FUNCTIONS);

    // set redirectUrl
    this.redirectUrl = environment.app_base_url + '/direct-debit/callback';

    const queryParams = this.checkQueryParams();
    if (queryParams['redirectUrl']) {
      const regEx = new RegExp('^(http(s*):\\/\\/)[a-z]{1,}\\.(digikala.com|mydigipay.com|mydigipay.info)\\/');
      if (regEx.test(queryParams['redirectUrl'])) {
        this.redirectUrl = queryParams['redirectUrl'];
      }
    }
    if (queryParams['token']) {
      this.debugWindowService.log('token Is present in query params');
      this.tokenSetCallback(queryParams['token']);
    } else {
      this.communicationApproach();
    }
  }

  private communicationApproach() {
    this.debugWindowService.log('communicationApproach');

    const setTokenFunc = (newToken: string) => {
      this.debugWindowService.log('new token');
      this.debugWindowService.log(newToken);
      this.tokenSetCallback(newToken);
    };

    window.digipay.setAuthToken = setTokenFunc;

    AuthClient.onSetAuthToken((newToken: string) => {
      this.ngZone.run(() => {
        if (newToken) {
          setTokenFunc(newToken.trim());
        }
      });
    });

    this.debugWindowService.log('get token Called');
    // broadcast an event
    AuthClient.getToken();
  }

  private checkQueryParams() {
    return this.route.snapshot.queryParams;
  }

  private tokenSetCallback(token: string) {
    if (this.retryCount > 0) {
      this.retryCount--;
      this.storageService.persist(PERSISTENT_STORAGE_KEYS.CALLBACK_URL, this.redirectUrl);
      this.wallet.createDirectDebitsTicket({redirectUrl: this.redirectUrl}, {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + token),
      }).subscribe(response => {
        this.router.navigateByUrl('/direct-debit/management/' + response.ticket).then();
      }, (e) => {
        if (this.retryCount === 0) {
          this.messageService.showErrorIfExists(e);
        }
        this.tokenSetCallback(token);
      });
    } else {
      setTimeout(() => {
        this.router.navigateByUrl('/direct-debit/callback').then();
      }, 3000);
    }
  }
}

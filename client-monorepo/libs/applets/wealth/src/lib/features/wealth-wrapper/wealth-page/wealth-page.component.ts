import { AfterViewInit, Component, inject, Inject, NgZone, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, switchMap, timer } from 'rxjs';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { UpdateVersionService } from '../../../shared/update-version.service';
import { EnterPasswordService } from '../../../shared/components/enter-password/enter-password.service';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { MaknaAuthenticationService } from '../../makna-authentication/services/makna-authentication.service';
import { IDGPTokenModel } from '../../../data-access/models/base/dgp-token.model';
import { AUTH_TOKEN_KEY, WEALTH_TOKEN } from '../../../components/utils/variables';
import { TokenModel } from '../../../data-access/models/base/token.model';
import { checkWealthOrigin } from '../../../components/utils/check-wealth-origin';
import { LOGIN_ROUTE } from '../../../data-access/constants/app-routes';
import { AuthClient, DigipayJsInterface } from '@digipay/ng-payment';
import { AppWindow } from '@client-monorepo/common/utilities';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { EnterPasswordComponent } from '../../../shared/components/enter-password/enter-password.component';
import { environment } from '../../../data-access/environments/environment';
import { DPXUserIdService } from '../../../shared/services/dpx-user-id.service';
import { AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { WalletService } from '../../wallet/services/wallet.service';

declare const window: AppWindow;

@Component({
  selector: 'app-wealth-page',
  templateUrl: './wealth-page.component.html',
  styleUrls: ['./wealth-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [EnterPasswordComponent, RouterOutlet, AsyncPipe, SpinnerComponent],
})
export class WealthPageComponent implements OnInit, AfterViewInit, OnDestroy {
  shouldEnterPassword: Observable<boolean> = new Observable<boolean>();

  isInit = false;

  agent: 'native' | 'pwa' | 'express' | 'wealth' | 'local';
  wealthTokenExist = false;
  isWaitingForUpdate = true;
  navigationService = inject(WealthNavigationService);
  walletService = inject(WalletService);

  constructor(
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private updateVersionService: UpdateVersionService,
    private enterPasswordService: EnterPasswordService,
    private hybridService: NgxHybridServiceService,
    private maknaAuthenticationService: MaknaAuthenticationService,
    private dpxUserIdService: DPXUserIdService,
    @Inject('WEALTH_ENV') private environment: { [key: string]: string },
  ) {
    this.shouldEnterPassword = this.enterPasswordService.enterPassword;
  }

  ngOnInit(): void {
    // backward compatible approach
    // for supporting old applications which
    // sent token as a query paramete
    const userId = localStorage.getItem('userId');
    if ((!userId || userId === 'null') && checkWealthOrigin() != 'wealth') {
      this.dpxUserIdService.getUserProfile().subscribe(() => {
        this.getData();
      });
    } else {
      this.getData();
    }

    if (checkWealthOrigin() === 'wealth') {
      this.checkSessionHealth();
    }
  }

  private checkSessionHealth(): void {
    timer(0, 60000)
      .pipe(switchMap(() => this.maknaAuthenticationService.checkSessionHealth()))
      .subscribe();
  }

  private getData() {
    this._checkForUpdate();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      document.getElementById('nativeSplash')?.remove();
    }, 3000);
    setTimeout(() => {
      document.getElementById('splash_bg')?.remove();
    }, 500);
  }

  ngOnDestroy(): void {
    this.walletService.stopGoldPricingTimer();
  }

  private async _checkForUpdate() {
    await Promise.race([this.updateVersionService.checkUpdate(), this.updateCheckTimeout()]).then(() => {
      this.isWaitingForUpdate = false;
      setTimeout(() => {
        const userId = localStorage.getItem('userId');
        const dgpToken: IDGPTokenModel = JSON.parse(localStorage.getItem(AUTH_TOKEN_KEY));
        const wealthToken: TokenModel = JSON.parse(localStorage.getItem(WEALTH_TOKEN));
        const origin = checkWealthOrigin();
        if (origin === 'dgp' || origin === 'localhost') {
          if (dgpToken?.auth?.access) {
            if (!wealthToken?.accessToken || wealthToken?.externalUserId !== userId) {
              if (wealthToken?.externalUserId !== userId) localStorage.removeItem(WEALTH_TOKEN);
              this.maknaAuthenticationService.loginDGP().subscribe({
                next: (res) => {
                  if (res?.success) {
                    this.wealthTokenExist = true;
                    if (res.result.requiresPassword) {
                      const redirectUrl =
                        this?.navigationService?.getCurrentUrl() !== '/'
                          ? this?.navigationService?.getCurrentUrl()
                          : environment.afterLoginUrl;
                      if (!redirectUrl.includes('/login')) localStorage.setItem('redirectUrl', redirectUrl);

                      const queryParams = this.activatedRoute.snapshot.queryParams;

                      this.navigationService.navigateWithQueryParams([LOGIN_ROUTE], { queryParams });
                    }
                  } else {
                    sessionStorage.setItem('redirectUrlAfterLogin', window.location.href);
                    window.open(environment.supperAppLoginUrl, '_self');
                  }
                },
                error: (err: HttpErrorResponse) => {
                  if (err?.status === HttpStatusCode.Unauthorized) {
                    this.wealthTokenExist = true;
                  }
                },
              });
            } else {
              this.wealthTokenExist = true;
            }
          } else {
            if (origin === 'localhost') return;
            sessionStorage.setItem('redirectUrlAfterLogin', window.location.href);
            window.open(window.location.origin, '_self');
          }
        } else {
          this.wealthTokenExist = true;
        }
        const redirectURLInQueryParams = this.activatedRoute.snapshot.queryParamMap.get('redirectUrl');

        const supportDetail = AuthClient.getSupportDetails();
        if (redirectURLInQueryParams?.includes('app.mydigipay.') || redirectURLInQueryParams?.includes('express.mydigipay.')) {
          localStorage.setItem('redirectUrl', redirectURLInQueryParams);
        }
        if (supportDetail['isAndroid'] || supportDetail['isIos']) {
          this.agent = 'native';
        } else if (localStorage.getItem('redirectUrl') && localStorage.getItem('redirectUrl').includes('app.mydigipay.')) {
          this.agent = 'pwa';
        } else if (checkWealthOrigin() === 'dgp') {
          this.agent = 'pwa';
        } else if (window.location.origin.includes('localhost')) {
          this.agent = 'local';
        } else if (checkWealthOrigin() === 'wealth') {
          this.agent = 'wealth';
        } else {
          this.agent = 'express';
        }
        localStorage.setItem('CLIENT_AGENT', this.agent);
        if (this.agent === 'pwa' || this.agent === 'local' || this.agent === 'wealth') {
          this.tokenSetCallback();
          return;
        }
        const tokenInQueryParams = this.activatedRoute.snapshot.queryParamMap.get('token');

        if (tokenInQueryParams && !localStorage.getItem(AUTH_TOKEN_KEY)) {
          localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify({ auth: { access: tokenInQueryParams } }));
          this.tokenSetCallback();
        } else if (this.agent === 'native') {
          // token is not present in the query params
          // probably it's a client with a new application
          if (this.hybridService.isHybrid()) {
            this.tokenSetCallback();
            return;
          } else {
            this.communicationApproach();
            return;
          }
        }
        this.tokenSetCallback();
      }, 100);
    });
  }

  private updateCheckTimeout(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(true), 7 * 1000);
    });
  }

  private communicationApproach(): void {
    const setTokenFunc = (newToken: string) => {
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify({ auth: { access: newToken } }));
      this.tokenSetCallback();
    };

    if (!window.digipay) {
      window.digipay = {} as DigipayJsInterface;
    }
    window.digipay.setAuthToken = setTokenFunc;

    AuthClient.onSetAuthToken((newToken: string) => {
      this.ngZone.run(() => {
        if (newToken) {
          setTokenFunc(newToken.trim());
        }
      });
    });

    // broadcast an event
    AuthClient.getToken();
  }

  private tokenSetCallback(): void {
    this.isInit = true;
  }
}

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '@client-monorepo/common/utilities';
import { UserApiService } from '@client-monorepo/common/user';
import { map, Observable, of } from 'rxjs';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';

@Component({
  selector: 'auth-applet-trusted-login',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './trusted-login.component.html',
  styleUrl: './trusted-login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrustedLoginComponent implements OnInit {
  route = inject(ActivatedRoute);
  storageService = inject(StorageService);
  userApiService = inject(UserApiService);
  actionHandlerService = inject(ActionHandlerService);
  router = inject(Router);

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;
    if (queryParams['token']) {
      const token = queryParams['token'];
      this.checkLogin(token).subscribe({
        next: (res) => {
          if (res) {
            this.init();
            return;
          }
          this.exit();
        },
        error: () => {
          this.exit();
        },
      });
    } else {
      this.exit();
    }
  }

  checkLogin(token: string): Observable<boolean> {
    if (this.storageService.getRefreshToken()) {
      return of(true);
    }
    this.storageService.updateAuth({
      accessToken: token,
      expireIn: +new Date() + 1000 * 60 * 60 * 24,
      refreshToken: '',
      userId: '',
      tokenType: 'express',
    });
    return this.userApiService.getProfile().pipe(
      map((profile) => {
        this.storageService.updateAuth({
          accessToken: token,
          expireIn: +new Date() + 1000 * 60 * 60 * 24,
          refreshToken: '',
          userId: profile.userId,
          tokenType: 'express',
        });
        return true;
      }),
    );
  }

  init() {
    const queryParams = this.route.snapshot.queryParams;
    const inApp = queryParams['inapp'];
    const data = queryParams['data'];
    const callbackUrl = queryParams['callbackUrl'];
    const trackingCode = queryParams['trackingCode'];
    const action = queryParams['action'];
    if (inApp) {
      this.setInApp(inApp);
    }
    if (action) {
      this.handleAction(action);
      return;
    }
    if (callbackUrl) {
      this.handlePaymentCallBack(callbackUrl, data, trackingCode);
      return;
    }
    this.router.navigate(['/']).then();
  }

  setInApp(inApp: string) {
    localStorage.setItem('in-app', inApp);
  }

  handleAction(action: string) {
    this.actionHandlerService
      .handle({
        type: ActionType.OLD_ACTION,
        payload: { action: +action },
      })
      .then();
  }

  private handlePaymentCallBack(callbackUrl: string, data?: string, trackingCode?: string) {
    this.router.navigate([callbackUrl], {
      queryParams: {
        data,
        trackingCode,
      },
    });
  }

  exit() {
    this.router.navigate(['/auth/login']);
  }
}

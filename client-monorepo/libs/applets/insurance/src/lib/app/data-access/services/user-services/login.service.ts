import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedUserSourceService } from './shared-user-source.service';
import { LoginDataService } from './login-data.service';
import { NavigationService } from '../navigation.service';
import { InsDigikalaService } from '../ins-digikala.service';
import { AppNameService, STORAGE_KEY } from '@client-monorepo/common/utilities';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private sharedUserSourceService = inject(SharedUserSourceService);
  private loginDataService = inject(LoginDataService);
  private navigationService = inject(NavigationService);
  private digikalaService = inject(InsDigikalaService);
  private appNameService = inject(AppNameService);

  public isLoggedIn$: Observable<boolean> = this.sharedUserSourceService.isLoggedInSource.asObservable();

  public set isLoggedIn(value: boolean) {
    this.sharedUserSourceService.isLoggedInSource.next(value);
  }

  public get isLoggedIn(): boolean {
    return this.sharedUserSourceService.isLoggedInSource.getValue();
  }

  clearAfterLoginData(): void {
    this.loginDataService.removeAfterLoginData();
    this.sharedUserSourceService.afterLoginData.next({
      url: '',
      queryParams: {},
      fragment: '',
    });
  }

  routeToLoginPage(redirectUrlAfterLogin?: string): void {
    if (this.appNameService.isPillar()) {
      if (this.digikalaService.isDigikalaSuperApp) {
        this.digikalaService.login();
      } else if (this.digikalaService.webDigikala.isDgkSuperWebUser) {
        this.digikalaService.webDigikala.goToSsoDigikala();
      }
      return;
    }
    this.setRedirectUrlAfterLogin(redirectUrlAfterLogin);
    this.navigationService.replace(['/auth/login']).then();
  }

  setRedirectUrlAfterLogin(url?: string): void {
    window.sessionStorage.setItem(STORAGE_KEY.REDIRECT_URL_AFTER_LOGIN, url ?? window.location.href.replace(window.location.origin, ''));
  }

}

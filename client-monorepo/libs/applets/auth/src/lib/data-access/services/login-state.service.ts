import { inject, Injectable, signal } from '@angular/core';
import { LoginState } from '../models/login-state.enum';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { EmitterService, EmittingDataEnum, StorageService } from '@client-monorepo/common/utilities';
import { ActionHandlerService, ActionType, RedirectionTypeEnum } from '@client-monorepo/common/action-handler';

@Injectable({
  providedIn: 'root',
})
export class LoginStateService {
  router = inject(Router);
  storageService = inject(StorageService);
  actionHandlerService = inject(ActionHandlerService);
  phoneNumber = signal<string>('');
  userId = signal<string>('');
  isAutofill = signal<boolean>(false);
  presentativeCode = signal<string>('');
  isRetry = signal(false);
  state = signal<LoginState>(LoginState.PHONENUMBER);
  private emitterService = inject(EmitterService);

  public beforeLoginData = new BehaviorSubject<{
    url: string;
    queryParams: any;
  }>({ url: '', queryParams: {} });
  private defaultRoute: string[] = ['auth', 'premium-services'];

  initializeDefaultRoute(route: string[] = ['auth', 'premium-services']): void {
    this.defaultRoute = route;
  }

  goToState(state: LoginState) {
    this.state.set(state);
  }

  redirectAfterLogin(): void {
    const redirectionUrl = this.storageService.getRedirectUrlAfterLogin();
    if (redirectionUrl) {
      this.storageService.removeRedirectUrlAfterLogin();
      this.actionHandlerService.handle({
        type: ActionType.REDIRECT,
        payload: {
          url: redirectionUrl,
          type: RedirectionTypeEnum.self,
        },
      });
      this.emitterService.emitEvent(EmittingDataEnum.USER_HAS_LOGGED_IN);
      return;
    }
    const routeValue = this.storageService.getBeforeLoginRoute();
    if (!routeValue || routeValue?.url === '') {
      this.router.navigate(this.defaultRoute).then();
      this.emitterService.emitEvent(EmittingDataEnum.USER_HAS_LOGGED_IN);
      return;
    }
    this.router
      .navigate([routeValue?.url], {
        queryParams: routeValue?.queryParams,
      })
      .then(() => {
        this.emitterService.emitEvent(EmittingDataEnum.USER_HAS_LOGGED_IN);
      });
  }
}

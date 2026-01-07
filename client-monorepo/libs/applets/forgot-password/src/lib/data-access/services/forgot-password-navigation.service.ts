import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '@client-monorepo/common/utilities';
import { ActionHandlerService, ActionType, RedirectionTypeEnum } from '@client-monorepo/common/action-handler';
import { PIN_VALIDITY_PERIOD } from '../consts/pin-validity-period';

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordNavigationService {
  route = inject(ActivatedRoute);
  router = inject(Router);
  storageService = inject(StorageService);
  actionHandlerService = inject(ActionHandlerService);

  setNavigationParams(): void {
    const callbackUrl = this.route.snapshot.queryParamMap.get('callback-url') || '';
    const fallbackUrl = this.route.snapshot.queryParamMap.get('fallback-url') || '';
    const navByReload = this.route.snapshot.queryParamMap.get('nav-by-reload');
    if (callbackUrl || fallbackUrl) {
      this.storageService.setForgetPasswordStorage({
        callbackUrl: callbackUrl || '',
        fallbackUrl: fallbackUrl || '',
        navByReload: navByReload || '',
        callbackExpTime: '' + (+new Date() + 1000 * (PIN_VALIDITY_PERIOD + 60)),
      });
    }
  }

  public exit(result?: 'success' | 'failed'): void {
    const forgetPasswordStorage = this.storageService.getForgetPasswordStorage();
    const callbackUrl = forgetPasswordStorage?.callbackUrl;
    const fallbackUrl = forgetPasswordStorage?.fallbackUrl;
    const navByReload = forgetPasswordStorage?.navByReload;
    this.storageService.removeForgetPasswordStorage();
    if (result === 'failed' && fallbackUrl) {
      this.redirectWithParams(fallbackUrl, result, navByReload);
      return;
    }
    if (callbackUrl) {
      this.redirectWithParams(callbackUrl, result, navByReload);
      return;
    }
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  private redirectWithParams(url: string, result: 'success' | 'failed' = 'failed', navByReload?: string) {
    this.actionHandlerService
      .handle({
        type: ActionType.REDIRECT,
        payload: {
          url,
          type: RedirectionTypeEnum.self,
          replaceUrl: true,
        },
      })
      .then(() => {
        if (result === 'failed' && navByReload) {
          window.location.reload();
        }
      });
  }
}

import { Inject, inject, Injectable } from '@angular/core';
import { AuthResponse } from '@client-monorepo/common/user';
import { DigikalaStorageService } from './digikala-storage.service';
import { DigikalaService } from './digikala.service';
import { DeviceInfoService, MessageService } from '@client-monorepo/common/utilities';
import { DigikalaLoginInterface } from '../models/digikala-login.interface';
import { MemoryCacheService } from '@digipay/ng-lib-memory-cache';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { firstValueFrom } from 'rxjs';
import { DigikalaAuthErrorService } from './digikala-auth-error.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as Sentry from '@sentry/angular-ivy';
import { DigikalaSuperWebService, IAppEnv } from '@client-monorepo/pillar/digikala';

@Injectable({
  providedIn: 'root',
})
export class AuthDigikalaService {
  private readonly storageService = inject(DigikalaStorageService);
  private readonly digikalaService = inject(DigikalaService);
  private readonly digikalaSuperWebService = inject(DigikalaSuperWebService);
  private readonly deviceInfoService = inject(DeviceInfoService);
  private readonly cache = inject(MemoryCacheService);
  private readonly apiService = inject(ApiService);
  private readonly authErrorService = inject(DigikalaAuthErrorService);
  private messageService = inject(MessageService);

  constructor(@Inject('APP_ENV') private readonly environment: IAppEnv) {}

  public async loginDigiPayToDigikala(saToken: string): Promise<AuthResponse> {
    try {
      const device = await this.deviceInfoService.getDeviceInfo();
      const body: DigikalaLoginInterface = {
        device: {
          deviceId: device.deviceId,
          deviceModel: device.deviceModel,
          deviceAPI: device.deviceAPI,
          osName: device.osName,
        },
        token: saToken,
      };
      const request = new RequestBuilder(RequestTypeEnum.POST, 'auth/idp', body);
      const header = { Authorization: 'Basic ' + this.environment.digikala!.basic_token };
      request.setHeader(header);

      return await firstValueFrom(this.apiService.callWithoutInterceptor<AuthResponse>(request));
    } catch (error) {
      this.handleIdpError(error);
      throw error;
    }
  }

  public initialLoginDigiPayToDigikala(): Promise<void> {
    return new Promise((resolve, reject) => {
      let saToken: string | null | any = '';
      if (this.digikalaSuperWebService.isDgkSuperWebUser) {
        saToken = this.digikalaSuperWebService.saTokenDGK;
      } else if (this.digikalaService.isDigikalaSuperApp) {
        saToken = this.digikalaService.getSuperAppToken();
      }

      // Defensive: Ensure saToken is actually a string or null, not boolean or other unexpected types
      if (typeof saToken !== 'string' && saToken !== null) {
        const error = new Error(`Unexpected token type: ${typeof saToken} with value: ${String(saToken)}`);
        Sentry.captureException(error, {
          tags: { component: 'AuthDigikalaService', issue: 'unexpected_token_type' },
          extra: { tokenType: typeof saToken, tokenValue: saToken },
        });
        reject(error);
        return;
      }

      if (!saToken) {
        const error = new Error('Super App Token is not available');
        reject(error);
      } else if (saToken) {
        this.loginDigiPayToDigikala(saToken)
          .then((res) => {
            this.authErrorService.clearAuthError();
            this.storageService.updateAuth(res);
            this.cache.clean();
            resolve();
          })
          .catch((error) => {
            // Save auth error for login component to check
            if (error instanceof HttpErrorResponse) {
              this.authErrorService.setAuthError(error);

              // Check if it's the "has password" error (401 with status 2001 or 2002)
              if (error.status === 401 && (error.error?.result?.status === 2001 || error.error?.result?.status === 2002)) {
                // Log to Sentry with specific context for password authentication requirement
                console.error('PIN required');
                this.handleIdpError(error, 'password_required', false);
                reject(error);
                return;
              }
            }

            // Handle all other errors
            this.handleIdpError(error);
            reject(error);
          });
      } else {
        // This should never happen, but handle it gracefully
        const error = new Error('Invalid token state - token is neither truthy nor falsy');
        reject(error);
      }
    });
  }

  /**
   * Handle IDP authentication errors with toast messages and Sentry logging
   */
  private handleIdpError(error: unknown, errorType?: string, showToast = true): void {
    let errorMessage = 'خطا در احراز هویت. لطفاً دوباره تلاش کنید.';
    let sentryLevel: Sentry.SeverityLevel = 'error';
    const sentryContext: Record<string, any> = {
      endpoint: '/auth/idp',
      errorType: errorType || 'unknown',
    };

    if (error instanceof HttpErrorResponse) {
      const status = error.status;
      const errorCode = error.error?.result?.status;

      sentryContext['httpStatus'] = status;
      sentryContext['errorCode'] = errorCode;
      sentryContext['errorResponse'] = error.error;

      // Customize error messages based on status code
      switch (status) {
        case 401:
          if (errorCode === 2001) {
            showToast = false;
            sentryLevel = 'error';
            sentryContext['reason'] = 'User has password - requires password authentication';
          } else {
            errorMessage = 'احراز هویت ناموفق بود. لطفاً دوباره تلاش کنید.';
            sentryContext['reason'] = 'Unauthorized authentication attempt';
          }
          break;
        case 403:
          errorMessage = 'دسترسی غیرمجاز. لطفاً با پشتیبانی تماس بگیرید.';
          sentryContext['reason'] = 'Forbidden access';
          break;
        case 404:
          errorMessage = 'سرویس احراز هویت در دسترس نیست.';
          sentryContext['reason'] = 'IDP endpoint not found';
          break;
        case 429:
          errorMessage = 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید.';
          sentryContext['reason'] = 'Rate limit exceeded';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          errorMessage = 'خطای سرور. لطفاً چند لحظه دیگر تلاش کنید.';
          sentryContext['reason'] = 'Server error';
          break;
        case 0:
          errorMessage = 'خطا در برقراری ارتباط. لطفاً اتصال اینترنت خود را بررسی کنید.';
          sentryContext['reason'] = 'Network error - no response';
          break;
        default:
          errorMessage = `خطای احراز هویت (کد ${status}). لطفاً دوباره تلاش کنید.`;
          sentryContext['reason'] = `Unknown HTTP error with status ${status}`;
      }
    } else if (error instanceof Error) {
      sentryContext['errorMessage'] = error.message;
      sentryContext['errorStack'] = error.stack;

      if (errorType === 'missing_token') {
        errorMessage = 'اطلاعات احراز هویت یافت نشد. لطفاً دوباره وارد شوید.';
        sentryContext['reason'] = 'Super App Token missing';
      }
    }

    // Show toast message if enabled
    if (showToast) {
      this.messageService.showErrorMessage(errorMessage);
    }

    // Send to Sentry
    Sentry.captureException(error, {
      level: sentryLevel,
      tags: {
        component: 'AuthDigikalaService',
        endpoint: '/auth/idp',
        errorType: errorType || 'idp_auth_error',
      },
      contexts: {
        idp_error: sentryContext,
      },
      fingerprint: ['auth-idp', errorType || 'general'],
    });
  }
}

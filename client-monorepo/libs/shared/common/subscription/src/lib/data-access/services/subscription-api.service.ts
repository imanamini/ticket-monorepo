import { inject, Injectable } from '@angular/core';
import { map, mergeMap, Observable, retryWhen, switchMap, throwError, TimeoutError, timer } from 'rxjs';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { CurrentUserPlanApiResponse } from '../models/CurrentUserPlan';
import { SubscriptionPlan } from '../models/subscription-plan.model';
import { SERVICES_TYPE } from '../models/services-type.model';
import { SubscriptionPlansResponse } from '../models/subscription-plans-response';
import { UserCurrentPlanResponse } from '../models/user-current-plan-response';
import { JalaliDatePipe } from '@digipay/ng-lib-pipes';
import { PLANS_TYPE } from '../models/plans-type.model';
import { AbTestService } from '@client-monorepo/common/utilities';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionApiService {
  apiService = inject(ApiService);
  datePipe = inject(JalaliDatePipe);
  private abTestService = inject(AbTestService);

  getUserSubscription(): Observable<CurrentUserPlanApiResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'app-subscription/purchases/plans/user-plan');
    return this.apiService.call<CurrentUserPlanApiResponse>(request).pipe(
      timeout(5000), // ⏱ 5 seconds
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, retryIndex) => {
            if (error instanceof TimeoutError && retryIndex < 1) {
              return timer(0); // immediate retry (previous request is auto-cancelled)
            }
            // ❌ do NOT retry other errors
            return throwError(() => error);
          })
        )
      ),
    );
  }

  public getUserCurrentPlanApi(): Observable<UserCurrentPlanResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'app-subscription/purchases/plans/user-plan');
    return this.apiService.call<UserCurrentPlanResponse>(request).pipe(
      timeout(5000), // ⏱ 5 seconds
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, retryIndex) => {
            if (error instanceof TimeoutError && retryIndex < 1) {
              return timer(0); // immediate retry (previous request is auto-cancelled)
            }
            // ❌ do NOT retry other errors
            return throwError(() => error);
          })
        )
      ),
      map((response) => {
        if (response?.plan?.expirationDate) {
          response.plan.expirationDateString = this.datePipe.transform(response.plan.expirationDate);
        }
        response?.plan.services.sort((a, b) => a.order - b.order);
        return response;
      }),
    );
  }

  getSubscriptionPlansApi(): Observable<SubscriptionPlansResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'app-subscription/plans');

    return this.apiService.call<SubscriptionPlansResponse>(request).pipe(
      switchMap((response) =>
        // Fetch showDPCard result before filtering
        this.abTestService.showDPCard().pipe(
          map((showDPCard) => {
            response.plans = response.plans.filter((plan) => {
              if (plan.type === PLANS_TYPE.PAY_PRO || plan.type === PLANS_TYPE.PAY_PLUS) {
                // Show PAY_PRO plan only if user is member of DigipayFamily
                return showDPCard;
              }
              // Show all other plans
              return true;
            });

            response.plans.forEach((plan: SubscriptionPlan) => {
              plan.services.sort((a, b) => a.order - b.order);
            });

            return response;
          }),
        ),
      ),
    );
  }

  public getPlanById(uuid: string): Observable<SubscriptionPlan> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `app-subscription/plans/${uuid}`);
    return this.apiService.call<any>(request).pipe(
      map((response) => {
        return response.plan;
      }),
    );
  }

  public refundSubscriptionApi(): Observable<any> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'app-subscription/purchases/plans/refund');
    return this.apiService.call<any>(request);
  }

  public closeSubscriptionApi(): Observable<any> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'app-subscription/purchases/plans/close');
    return this.apiService.call<any>(request);
  }

  public retryPlanServicesApi(serviceType: SERVICES_TYPE): Observable<any> {
    const request = new RequestBuilder(RequestTypeEnum.POST, `app-subscription/purchases/plans/retry/service/${serviceType}`);
    return this.apiService.call<any>(request);
  }
}

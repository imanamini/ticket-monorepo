import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, tap } from 'rxjs';
import { WalletManagementApiService } from '@client-monorepo/applets/wallet-management';
import { CreditApiService, GetPlanGroupsResponse, PlanGroup, SERVICE_TYPE } from '@client-monorepo/applets/credit';

export interface WalletsData {
  wallets: any[];
  volunteers: any[];
}

export interface PlansData {
  planGroupDetails: PlanGroup[];
  bnplPlans: PlanGroup[];
  creditPlans: PlanGroup[];
  maxPlanFourPay: PlanGroup | null;
  maxPlanOnePay: PlanGroup | null;
  maxCreditPlan: PlanGroup | null;
}

export interface HomeData {
  balance: number | null;
  wallets: WalletsData | null;
  plans: PlansData | null;
}

@Injectable({
  providedIn: 'root',
})
export class HomeDataService {
  private walletManagementApiService = inject(WalletManagementApiService);
  private creditApiService = inject(CreditApiService);

  // BehaviorSubjects to hold and emit current data
  private balanceSubject = new BehaviorSubject<number | null>(null);
  private walletsSubject = new BehaviorSubject<WalletsData | null>(null);
  private plansSubject = new BehaviorSubject<PlansData | null>(null);
  private walletsErrorSubject = new BehaviorSubject<boolean>(false);

  // Observable streams for components to subscribe to
  balance$ = this.balanceSubject.asObservable();
  wallets$ = this.walletsSubject.asObservable();
  plans$ = this.plansSubject.asObservable();
  walletsError$ = this.walletsErrorSubject.asObservable();

  // Combined observable for all data
  homeData$: Observable<HomeData> = combineLatest([this.balance$, this.wallets$, this.plans$]).pipe(
    map(([balance, wallets, plans]) => ({
      balance,
      wallets,
      plans,
    })),
  );

  /**
   * Refresh all data by calling all APIs
   * This will trigger updates to all subscribed components
   */
  refreshData(): Observable<HomeData> {
    this.resetData();

    const balance$ = this.walletManagementApiService.getBalanceInformation().pipe(
      map((balanceInfo) => balanceInfo.balance),
      tap((balance) => this.balanceSubject.next(balance)),
      catchError((error) => {
        return of(null);
      }),
    );

    const wallets$ = this.creditApiService.getCreditWallets().pipe(
      map((response) => {
        const wallets = response?.creditWallets ?? [];
        const volunteers = response?.creditVolunteers ?? [];
        return { wallets: [...wallets], volunteers: [...volunteers] };
      }),
      tap((walletsData) => {
        this.walletsSubject.next(walletsData);
        // mark error only on HTTP error (handled in catchError)
        this.walletsErrorSubject.next(false);
      }),
      catchError((error) => {
        // only here we flag error (non-200, timeout at lower layers, network, etc.)
        this.walletsErrorSubject.next(true);
        return of(null);
      }),
    );

    const plans$ = this.creditApiService.getPlanGroups().pipe(
      map((response: GetPlanGroupsResponse) => {
        if (!response || !response.planGroupDetails || response.planGroupDetails.length === 0) {
          return null;
        }
        return this.processPlanGroups(response);
      }),
      tap((plansData) => {
        this.plansSubject.next(plansData);
      }),
      catchError((error) => {
        return of(null);
      }),
    );

    return combineLatest([balance$, wallets$, plans$]).pipe(
      map(([balance, wallets, plans]) => ({
        balance,
        wallets,
        plans,
      })),
    );
  }

  /**
   * Initialize data - call this on app/component initialization
   */
  initializeData(): Observable<HomeData> {
    return this.refreshData();
  }

  /**
   * Reset internal cached data to a clean state
   */
  private resetData(): void {
    this.balanceSubject.next(null);
    this.walletsSubject.next({ wallets: [], volunteers: [] });
    this.plansSubject.next({
      planGroupDetails: [],
      bnplPlans: [],
      creditPlans: [],
      maxPlanFourPay: null,
      maxPlanOnePay: null,
      maxCreditPlan: null,
    });
    this.walletsErrorSubject.next(false);
  }

  /**
   * Get current balance value (synchronous)
   */
  getCurrentBalance(): number | null {
    return this.balanceSubject.value;
  }

  /**
   * Get current wallets value (synchronous)
   */
  getCurrentWallets(): WalletsData | null {
    return this.walletsSubject.value;
  }

  /**
   * Get current plans value (synchronous)
   */
  getCurrentPlans(): PlansData | null {
    return this.plansSubject.value;
  }

  /**
   * Process plan groups to extract BNPL plans, credit plans and max plans
   */
  private processPlanGroups(plans: GetPlanGroupsResponse): PlansData {
    // Work with cloned arrays to avoid accidental mutations elsewhere
    const planGroupDetails = [...plans.planGroupDetails];
    const bnplPlans = planGroupDetails.filter((item: PlanGroup) => item.serviceType === SERVICE_TYPE.BNPL);
    const creditPlans = planGroupDetails.filter((item: PlanGroup) => item.serviceType === SERVICE_TYPE.CREDIT);

    const maxPlanFourPay = this.findMaxPlan(bnplPlans, 4);
    const maxPlanOnePay = this.findMaxPlan(bnplPlans, 1);
    const maxCreditPlan = this.findMaxCreditPlan(creditPlans);

    return {
      planGroupDetails,
      bnplPlans: [...bnplPlans],
      creditPlans: [...creditPlans],
      maxPlanFourPay,
      maxPlanOnePay,
      maxCreditPlan,
    };
  }

  /**
   * Find the maximum plan by credit amount for a specific installment count
   */
  private findMaxPlan(plans: PlanGroup[], installmentCount: number): PlanGroup | null {
    if (!plans || plans.length === 0) {
      return null;
    }

    const filteredPlans = plans.filter((plan) => plan.active && plan.installmentCount === installmentCount);

    if (filteredPlans.length === 0) {
      return null;
    }

    return filteredPlans.reduce((max, current) => {
      return current.creditAmount > max.creditAmount ? current : max;
    });
  }

  /**
   * Find the maximum credit plan by credit amount
   */
  private findMaxCreditPlan(plans: PlanGroup[]): PlanGroup | null {
    if (!plans || plans.length === 0) {
      return null;
    }

    const activePlans = plans.filter((plan) => plan.active);

    if (activePlans.length === 0) {
      return null;
    }

    return activePlans.reduce((max, current) => {
      return current.creditAmount > max.creditAmount ? current : max;
    });
  }
}

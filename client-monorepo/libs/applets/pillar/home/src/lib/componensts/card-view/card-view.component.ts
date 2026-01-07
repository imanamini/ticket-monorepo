import { ChangeDetectionStrategy, Component, computed, Inject, inject, OnDestroy, OnInit, output, signal } from '@angular/core';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import {
  CREDIT_WALLET_STATUS,
  CreditCacheService,
  CreditServiceTypeService,
  CreditTacResponse,
  CreditTacService,
  CreditUrlService,
  CreditWallet,
  GetPlanGroupsResponse,
  PlanGroup,
  SERVICE_TYPE,
  transformWalletStatus,
} from '@client-monorepo/applets/credit';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HomeDataService } from '../../data-access/home-data.service';
import { PillarCreditWalletCardComponent } from '../credit/pillar-credit-wallet-card/pillar-credit-wallet-card.component';
import { NgxCard } from '@digipay/ngx-card';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { AppNameService } from '@client-monorepo/common/utilities';
import { EventManagementService } from '@client-monorepo/common/event-management';

interface CardClickMetaData {
  showAgreements?: boolean;
  showPreSettle?: boolean;
  replaceUrl?: boolean;
}

@Component({
  selector: 'pillar-applet-card-view',
  standalone: true,
  imports: [NgxCard, NgxBadgeModule, PillarCreditWalletCardComponent, NgxCard, NgxCard],
  templateUrl: './card-view.component.html',
  styleUrl: './card-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardViewComponent implements OnInit, OnDestroy {
  creditUrlService = inject(CreditUrlService);
  creditTacService = inject(CreditTacService);
  router = inject(Router);
  cache = inject(CreditCacheService);
  private homeDataService = inject(HomeDataService);
  serviceTypeService = inject(CreditServiceTypeService);
  private eventService = inject(NgxEventTrackerService);
  private eventManagementService = inject(EventManagementService);
  private appNameService = inject(AppNameService);

  constructor(@Inject('APP_ENV') private readonly environment: { [key: string]: string }) {}

  shouldAcceptTacSubscription!: Subscription;
  getWalletSubscription!: Subscription;

  wallets = signal<CreditWallet[] | null>(null);
  volunteers = signal<CreditWallet[]>([]);

  tacData = signal<CreditTacResponse | null>(null);
  displayPreRegisterButton = signal<boolean | null>(null);
  planApiCallCompleted = signal(false);
  shouldAcceptTac = signal<boolean | null>(null);
  maxPlanFourPay = signal<PlanGroup | null>(null);
  maxPlanOnePay = signal<PlanGroup | null>(null);
  creditAmount = computed<number>(() => {
    if (this.wallets() && this.wallets()!.length > 0) {
      return this.wallets()![0].balance;
    } else if (this.maxPlanFourPay()) {
      return this.maxPlanFourPay()?.creditAmount ?? 0;
    } else {
      return 0;
    }
  });
  showCreditPreRegister = false;
  isFourPay = computed<boolean>(() => this.maxPlanFourPay()?.installmentCount === 4 || this.wallets()![0].installmentCount === 4);
  statusActionMap: { [key: string]: 'GO_TO_STEPS' | 'GO_TO_DETAIL' } = {
    INCOMPLETE_DOCUMENTS: 'GO_TO_STEPS',
    OPERATIONAL_INPROGRESS: 'GO_TO_STEPS',
    OPERATIONAL_REJECTION: 'GO_TO_STEPS',
    EXPIRED: 'GO_TO_STEPS',
    ACTIVE: 'GO_TO_STEPS',
    INACTIVE: 'GO_TO_DETAIL',
    COMPLETED: 'GO_TO_DETAIL',
    READY_TO_CLOSE: 'GO_TO_DETAIL',
    CLOSE: 'GO_TO_DETAIL',
    CLOSE_REJECTED: 'GO_TO_DETAIL',
    CLOSE_CONTRADICTED: 'GO_TO_DETAIL',
  };

  showBNPLPlan = signal(false);
  showCreditPlan = signal(false);

  bnplPlans = signal<PlanGroup[]>([]);
  creditPlans = signal<PlanGroup[]>([]);
  maxCreditPlan = signal<PlanGroup | null>(null);

  isAnyActiveWallet = output<boolean>();

  groupedWallets = computed(() => {
    const allWallets = [...(this.wallets() || []), ...(this.volunteers() || [])];

    const bnplWallets = allWallets.filter((w) => w.serviceType === SERVICE_TYPE.BNPL);
    const creditWallets = allWallets.filter((w) => w.serviceType === SERVICE_TYPE.CREDIT);

    return {
      bnpl: this.assignLayout(bnplWallets),
      credit: this.assignLayout(creditWallets),
    };
  });

  // Add BNPL plans to grouped wallets
  groupedBNPLWithPlans = computed(() => {
    const bnplWallets = this.groupedWallets().bnpl;
    const plans: any[] = [];

    if (this.showBNPLPlan() && this.maxPlanOnePay()) {
      plans.push({
        type: 'plan',
        data: this.maxPlanOnePay(),
        isOnePay: true,
      });
    }

    if (this.showBNPLPlan() && this.maxPlanFourPay()) {
      plans.push({
        type: 'plan',
        data: this.maxPlanFourPay(),
        isFourPay: true,
      });
    }

    // Combine wallets and plans
    const combined = [...bnplWallets, ...plans];
    return this.assignLayout(combined);
  });

  // Add Credit plans to grouped wallets
  groupedCreditWithPlans = computed(() => {
    const creditWallets = this.groupedWallets().credit;
    const plans: any[] = [];

    // Check feature flag before showing credit pre-register card

    if (this.showCreditPreRegister && this.showCreditPlan() && this.maxCreditPlan()) {
      plans.push({
        type: 'plan',
        data: this.maxCreditPlan(),
        isCredit: true,
      });
    }

    // If there's only 1 plan, always show it as full-width regardless of wallet count
    if (plans.length === 1) {
      plans[0].layout = 'full';
      // Apply layout to wallets only
      const layoutedWallets = this.assignLayout(creditWallets);
      // Wallets first, then plan
      return [...layoutedWallets, ...plans];
    }

    // Combine wallets and plans - wallets always come first
    const combined = [...creditWallets, ...plans];
    return this.assignLayout(combined);
  });

  ngOnInit() {
    this.showCreditPreRegister = process.env['name'] === 'staging' || process.env['name'] === 'development';
    this.getTac();
    this.homeDataService.wallets$.subscribe((walletsData) => {
      if (walletsData) {
        this.volunteers.set(walletsData.volunteers);
        this.wallets.set(walletsData.wallets);
      }
    });

    // Subscribe to plans data
    this.homeDataService.plans$.subscribe((plansData) => {
      if (plansData) {
        this.bnplPlans.set(plansData.bnplPlans);
        this.showBNPLPlan.set(plansData.bnplPlans.length > 0);
        this.maxPlanFourPay.set(plansData.maxPlanFourPay);
        this.maxPlanOnePay.set(plansData.maxPlanOnePay);
        this.creditPlans.set(plansData.creditPlans);
        this.showCreditPlan.set(plansData.creditPlans.length > 0);
        this.maxCreditPlan.set(plansData.maxCreditPlan);
      }
      this.planApiCallCompleted.set(true);
    });

    this.shouldAcceptTacSubscription = this.creditTacService.getShouldAccept().subscribe((shouldAccept) => {
      this.shouldAcceptTac.set(shouldAccept);
    });
  }

  /**
   * Assigns layout classes based on count and active status
   */
  private assignLayout(items: any[]): any[] {
    const count = items.length;

    if (count === 0) return [];
    if (count === 1) return items.map((item) => ({ ...item, layout: 'full' }));
    if (count === 2) return items.map((item) => ({ ...item, layout: 'half' }));

    // For 3+ items
    const result: any[] = [];

    // Separate active (status === 6) and inactive items
    const activeItems = items.filter((item) => item.status === 6 || item.type === 'plan');
    const inactiveItems = items.filter((item) => item.status !== 6 && item.type !== 'plan');

    if (count === 3) {
      // 2 cards at 50%, 1 card at 100%
      // Priority: inactive gets full width
      if (inactiveItems.length > 0) {
        // Put 2 active items at 50%
        for (let i = 0; i < 2 && i < activeItems.length; i++) {
          result.push({ ...activeItems[i], layout: 'half' });
        }
        // Put 1 inactive at 100%
        result.push({ ...inactiveItems[0], layout: 'full' });
        // Add remaining items at 50%
        for (let i = 2; i < activeItems.length; i++) {
          result.push({ ...activeItems[i], layout: 'half' });
        }
        for (let i = 1; i < inactiveItems.length; i++) {
          result.push({ ...inactiveItems[i], layout: 'half' });
        }
      } else {
        // All active: first 2 at 50%, last at 100%
        result.push({ ...items[0], layout: 'half' });
        result.push({ ...items[1], layout: 'half' });
        result.push({ ...items[2], layout: 'full' });
      }
    } else if (count === 4) {
      // All at 50%
      return items.map((item) => ({ ...item, layout: 'half' }));
    } else {
      // For 5+: pattern repeats (50%, 50%, 100%, 50%, 50%, 100%, ...)
      let itemIndex = 0;

      // First prioritize inactive for full width positions
      const sortedItems = [...inactiveItems, ...activeItems];

      while (itemIndex < sortedItems.length) {
        if (itemIndex % 3 === 0 && itemIndex + 2 < sortedItems.length) {
          // Add 2 half-width items
          result.push({ ...sortedItems[itemIndex], layout: 'half' });
          result.push({ ...sortedItems[itemIndex + 1], layout: 'half' });
          itemIndex += 2;
        } else {
          // Add full-width item
          result.push({ ...sortedItems[itemIndex], layout: 'full' });
          itemIndex += 1;
        }
      }
    }

    return result;
  }

  private createBNPLLogic(plans: GetPlanGroupsResponse) {
    const bnplPlans = plans.planGroupDetails.filter((item: any) => item.serviceType === SERVICE_TYPE.BNPL);
    this.bnplPlans.set(bnplPlans);

    if (this.bnplPlans().length > 0) {
      this.showBNPLPlan.set(true);
    }

    const maxPlanFourPay = plans.planGroupDetails.reduce((max, current) => {
      if (current.active && current.installmentCount === 4) {
        return current.creditAmount > max.creditAmount ? current : max;
      }
      return max;
    }, plans.planGroupDetails[0]);

    this.maxPlanFourPay.set(maxPlanFourPay);

    const maxPlanOnePay = plans.planGroupDetails.reduce((max, current) => {
      if (current.active && current.installmentCount === 1) {
        return current.creditAmount > max.creditAmount ? current : max;
      }
      return max;
    }, plans.planGroupDetails[0]);

    this.maxPlanOnePay.set(maxPlanOnePay);
  }

  /**
   * Click handler of the wallet cards
   * Acts based on the status of the card.
   *
   * @param wallet
   *
   * @param metaData
   */
  cardClicked(wallet: CreditWallet, metaData?: CardClickMetaData) {
    // Track wallet click event
    if (this.appNameService.isPillar()) {
      this.eventService.sendEvent({
        eventName: 'Pillar_ClickOnWallet',
        eventData: {},
      });
      this.eventManagementService.triggerEvent({
        eventType: 'click',
        data: {
          target: 'wallet-card',
        },
      });
    }

    if (wallet.type === 'VOLUNTEER') {
      this.goVolunteer(wallet.redirectUrl!);
      return;
    }

    switch (this.statusActionMap[transformWalletStatus(wallet.status)]) {
      case 'GO_TO_STEPS':
        this.goToSteps(wallet.fundProviderCode, wallet.creditId);
        break;
      case 'GO_TO_DETAIL':
        this.goToDetail(wallet.fundProviderCode, wallet.creditId, metaData);
        break;
    }
  }

  goToSteps(fundProviderCode: number, creditId: string) {
    // Track event based on wallet type
    if (this.appNameService.isPillar()) {
      const wallet = [...(this.wallets() ?? []), ...(this.volunteers() ?? [])].find((w) => w.creditId === creditId);
      if (wallet) {
        if (wallet.serviceType === SERVICE_TYPE.BNPL) {
          const eventName = wallet.installmentCount === 1 ? 'Pillar_ClickComplete1Pay' : 'Pillar_ClickComplete4Pay';
          this.eventService.sendEvent({
            eventName,
            eventData: {},
          });
          this.eventManagementService.triggerEvent({
            eventType: 'click',
            data: {
              target: wallet.installmentCount === 1 ? 'complete-1pay' : 'complete-4pay',
            },
          });
        }
      }
    }

    const activationUrl = this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${fundProviderCode}/${creditId}/next`);
    if (!this.shouldAcceptTac()) {
      this.router.navigateByUrl(activationUrl);
    } else {
      this.displayTacToUser(activationUrl);
    }
  }

  goToDetail(fundProviderCode: number, creditId: string, metaData?: CardClickMetaData) {
    // Track event based on wallet type
    if (this.appNameService.isPillar()) {
      const wallet = [...(this.wallets() ?? []), ...(this.volunteers() ?? [])].find((w) => w.creditId === creditId);
      if (wallet) {
        if (wallet.serviceType === SERVICE_TYPE.BNPL) {
          const eventName = wallet.installmentCount === 1 ? 'Pillar_Click1PayDetail' : 'Pillar_Click4PayDetail';
          this.eventService.sendEvent({
            eventName,
            eventData: {},
          });
          this.eventManagementService.triggerEvent({
            eventType: 'click',
            data: {
              target: wallet.installmentCount === 1 ? '1pay-detail' : '4pay-detail',
            },
          });
        } else if (wallet.serviceType === SERVICE_TYPE.CREDIT) {
          this.eventService.sendEvent({
            eventName: 'Pillar_ClickLoanDetail',
            eventData: {},
          });
          this.eventManagementService.triggerEvent({
            eventType: 'click',
            data: {
              target: 'loan-detail',
            },
          });
        }
      }
    }

    let queryParams = '';
    if (metaData?.showPreSettle) {
      queryParams = '?showPreSettle=true';
    } else if (metaData?.showAgreements) {
      queryParams = '?showAgreements=true';
    }
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath(`/wallet/detail/${creditId}${queryParams}`), {
      replaceUrl: Boolean(metaData?.replaceUrl),
    });
  }

  goVolunteer(url: string) {
    if (url) {
      this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/volunteer/view'), {
        state: {
          showVolunteer: true,
          pageFileId: url,
        },
      });
    } else {
      this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/resolve'));
    }
  }

  private getTac() {
    const TAC_CACHE = 'CREDIT_TAC_CACHE';
    if (this.cache.has(TAC_CACHE)) {
      this.tacData.set(this.cache.get(TAC_CACHE));
    } else {
      this.creditTacService.getData().subscribe((response) => {
        this.tacData.set(response);
        this.cache.put(TAC_CACHE, response);
      });
    }
  }

  /**
   *
   */
  private displayTacToUser(destination: string | null = null, destinationState = {}) {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/wallet/tac'), {
      state: {
        destination: destination || this.creditUrlService.getInnerServicePath('/overview'),
        destinationState,
      },
    });
  }

  goToPreRegister() {
    // Track event for credit plan request (Pillar_ClickLoanRequest not in list, keeping only eventManagementService)
    this.eventService.sendEvent({
      eventName: 'Pillar_ClickLoanRequest',
      eventData: {},
    });
    this.eventManagementService.triggerEvent({
      eventType: 'click',
      data: {
        target: 'loan-request',
      },
    });

    this.serviceTypeService.setServiceType('credit');
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/pre-register'));
  }

  goToSelectPlan(installmentCount: string) {
    // Track event based on installment count
    const eventName = installmentCount === '1' ? 'Pillar_Click1PayRequest' : 'Pillar_Click4PayRequest';
    this.eventService.sendEvent({
      eventName,
      eventData: {},
    });
    this.eventManagementService.triggerEvent({
      eventType: 'click',
      data: {
        target: installmentCount === '1' ? '1pay-request' : '4pay-request',
      },
    });

    this.serviceTypeService.setServiceType('bnpl');
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath(`/select-plan?installmentCount=${installmentCount}`));
  }

  handleCardClicked() {
    if (this.displayPreRegisterButton()) {
      this.goToPreRegister();
    } else if (Array.isArray(this.wallets())) {
      this.cardClicked(this.wallets()![0] as CreditWallet);
    }
  }

  ngOnDestroy(): void {
    if (this.shouldAcceptTacSubscription) {
      this.shouldAcceptTacSubscription.unsubscribe();
    }
    if (this.getWalletSubscription) {
      this.getWalletSubscription.unsubscribe();
    }
  }

  protected readonly CREDIT_WALLET_STATUS = CREDIT_WALLET_STATUS;
}

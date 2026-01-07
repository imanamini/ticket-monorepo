import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { CreditWallet } from '../../data-access/models/credit/wallet/credit-wallet.model';
import { CreditUrlService } from '../../data-access/utils/url';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditTacResponse } from '../../data-access/models/credit/credit-tac-response.model';
import { Subscription } from 'rxjs';
import { CreditTacService } from '../credit-tac.service';
import { WalletCardService } from '../../data-access/services/wallet-card.service';
import { CreditCacheService } from '../../data-access/services/credit-cache.service';
import { CreditNavigationService } from '../../data-access/services/credit-navigation.service';
import { transformWalletStatus } from '../../data-access/models/credit/wallet/wallet-statuses';
import { CreditServiceTypeService } from '../../data-access/services/credit-service-type.service';
import { NgxFabComponent } from '@digipay/ngx-button';
import { CreditWalletListComponent } from '../../components/credit-list/credit-wallet-list.component';
import { CreditProvisionComponent } from '../../components/credit-provision/credit-provision.component';
import { CreditScrollableViewComponent } from '../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../components/credit-app-bar/credit-app-bar.component';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { SERVICE_TYPE } from '../../data-access/models/credit/service-type/service-type.model';

interface CardClickMetaData {
  showAgreements?: boolean;
  showPreSettle?: boolean;
  replaceUrl?: boolean;
}

@Component({
  selector: 'app-credit-wallet-activation-dashboard',
  templateUrl: './credit-wallet-activation-dashboard.component.html',
  styleUrls: ['./credit-wallet-activation-dashboard.component.scss'],
  standalone: true,
  imports: [
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    CreditProvisionComponent,
    CreditWalletListComponent,
    NgxFabComponent,
    NgxSkeletonLoadingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditWalletActivationDashboardComponent implements OnInit, OnDestroy {
  /**
   * API Response
   */
  wallets = signal<CreditWallet[] | null>(null);
  volunteers = signal<CreditWallet[]>([]);
  /**
   *
   */
  tacData = signal<CreditTacResponse | null>(null);

  shouldAcceptTac = signal<boolean | null>(null);

  shouldAcceptTacSubscription!: Subscription;
  getWalletSubscription: Subscription;
  getWalletListSubscription!: Subscription;
  displayPreRegisterButton = signal<boolean | null>(null);
  apiCallCompleted = signal(false);
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

  title = signal<string | null>(null);
  serviceTypeName = signal<string | null>(null);

  creditService = inject(CreditApiService);
  walletCardService = inject(WalletCardService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  cache = inject(CreditCacheService);
  creditTacService = inject(CreditTacService);
  creditNavigationService = inject(CreditNavigationService);
  creditUrlService = inject(CreditUrlService);
  creditServiceTypeService = inject(CreditServiceTypeService);

  constructor() {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    const params = this.activatedRoute.snapshot.params;

    this.getWalletSubscription = this.walletCardService.getRawWalletList().subscribe(({ wallets, volunteers }) => {
      if (wallets.length === 0 && volunteers.length === 0 && !this.creditServiceTypeService.isCredit()) {
        this.closeService();
        return;
      }

      this.wallets.set(
        this.creditServiceTypeService.isCredit()
          ? wallets.filter((wallet) => [SERVICE_TYPE.CREDIT, SERVICE_TYPE.INSTALLMENT_SALE].includes(wallet.serviceType))
          : wallets,
      );
      this.volunteers.set(volunteers);

      if (this.creditServiceTypeService.isCredit() && this.wallets()?.length === 0) {
        this.router.navigateByUrl(this.creditUrlService.getInnerServicePath(`/pre-register`)).then();
      }

      // For generating a direct link for any status wallet detail
      if (params['creditId']) {
        const foundWallets = this.wallets()?.filter((w) => {
          return w.creditId === params['creditId'];
        });
        if (foundWallets && foundWallets.length === 1) {
          this.cardClicked(foundWallets[0], { replaceUrl: true });
        }
      }

      // For generating a direct link for paying installments
      const payForFp = queryParams['payForFp'] || params['fundProviderCode'];
      if (payForFp) {
        const serviceType = queryParams['serviceType'];
        const foundWallets = this.wallets()?.filter((w) => {
          return (
            w.fundProviderCode === +payForFp &&
            w.serviceType === Number(serviceType) &&
            (params['fundProviderCode'] || transformWalletStatus(w.status) === 'COMPLETED')
          );
        });
        if (foundWallets && foundWallets.length === 1) {
          this.cardClicked(foundWallets[0], { replaceUrl: true });
        }
      }
      const walletStatus = Number(queryParams['walletStatus']);

      if (walletStatus) {
        const foundWallets = this.wallets()?.filter((w) => {
          return transformWalletStatus(w.status) === 'INCOMPLETE_DOCUMENTS';
        });
        if (foundWallets && foundWallets.length === 1) {
          this.cardClicked(foundWallets[0], { replaceUrl: true });
        }
      }

      // For generating a direct link for showing agreements
      const showAgreements = queryParams['showAgreements'];
      if (showAgreements === 'true') {
        const serviceType = queryParams['serviceType'];
        const foundWallets = this.wallets()?.filter((w) => {
          return w.serviceType === parseInt(serviceType);
        });
        if (foundWallets && foundWallets.length === 1) {
          this.cardClicked(foundWallets[0], { showAgreements: true, replaceUrl: true });
        }
      }

      // For generating a direct link to open Pre settle
      const showPreSettle = queryParams['showPreSettle'];
      if (showPreSettle === 'true') {
        const fundProviderCode = +queryParams['payForFp'];
        const foundWallets = this.wallets()?.filter(
          (w) => w.fundProviderCode === fundProviderCode && transformWalletStatus(w.status) === 'COMPLETED',
        );
        if (foundWallets && foundWallets.length === 1) {
          this.cardClicked(foundWallets[0], { showPreSettle: true, replaceUrl: true });
        }
      }
    });
  }

  ngOnInit() {
    this.title.set(this.creditServiceTypeService.giveResultByType('وام‌ها', 'اعتبار اقساطی'));
    this.serviceTypeName.set(this.creditServiceTypeService.giveResultByType('وام', 'اعتبار'));

    this.getTac();

    this.getPreRegisterButton();

    this.shouldAcceptTacSubscription = this.creditTacService.getShouldAccept().subscribe((shouldAccept) => {
      this.shouldAcceptTac.set(shouldAccept);
    });
  }

  /**
   * Something is not correct, go back to home
   */
  closeService() {
    // go back to a safe place.
    this.creditNavigationService.closeService();
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
    const activationUrl = this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${fundProviderCode}/${creditId}/next`);
    if (!this.shouldAcceptTac()) {
      this.router.navigateByUrl(activationUrl);
    } else {
      this.displayTacToUser(activationUrl);
    }
  }

  goToDetail(fundProviderCode: number, creditId: string, metaData?: CardClickMetaData) {
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

  /**
   * Info icon clicked in the page-title-bar
   * Goes to the TAC page
   */
  infoIconClicked() {
    this.displayTacToUser();
  }

  ngOnDestroy(): void {
    if (this.shouldAcceptTacSubscription) {
      this.shouldAcceptTacSubscription.unsubscribe();
    }
    if (this.getWalletSubscription) {
      this.getWalletSubscription.unsubscribe();
    }
    if (this.getWalletListSubscription) {
      this.getWalletListSubscription.unsubscribe();
    }
  }

  goToPreRegister() {
    if (this.creditServiceTypeService.isCredit()) {
      this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/pre-register'));
      return;
    }
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/select-plan'));
  }

  getPreRegisterButton() {
    this.creditService.getPlanGroups().subscribe({
      next: (response) => {
        if (response && response.planGroupDetails && response.planGroupDetails.length > 0) {
          this.displayPreRegisterButton.set(true);
        } else {
          this.displayPreRegisterButton.set(false);
        }
        this.apiCallCompleted.set(true);
      },
      error: () => {
        this.displayPreRegisterButton.set(false);
        this.apiCallCompleted.set(true);
      },
    });
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
}

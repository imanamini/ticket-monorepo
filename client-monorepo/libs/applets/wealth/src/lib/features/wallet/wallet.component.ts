import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { HOME_ROUTE, WALLET_BNPL_DETAIL_ROUTE, WALLET_CREDIT_GUIDS, WALLET_GUIDS } from '../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { IWalletActionButton } from './models/wallet-action-button.interface';
import { WalletActionsComponent } from './components/wallet-actions/wallet-actions.component';
import { WalletsBalanceComponent } from './components/wallets-balance/wallets-balance.component';
import { WalletService } from './services/wallet.service';
import { WalletCreditComponent } from './components/wallet-credit/wallet-credit.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EWalletProfit, IWallet, IWallets } from './models/wallet.interface';
import { IProcessData } from './models/wallet-process.interface';
import { RouteStateService, StorageService } from '@client-monorepo/common/utilities';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { WalletBnplBottomsheetComponent } from './components/wallet-bnpl-bottomsheet/wallet-bnpl-bottomsheet.component';
import { ErrorCodes } from '../../data-access/enums/error-codes';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { WalletBnplLessAmountBottomsheetComponent } from './components/wallet-bnpl-less-amount-bottomsheet/wallet-bnpl-less-amount-bottomsheet.component';
import { ActionHandlerService, ActionType, RedirectAction } from '@client-monorepo/common/action-handler';
import { exhaustMap, filter, map, switchMap, take, tap, timer } from 'rxjs';
import { AppBarWrapperComponent } from '../../components/core/components/app-bar-wrapper/app-bar-wrapper.component';
import { IAnnualProfit } from './models/annual-profit.interface';
import { BorderColorsEnum } from '@digipay/ngx-divider';
import { UserActivitiesService } from '../../shared/services/activities/user-activities.service';
import { IUserActivity } from '../../shared/services/activities/models/user-activities.interface';
import { WalletGuidsAndDescriptionsComponent } from './components/wallet-guids-and-descriptions/wallet-guids-and-descriptions.component';
import { WalletYieldDetailsComponent } from './components/wallet-yield-details/wallet-yield-details.component';
import { WalletRegistrationDetailsComponent } from './components/wallet-registration-details/wallet-registration-details.component';
import { DepositToBottomSheetComponent } from './components/deposit-to-bottom-sheet/deposit-to-bottom-sheet.component';
import { WalletsBalanceSheetComponent } from './components/wallets-balance-sheet/wallets-balance-sheet.component';
import { WithdrowFromSheetComponent } from './components/withdrow-from-sheet/withdrow-from-sheet.component';
import { GetCreditAsBottomSheetComponent } from './components/get-credit-as-bottom-sheet/get-credit-as-bottom-sheet.component';
import { SegmentItemsModel } from '@digipay/ngx-segmented-control/lib/models/types';
import { ECreditStatus } from './models/credit-status.enum';
import {
  SheetOutput,
  WalletBnplCancelBottomsheetComponent,
} from './components/wallet-bnpl-cancel-bottomsheet/wallet-bnpl-cancel-bottomsheet.component';
import { ProfitService } from '../../components/core/services/v1/profit.service';
import { OnboardingProfitService } from '../../shared/services/onboarding-profit.service';
import { SwapService } from '../swap/data-access/swap.service';
import { ISwapDto } from '../swap/models/swap-process.interface';
import { SwapNotifierBottomSheetComponent } from './components/swap-notifier-bottomSheet/swap-notifier-bottomSheet.component';

@Component({
  selector: 'wealth-applet-wallet',
  standalone: true,
  imports: [
    WalletsBalanceComponent,
    WalletActionsComponent,
    WalletGuidsAndDescriptionsComponent,
    WalletCreditComponent,
    SpinnerComponent,
    AppBarWrapperComponent,
    WalletYieldDetailsComponent,
    WalletRegistrationDetailsComponent,
  ],
  styleUrl: './wallet.component.scss',
  templateUrl: './wallet.component.html',
})
export class WalletComponent implements OnInit {
  private router = inject(Router);
  private walletService = inject(WalletService);
  private routeState = inject(RouteStateService);
  private activatedRoute = inject(ActivatedRoute);
  private bottomSheetService = inject(NgxBottomSheetService);
  private navigationService = inject(WealthNavigationService);
  private actionHandlerService = inject(ActionHandlerService);
  private userActivitiesService = inject(UserActivitiesService);

  skeleton = signal<boolean>(false);
  walletId = signal<string | undefined>(undefined);
  walletActions = signal<IWalletActionButton[]>([
    {
      id: 'BTN_DEPOSIT',
      label: 'خرید',
      disable: false,
      style: 'fill',
      icon: {
        name: 'plus',
        type: 'linear',
      },
    },
    {
      id: 'BTN_WITHDRAW',
      label: 'فروش',
      disable: true,
      style: 'tinted-on-back',
      icon: {
        name: 'arrow-up',
        type: 'linear',
      },
    },
    {
      id: 'BTN_BNPL_REQUEST',
      label: 'درخواست اعتبار',
      disable: false,
      style: 'tinted-on-back',
      icon: {
        name: 'bnpl',
        type: 'linear',
      },
    },
    {
      id: 'BTN_TRANSACTIONS',
      label: 'تراکنش‌ها',
      disable: false,
      style: 'tinted-on-back',
      icon: {
        name: 'card-to-card',
        type: 'linear',
      },
    },
  ]);
  loading = signal<boolean>(true);
  wallet = signal<IWallets | undefined>(undefined);
  state = signal<IProcessData | undefined>(undefined);
  annualProfit = signal<IAnnualProfit | undefined>(undefined);
  checkingPostalCode = signal<boolean>(false);
  userPostalCode = signal<string | undefined>(undefined);
  hasWithdrawBalance = computed(() => {
    const wallet = this.wallet();
    if (!wallet?.wallets?.length) {
      return false;
    }
    return wallet.wallets.some(({ withdrawalBalance }) => withdrawalBalance > 0);
  });

  protected readonly EPnlView = EWalletProfit;
  protected readonly BorderColorsEnum = BorderColorsEnum;
  storageService = inject(StorageService);
  private profitService = inject(ProfitService);
  private onboardingService = inject(OnboardingProfitService);
  private swapService = inject(SwapService);

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));

    this._checkAndOpenSwapNotifier();

    if (this.state().bottomSheetName) {
      this.openBottomSheet(this.state());
    }
    this.getGoldPrice();
    this.getWallet();

    const activity: IUserActivity = {
      eventId: 'WW_WWHome',
      payloads: { walletId: this.walletId() || '' },
    };
    this.userActivitiesService.action(activity).subscribe();
    this.onboardingService.checkProfitOnboard();
  }

  getWallet() {
    timer(0, 300000)
      .pipe(switchMap(() => this.walletService.viewProfile()))
      .subscribe((res) => {
        if (res.success) {
          this.wallet.set(res.result);
          const fxWallet = res.result.wallets.find((x) => x.walletName === 'WALLET_FX');
          if (fxWallet && fxWallet.profit.status !== EWalletProfit.NoProfit) {
            this.getProfit();
          }
          if (!this.wallet().onBoarded) {
            const referrer = this.activatedRoute.snapshot.queryParams['referrer'];
            this.navigationService.navigate([WALLET_CREDIT_GUIDS, this.walletId()], {
              queryParams: {
                referrer,
              },
            });
          }
          this.updateActionButtons();
        } else {
          if (res?.error?.code === ErrorCodes.InvalidInstrumentSymbol) {
            this.navigationService.navigate([HOME_ROUTE]);
          }
        }
        this.loading.set(false);
      });
  }

  private getProfit() {
    this.skeleton.set(true);
    this.profitService.getProfit().subscribe((res) => {
      if (res.success) {
        const limitedAnnual = this.profitService.limitAnnualToFourMonths(res.result);
        this.annualProfit.set(limitedAnnual);
      }
      this.skeleton.set(false);
    });
  }

  private updateActionButtons() {
    const withdrawDisabled = !this.hasWithdrawBalance();
    const bnplDisabled = this.disableBnplRequest();

    this.walletActions.update((actions) =>
      actions.map((action) => {
        if (action.id === 'BTN_WITHDRAW') {
          return { ...action, disable: withdrawDisabled };
        }
        if (action.id === 'BTN_BNPL_REQUEST') {
          return { ...action, disable: bnplDisabled };
        }
        return action;
      }),
    );
  }

  private disableBnplRequest(): boolean {
    return (
      this.wallet().bnpl.status === ECreditStatus.Activated ||
      this.wallet().bnpl.status === ECreditStatus.InProgress ||
      this.wallet().bnpl.status === ECreditStatus.InClosure
    );
  }

  onBackHandler() {
    const dpxReferred = this.activatedRoute.snapshot.queryParamMap.has('referrer');
    if (dpxReferred) {
      this.router.navigateByUrl('/hub');
    } else {
      this.navigationService.navigate([HOME_ROUTE]);
    }
  }

  handleCredit() {
    if (this.wallet().bnpl.status === ECreditStatus.Activated) {
      this.cancelCredit();
    } else {
      this.handleBnplRequest();
    }
  }

  private openBottomSheet(data?: IProcessData) {
    if (data.bottomSheetName === 'page_wallet_bnpl_landing_confirmed') {
      this.bottomSheetService.openBottomSheet(WalletBnplBottomsheetComponent, {
        data,
      });
      const bottomSheetService = this.bottomSheetService.onClose.subscribe(() => {
        bottomSheetService.unsubscribe();
        const result = this.bottomSheetService.outputData();
        if (result && result['confirmed']) {
          this.handleCredit();
        }
      });
    } else if (data.bottomSheetName === 'page_wallet_bnpl_invalid_balance') {
      this.bottomSheetService.openBottomSheet(WalletBnplLessAmountBottomsheetComponent, {
        walletId: this.walletId(),
        requiredAmount: data.minAmount,
      });
    }
  }

  private _checkAndOpenSwapNotifier(): void {
    const expiry = JSON.parse(localStorage.getItem('swapNotifierExpiry'));
    if (!expiry) {
      this._openSwapNotifierBottomSheet(0);
      return;
    }

    const currentTime = new Date().getTime();

    if (Number(expiry.expireAt) > currentTime && expiry.count < 2) {
      this._openSwapNotifierBottomSheet(expiry.count);
    }
  }

  private _openSwapNotifierBottomSheet(count: number) {
    this.bottomSheetService.openBottomSheet(SwapNotifierBottomSheetComponent, {});
    this.bottomSheetService.onClose.subscribe(() => {
      const data = {
        expireAt: Date.now() + 24 * 60 * 60 * 1000,
        count: count + 1,
      };

      localStorage.setItem('swapNotifierExpiry', JSON.stringify(data));
    });
  }

  cancelCredit() {
    this.bottomSheetService.openBottomSheet(WalletBnplCancelBottomsheetComponent, {
      walletName: this.wallet().title,
    });
    this.bottomSheetService.onClose
      .pipe(
        take(1),
        map(() => this.bottomSheetService.outputData() as SheetOutput | null),
        filter((data): data is SheetOutput & { action: 'CONFIRM' } => !!data && data.action === 'CONFIRM'),
        exhaustMap(() => {
          return this.walletService.walletBnplClose().pipe(
            tap((res) => {
              if (res?.success) {
                this.navigationService.navigate([WALLET_BNPL_DETAIL_ROUTE, this.walletId()], {
                  state: {
                    walletName: this.wallet().title,
                    cancelResult: res.result,
                  },
                });
              }
            }),
          );
        }),
      )
      .subscribe();
  }

  private supperAppTransaction() {
    const action: RedirectAction = {
      type: ActionType.REDIRECT,
      payload: {
        url: 'transactions/report/history',
        state: { customLinkForBack: `mini-app/wealth/wallets/${this.walletId()}?referrer=wealth` },
        params: { type: '72,73' },
      },
    };
    this.actionHandlerService.handle(action);
  }

  actionHandler(id: string) {
    let activity: IUserActivity;
    if (id === 'BTN_DEPOSIT') {
      activity = {
        eventId: 'WW_Deposit',
        payloads: { walletId: this.walletId() || '' },
      };
      this.walletDeposit();
    } else if (id === 'BTN_WITHDRAW') {
      activity = {
        eventId: 'WW_Withdrawal',
        payloads: { walletId: this.walletId() || '' },
      };
      this.continueCashout();
    } else if (id === 'BTN_BNPL_REQUEST') {
      activity = {
        eventId: 'WW_Request',
        payloads: { walletId: this.walletId() || '' },
      };
      this.handleBnplRequest();
    } else {
      activity = {
        eventId: 'WW_Transaction',
        payloads: {
          redirect: 'supperApp-transactions',
          walletId: this.walletId() || '',
        },
      };
      this.supperAppTransaction();
    }
    this.userActivitiesService.action(activity).subscribe();
  }

  balanceDetaile() {
    this.bottomSheetService.openBottomSheet(
      WalletsBalanceSheetComponent,
      {
        wallets: this.wallet().wallets,
      },
      {
        noPadding: true,
      },
    );
  }

  swap() {
    const processData: ISwapDto = {
      action: 'start_journey',
      walletId: this.walletId(),
      activeSwap: true,
    };

    this.swapService.swapProcess(processData).subscribe();
  }

  private walletDeposit() {
    this.bottomSheetService.openBottomSheet(DepositToBottomSheetComponent, {
      wallets: this.wallet().wallets,
      walletId: this.wallet().id,
    });
  }

  private continueCashout() {
    this.bottomSheetService.openBottomSheet(WithdrowFromSheetComponent, {
      wallets: this.wallet().wallets,
      walletId: this.wallet().id,
    });
  }

  private getGoldPrice() {
    this.walletService.getWalletIndexValueStream('WALLET_GOLD').subscribe();
  }

  private handleBnplRequest(): void {
    const wlt: IWallet[] = this.wallet().wallets.map((wallet) => {
      return {
        ...wallet,
        bnplDescriptions:
          wallet.walletName === 'WALLET_FX'
            ? 'در این طرح معادل ۱۰۰٪ دارایی می‌توانید اعتبار اقساطی دریافت کنید.'
            : wallet.walletName === 'WALLET_GOLD'
              ? 'در این طرح معادل ۶۰٪ دارایی می‌توانید اعتبار اقساطی دریافت کنید.'
              : '',
      };
    });

    wlt.push({
      balance: 0,
      completeRegistrationHint: '',
      hasPendingTrade: false,
      hasTransactions: false,
      profit: {
        dailyPercentage: '0',
      },
      title: 'ترکیبی (طرح درامد ثابت + طرح طلا)',
      uncollectibleBalance: 0,
      walletLogo: '',
      walletName: 'WALLET_MIX',
      withdrawalBalance: 0,
      bnplDescriptions:
        'در این روش به پشتوانه مجموع دارایی خود می‌توانید اعتبار اقساطی دریافت کنید. (۱۰۰٪ دارایی طرح درامد ثابت + ۶۰٪ دارایی طرح طلا)',
    });
    this.bottomSheetService.openBottomSheet(GetCreditAsBottomSheetComponent, {
      wallets: wlt,
      walletId: this.wallet().id,
    });
  }

  tabOptions = computed<SegmentItemsModel[]>(() => {
    const opt = this.wallet().wallets.map((wallet) => {
      return {
        text: wallet.title,
        id: wallet.walletName,
        value: wallet.walletName,
        disable: wallet.balance <= 0,
      };
    });
    return opt;
  });

  openCampaignGuid() {
    this.navigationService.navigate([WALLET_GUIDS, 'campaign', this.walletId()]);
  }
}

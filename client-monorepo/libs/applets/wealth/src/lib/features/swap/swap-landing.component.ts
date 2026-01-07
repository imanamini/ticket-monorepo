import { finalize } from 'rxjs';
import { NgxIcon } from '@digipay/ngx-icon';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { SwapService } from './data-access/swap.service';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { FormFieldComponent } from '@digipay/ui-form-field-builder';
import { WALLETS_ROUTE } from '../../data-access/constants/app-routes';
import { PipesModule, SeparateThousandsPipe } from '@digipay/ng-lib-pipes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, RouteStateService } from '@client-monorepo/common/utilities';
import { EWalletActivation, ISwapDetail, ISwapDto, ISwapProcessData, ISwapWallet } from './models';
import { InvestmentSwapComponent } from './components/investment-swap/investment-swap.component';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { MaximumSwapBottomsheetComponent } from './components/maximum-swap-bottomsheet/maximum-swap-bottomsheet.component';
import { InvestmentSwapBottomsheetComponent } from './components/investment-swap-bottomsheet/investment-swap-bottomsheet.component';
import { AlertGoldPriceBottomsheetComponent } from './components/alert-gold-price-bottomsheet/alert-gold-price-bottomsheet.component';
import { SwapConfirmationBottomsheetComponent } from './components/swap-confirmation-bottomsheet/swap-confirmation-bottomsheet.component';
import { SwapActivationAlertBottomsheetComponent } from './components/swap-activation-alert-bottomsheet/swap-activation-alert-bottomsheet.component';
import { WalletService } from '../wallet/services/wallet.service';
import { IWalletProcess } from '../wallet/models/wallet-cashin-model.interface';
import { ProcessActionType } from '../wallet/models/process-action.type';
import { NgxBadgeModule } from '@digipay/ngx-badge';

@Component({
  selector: 'wealth-applet-swap-landing',
  standalone: true,
  imports: [
    NgxIcon,
    PipesModule,
    NgxButtonComponent,
    NgxAppBarComponent,
    FormFieldComponent,
    ReactiveFormsModule,
    InvestmentSwapComponent,
    NgxBadgeModule,
  ],
  templateUrl: './swap-landing.component.html',
  styleUrl: './swap-landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwapLandingComponent implements OnInit {
  private swapService = inject(SwapService);
  private walletService = inject(WalletService);
  private messageService = inject(MessageService);
  private activatedRoute = inject(ActivatedRoute);
  private bottomsheetService = inject(NgxBottomSheetService);
  private navigationService = inject(WealthNavigationService);
  private readonly routeState = inject(RouteStateService);
  private readonly separateThousands = new SeparateThousandsPipe();

  btnLoading = signal<boolean>(false);
  calculatedCommerssion = signal<number>(0);
  walletId = signal<string | undefined>(undefined);
  state = signal<ISwapProcessData | undefined>(undefined);
  swapOriginData = signal<ISwapWallet | undefined>(undefined);
  swapDestinationData = signal<ISwapWallet | undefined>(undefined);
  amountController = new FormControl('', { validators: [Validators.required] });
  swapAllAmount = signal<boolean>(false);
  amountValue = toSignal(this.amountController.valueChanges, { initialValue: this.amountController.value ?? '' });
  maxAmountError = computed(() => {
    return `حداکثر مبلغ قابل تبدیل ${this.separateThousands.transform(this.swapOriginData()?.maxAmount)} ریال است`;
  });
  minAmountError = computed(() => {
    return `حداقل مبلغ تبدیل  ${this.separateThousands.transform(this.swapOriginData().minAmount)} ریال است`;
  });

  swapDetails = computed<ISwapDetail[]>(() => {
    switch (this.swapOriginData().walletName) {
      case 'WALLET_FX':
        return [
          {
            title: 'کارمزد خرید طلا',
            isCommision: true,
            hasCommision: this.swapOriginData().hasCommission,
            commissionPercentage: this.swapOriginData().commissionPercentage,
          },
          {
            title: 'مبلغ تبدیل به طرح طلا',
            amount: Number(this.amountValue() ?? 0),
          },
        ];
      case 'WALLET_GOLD':
        return [
          {
            title: 'کارمزد فروش طرح طلا',
            isCommision: true,
            hasCommision: this.swapOriginData().hasCommission,
            commissionPercentage: this.swapOriginData().commissionPercentage,
          },
          {
            title: 'مجموع مبلغ کارمزد و تبدیل',
            amount: Number(this.amountValue() ?? 0) + this.calculatedCommerssion(),
          },
        ];
    }
  });

  ngOnInit(): void {
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    const processState: ISwapProcessData = this.routeState.getAll();
    if (!processState.walletId) {
      this.onBackHandler();
      return;
    }
    this.state.set(processState);
    this._setSwapData();
    this.amountController.valueChanges.subscribe((res) => {
      if (res) {
        this.calcCommission(+res);

        if (+res !== this.swapOriginData().maxAmount) {
          this.swapAllAmount.set(false);
        }
      }
    });
  }

  private _setSwapData() {
    const currentState = this.state();
    const wallets = currentState?.wallets ?? [];
    if (wallets.length < 2) {
      this.onBackHandler();
      return;
    }

    this.swapOriginData.set({ ...wallets[0], isOrigin: true });
    this.swapDestinationData.set({ ...wallets[1], isOrigin: false });
    this._setAmountValidators();
  }

  onBackHandler() {
    this.navigationService.navigate([WALLETS_ROUTE, this.walletId()]);
  }

  setMaximunValue() {
    this.amountController.setValue(Math.floor(this.swapOriginData().maxAmount).toString());
    this.swapAllAmount.set(true);
  }

  calcCommission(amount: number) {
    const currentState = this.state();
    if (!currentState || !Number.isFinite(amount)) {
      this.calculatedCommerssion.set(0);
      return;
    }
    const gross = Math.trunc((100 * amount) / (100 - this.swapOriginData().commissionPercentage));
    this.calculatedCommerssion.set(gross - amount);
  }

  continuSwap() {
    if (this._hasActivationRequest()) {
      this.activationAlert();
    } else {
      if (this.swapOriginData().walletName === 'WALLET_GOLD' && this.swapAllAmount()) {
        this.alertGoldPrice();
      } else {
        const anyInactiveWallet = this.state().wallets.some((x) => x.status === EWalletActivation.PolicyCreationPending);
        if (anyInactiveWallet) {
          this.messageService.showErrorMessage('طرح در حال فعال‌سازی است', 'لطفا تا فعال شدن طرح منتظر بمانید.');
        } else {
          this.callSwapApi();
        }
      }
    }
  }

  activeWallet(wallet: ISwapWallet) {
    const processData: IWalletProcess = {
      processData: this._generateProcessData(),
      walletName: wallet.walletName,
      action: 'start_journey',
      walletId: this.walletId(),
      activeSwap: true,
    };
    this.walletService.walletActivationProcess(processData).subscribe();
  }

  swapBottomsheet(type: 'destination' | 'origin') {
    const wallets = [this.swapOriginData(), this.swapDestinationData()].filter((wallet): wallet is ISwapWallet => !!wallet);
    const defaultWallet =
      wallets.find((wallet) => (type === 'origin' ? wallet.isOrigin === true : wallet.isOrigin === false))?.walletName ??
      wallets[0]?.walletName ??
      '';

    this.bottomsheetService.openBottomSheet(
      InvestmentSwapBottomsheetComponent,
      {
        data: {
          type,
          wallets,
          defaultWallet,
        },
      },
      {
        noPadding: true,
      },
    );

    const bottomSheet = this.bottomsheetService.onClose.subscribe(() => {
      bottomSheet.unsubscribe();
      const wallet: ISwapWallet = this.bottomsheetService.outputData();
      if (!wallet) return;
      if (wallet.activationRequired) {
        this.activeWallet(wallet);
      } else {
        this.updateSwapData(type, wallet.walletName);
      }
    });
  }

  maximumSwap(event?: Event) {
    this.bottomsheetService.openBottomSheet(
      MaximumSwapBottomsheetComponent,
      {},
      {
        noPadding: true,
      },
    );
    event?.stopPropagation();
    event?.stopImmediatePropagation();
  }

  private _hasActivationRequest() {
    return this.swapOriginData().activationRequired || this.swapDestinationData().activationRequired;
  }

  private activationAlert() {
    this.bottomsheetService.openBottomSheet(
      SwapActivationAlertBottomsheetComponent,
      {},
      {
        noPadding: true,
      },
    );
    const bottomSheet = this.bottomsheetService.onClose.subscribe(() => {
      bottomSheet.unsubscribe();
    });
  }

  private continueBottomsheet() {
    this.bottomsheetService.openBottomSheet(
      SwapConfirmationBottomsheetComponent,
      {
        data: {
          origin: this.swapOriginData().walletName,
          destination: this.swapDestinationData().walletName,
        },
      },
      {
        noPadding: true,
      },
    );

    const bottomSheet = this.bottomsheetService.onClose.subscribe(() => {
      const result = this.bottomsheetService.outputData();
      if (result === 'continue') {
        this.callSwapApi('confirmed');
      }

      bottomSheet.unsubscribe();
    });
  }

  private alertGoldPrice() {
    this.bottomsheetService.openBottomSheet(
      AlertGoldPriceBottomsheetComponent,
      {},
      {
        noPadding: true,
      },
    );
    const bottomSheet = this.bottomsheetService.onClose.subscribe(() => {
      const result = this.bottomsheetService.outputData();
      if (result === 'continue') {
        this.callSwapApi();
      }

      bottomSheet.unsubscribe();
    });
  }

  private updateSwapData(type: 'destination' | 'origin', selectedWallet?: string) {
    if (!selectedWallet) {
      return;
    }

    const originWalletName = type === 'origin' ? selectedWallet : this.getOppositeWallet(selectedWallet);
    const destinationWalletName = this.getOppositeWallet(originWalletName);

    this.swapOriginData.set({ ...this.state().wallets.find((x) => x.walletName === originWalletName), isOrigin: true });
    this.swapDestinationData.set({ ...this.state().wallets.find((x) => x.walletName === destinationWalletName), isOrigin: false });
    this.amountController.setValue('');
    this._setAmountValidators();
    this.calcCommission(0);
  }

  private getOppositeWallet(walletName: string): 'WALLET_FX' | 'WALLET_GOLD' {
    return walletName === 'WALLET_FX' ? 'WALLET_GOLD' : 'WALLET_FX';
  }

  private callSwapApi(action?: ProcessActionType) {
    this.btnLoading.set(true);
    const processData = this._generateProcessData();
    action === 'confirmed' ? (processData.action = 'confirmed') : null;
    this.swapService
      .swapProcess(processData)
      .pipe(finalize(() => this.btnLoading.set(false)))
      .subscribe((res) => {
        if (res.success && res.result.action.toLowerCase() === 'error') {
          this.messageService.showErrorMessage(res.result.data.message);
        } else if (res.success && res.result.action.toLowerCase() === 'bottomsheet') {
          this.continueBottomsheet();
        }
      });
  }

  private _generateProcessData(): ISwapDto {
    const processState = this.state();
    const apiUrl = processState?.coordinatorAction;
    const originWallet = this.swapOriginData();
    const destinationWallet = this.swapDestinationData();

    if (!apiUrl || !originWallet || !destinationWallet) {
      return;
    }

    const processData: ISwapDto = {
      walletId: this.walletId(),
      amount: +this.amountController.value,
      source: this.swapOriginData().walletName,
      destination: this.swapDestinationData().walletName,
      swapAllAmount: this.swapAllAmount(),
    };

    return processData;
  }

  private _setAmountValidators() {
    const originWallet = this.swapOriginData();
    if (!originWallet) {
      return;
    }

    this.amountController.setValidators([
      Validators.required,
      Validators.min(originWallet.minAmount),
      Validators.max(originWallet.walletSwapableBalance),
    ]);
    this.amountController.updateValueAndValidity({ emitEvent: false });
  }
}

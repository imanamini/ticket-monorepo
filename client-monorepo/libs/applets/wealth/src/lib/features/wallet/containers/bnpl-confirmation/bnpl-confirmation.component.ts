import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import {
  PROSPECTUS_ROUTE,
  WALLET_BNPL_RECHARGE,
  WALLET_DEBT_NOTICE_ROUTE,
  WALLET_FX_BNPL,
  WALLET_GOLD_BNPL,
  WALLET_MIX_BNPL,
  WALLETS_ROUTE,
} from '../../../../data-access/constants/app-routes';
import { ActivatedRoute } from '@angular/router';
import { MessageService, RouteStateService } from '@client-monorepo/common/utilities';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { WALLET_COORDINATOR_PROCESS_API } from '../../../../data-access/constants/api';
import { IProcessData, IWalletProcessData } from '../../models/wallet-process.interface';
import { WalletService } from '../../services/wallet.service';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxAlert } from '@digipay/ngx-alert';
import { IConfirmMetadata } from '../../models/bnpl-confirmation.interface';
import { EpdfType } from '../../../../components/core/models/instruments.enum';
import { IProspectusRouteState } from '../../../../components/core/models/prospectus-route-state.interface';
import { GoldPriceNotifireComponent } from '../../components/gold-price-notifire/gold-price-notifire.component';
import { IGoldPricePublisher } from '../../models/gold-price-publisher.interface';

@Component({
  selector: 'wealth-applet-bnpl-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    NgxButtonComponent,
    NgxCalloutComponent,
    NgxDividerComponent,
    NgxIcon,
    NgxAppBarComponent,
    PipesModule,
    NgxAlert,
    GoldPriceNotifireComponent,
  ],
  templateUrl: './bnpl-confirmation.component.html',
  styleUrl: './bnpl-confirmation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BnplConfirmationComponent implements OnInit {
  btnLoading = signal<boolean>(false);
  walletId = signal<string | undefined>(undefined);
  state = signal<IProcessData | undefined>(undefined);
  agreementChecked = signal<boolean>(false);

  pageTitle = computed(() => {
    return this.state().rechargeAmount ? 'بررسی مبلغ اعتبار و افزایش موجودی ' : 'بررسی مبلغ اعتبار';
  });

  protected readonly BorderColorsEnum = BorderColorsEnum;
  protected readonly pdfType = EpdfType;

  private walletService = inject(WalletService);
  private messageService = inject(MessageService);
  private activatedRoute = inject(ActivatedRoute);
  private navigationService = inject(WealthNavigationService);
  private routeState = inject(RouteStateService);
  goldPricePublisher = toSignal<IGoldPricePublisher | null>(this.walletService.goldPricingPublisher$, {
    initialValue: null,
  });

  bnplMetadata = computed(() => {
    const metadata: IConfirmMetadata[] = [
      {
        title: 'اعتبار 4 قسطه',
        value: this.state()?.bnplAmount,
        type: 'amount',
        isCommerssion: false,
      },
    ];

    if (this.state().walletName === 'WALLET_FX' || this.state().walletName === 'WALLET_MIX') {
      metadata.push({
        title: 'موجودی طرح درامد ثابت',
        value: this.state().balance || this.state().fxBalance,
        type: 'amount',
        isCommerssion: false,
      });
    }

    if (this.state().walletName === 'WALLET_GOLD' || this.state().walletName === 'WALLET_MIX') {
      const goldPublisher = this.goldPricePublisher();
      metadata.push({
        title: 'موجودی طرح طلا',
        value: goldPublisher?.balance || 0,
        type: 'amount',
        isCommerssion: false,
      });
    }

    if (this.state()?.commission) {
      metadata.push({
        title: 'کارمزد',
        value: this.state()?.commission,
        type: 'amount',
        isCommerssion: true,
      });
    }

    metadata.push({
      title: 'مبلغ افزایش موجودی',
      ...(this.state().rechargeWallet ? { subTitle: this.state().rechargeWallet === 'WALLET_GOLD' ? 'طرح طلا' : 'طرح درامد ثابت' } : {}),
      value: this.state().rechargeAmount,
      type: 'amount',
      isCommerssion: false,
    });

    return metadata;
  });

  ngOnInit() {
    const processState = this.routeState.getAll();
    this.state.set(processState);
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    this.agreementChecked.set(processState.agreementChecked);

    if (!processState.walletName) {
      this.onBackHandler();
    }
  }

  onBackHandler() {
    let route = WALLETS_ROUTE;
    const processState = this.routeState.getAll();
    if (processState.action === 'confirmed_debt_hint') {
      route = WALLET_DEBT_NOTICE_ROUTE;
    } else {
      switch (processState.walletName) {
        case 'WALLET_FX':
          route = WALLET_FX_BNPL;
          break;
        case 'WALLET_GOLD':
          route = WALLET_GOLD_BNPL;
          break;
        case 'WALLET_MIX':
          route = processState.rechargeAmount > 0 ? WALLET_BNPL_RECHARGE : WALLET_MIX_BNPL;
          break;
        default:
          route = WALLETS_ROUTE;
          break;
      }
    }
    this.navigationService.navigate([route, this.walletId()], {
      state: {
        ...processState,
      },
    });
  }

  agreementView(pdfType: EpdfType) {
    const state: IProspectusRouteState = {
      pdfType,
      symbol: this.walletId(),
      backToProfile: false,
      ...this.state(),
      type: 'bnpl_confirmation',
      agreementChecked: this.agreementChecked(),
    };

    this.navigationService.navigateWithState([PROSPECTUS_ROUTE], {
      state: state,
    });
  }

  continue() {
    this.btnLoading.set(true);

    const processData: IWalletProcessData = {
      action: 'confirmed',
      data: {
        walletName: this.state().walletName,
        amount: this.state().amount.toString(),
        walletId: this.walletId(),
        ...(this.state().confirmedDebtHint ? { confirmedDebtHint: true } : {}),
        ...(this.state().rechargeWallet ? { rechargeWallet: this.state().rechargeWallet } : {}),
      },
    };
    this.walletService.walletProcess(WALLET_COORDINATOR_PROCESS_API, processData).subscribe((res) => {
      if (res.result.action === 'error') {
        this.messageService.showErrorMessage(res.result.data.message);
      }
      this.btnLoading.set(false);
    });
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { PROSPECTUS_ROUTE, WALLET_MIX_BNPL } from '../../../../data-access/constants/app-routes';
import { ActivatedRoute } from '@angular/router';
import { IProcessData, IWalletProcessData } from '../../models/wallet-process.interface';
import { MessageService, RouteStateService } from '@client-monorepo/common/utilities';
import { NgxRadioButtonComponent } from '@digipay/ngx-radio-button';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { BorderColorsEnum } from '@digipay/ngx-divider';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { tap, catchError, EMPTY, finalize } from 'rxjs';
import { WALLET_COORDINATOR_PROCESS_API } from '../../../../data-access/constants/api';
import { WalletService } from '../../services/wallet.service';
import { EpdfType } from '../../../../components/core/models/instruments.enum';
import { IProspectusRouteState } from '../../../../components/core/models/prospectus-route-state.interface';
import { GoldPriceNotifireComponent } from '../../components/gold-price-notifire/gold-price-notifire.component';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';

@Component({
  selector: 'wealth-applet-bnpl-recharge',
  standalone: true,
  imports: [
    CommonModule,
    NgxAppBarComponent,
    NgxRadioButtonComponent,
    PipesModule,
    NgxBadgeModule,
    NgxButtonComponent,
    GoldPriceNotifireComponent,
    NgxTooltipDirective,
  ],
  templateUrl: './bnpl-recharge.component.html',
  styleUrl: './bnpl-recharge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BnplRechargeComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly walletId = signal<string | undefined>(undefined);
  private readonly navigationService = inject(WealthNavigationService);
  private readonly routeState = inject(RouteStateService);
  protected readonly BorderColorsEnum = BorderColorsEnum;
  private walletService = inject(WalletService);
  private messageService = inject(MessageService);
  protected readonly pdfType = EpdfType;

  state = signal<IProcessData | undefined>(undefined);
  wallets = computed<IWalletRecharge[]>(() => {
    return [
      {
        walletName: 'WALLET_FX',
        walletTitle: 'طرح درامد ثابت',
        rechargeAmount: this.state()?.fxRechargeAmount,
        commission: this.state()?.fxCommission,
        hasCommission: this.state()?.hasFxCommission,
      },
      {
        walletName: 'WALLET_GOLD',
        walletTitle: 'طرح طلا ',
        rechargeAmount: this.state()?.goldRechargeAmount,
        commission: this.state()?.goldCommission,
        hasCommission: this.state()?.hasGoldCommission,
      },
    ];
  });
  selectedOption = signal<string>('');
  btnLoading = signal<boolean>(false);
  agreementChecked = signal<boolean>(false);

  ngOnInit(): void {
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    const processState = this.routeState.getAll();
    if (!processState?.walletName) {
      this.onBackHandler();
      return;
    }
    this.state.set(processState);
    this.selectedOption.set(processState.selectedOption || 'WALLET_FX');
    this.agreementChecked.set(processState.agreementChecked);
  }

  onBackHandler() {
    this.navigationService.navigate([WALLET_MIX_BNPL, this.walletId()], {
      state: this.state(),
    });
  }

  onContinue() {
    this.btnLoading.set(true);
    const processData: IWalletProcessData = {
      data: {
        walletName: this.state().walletName,
        walletId: this.walletId(),
        rechargeWallet: this.selectedOption(),
        amount: this.state().amount,
      },
    };

    this.walletService
      .walletProcess(WALLET_COORDINATOR_PROCESS_API, processData)
      .pipe(
        tap((res) => {
          if (res.result.action === 'error') {
            this.messageService.showErrorMessage(res.result.data.message);
          }
        }),
        catchError(() => EMPTY),
        finalize(() => this.btnLoading.set(false)),
      )
      .subscribe();
  }

  onToggleAgreement(val: any) {
    this.agreementChecked.set(val);
  }

  agreementView(pdfType: EpdfType) {
    const state: IProspectusRouteState = {
      pdfType,
      symbol: this.walletId(),
      backToProfile: false,
      ...this.state(),
      type: 'bnplRecharge',
      selectedOption: this.selectedOption(),
      agreementChecked: this.agreementChecked(),
    };

    this.navigationService.navigateWithState([PROSPECTUS_ROUTE], {
      state: state,
    });
  }
}

export interface IWalletRecharge {
  walletName: string;
  commission: number;
  walletTitle: string;
  rechargeAmount: number;
  hasCommission: boolean;
}

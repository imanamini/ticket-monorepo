import { NgxIcon } from '@digipay/ngx-icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { WalletService } from '../../services/wallet.service';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { WALLET_WITHDROW_PROCESS_API } from '../../../../data-access/constants/api';
import { MessageService, RouteStateService } from '@client-monorepo/common/utilities';
import { SELECT_BANK_ACCOUNT_ROUTE } from '../../../../data-access/constants/app-routes';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { IProcessData, IWalletProcessData } from '../../models/wallet-process.interface';

@Component({
  selector: 'wealth-applet-withdrow-from-fx-wallet-confirmation',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, NgxCalloutComponent, NgxDividerComponent, PipesModule, NgxAppBarComponent, NgxIcon],
  templateUrl: './withdrow-from-fx-wallet-confirmation.component.html',
  styleUrl: './withdrow-from-fx-wallet-confirmation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrowFromFxWalletConfirmationComponent implements OnInit {
  btnLoading = signal<boolean>(false);
  walletId = signal<string | undefined>(undefined);
  state = signal<IProcessData | undefined>(undefined);

  protected readonly BorderColorsEnum = BorderColorsEnum;

  private walletService = inject(WalletService);
  private messageService = inject(MessageService);
  private activatedRoute = inject(ActivatedRoute);
  private navigationService = inject(WealthNavigationService);
  private routeState = inject(RouteStateService);

  withdrawMetadata = computed(() => {
    const metadata = [
      {
        title: 'فروش',
        value: this.state()?.walletTitle,
        type: 'text',
      },
      {
        title: 'مبلغ فروش',
        value: this.state()?.withdrawAmount,
        type: 'amount',
      },
    ];

    if (this.state()?.commission) {
      metadata.push({
        title: 'کارمزد',
        value: this.state()?.commission,
        type: 'commission',
      });
    }

    return metadata;
  });

  ngOnInit() {
    this.state.set(this.routeState.getAll());
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    if (!this.state().walletTitle) {
      this.onBackHandler();
    }
  }

  onBackHandler() {
    this.navigationService.navigate([SELECT_BANK_ACCOUNT_ROUTE, this.walletId()], {
      state: this.state(),
    });
  }

  continue() {
    this.btnLoading.set(true);
    const processData: IWalletProcessData = {
      action: 'confirmed',
      data: {
        walletName: this.state().walletName,
        walletId: this.walletId(),
        amount: this.state().amount,
        shebaNumberId: this.state().shebaNumberId,
        withdrawAll: this.state().withdrawAll,
      },
    };

    this.walletService.walletProcess(WALLET_WITHDROW_PROCESS_API, processData).subscribe((res) => {
      if (res.success && (res.result.action === 'error' || res.result.action === 'snackbar')) {
        this.messageService.showErrorMessage(res.result.data.message || res.result.data.title, res.result.data.description || '');
      }
      this.btnLoading.set(false);
    });
  }
}

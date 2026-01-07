import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { ActivatedRoute } from '@angular/router';
import { RESULT_ROUTE, WALLET_BNPL_REQUEST_ROUTE } from '../../../../data-access/constants/app-routes';
import { NgxIcon } from '@digipay/ngx-icon';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { MessageService, RouteStateService } from '@client-monorepo/common/utilities';
import { IWalletProcessData, IWalletProcessState } from '../../models/wallet-process.interface';
import { WALLET_COORDINATOR_PROCESS_API } from '../../../../data-access/constants/api';
import { WalletService } from '../../services/wallet.service';
import { ErrorService } from '../../../../components/core/services/error.service';
import { NgxAlert } from '@digipay/ngx-alert';

@Component({
  selector: 'wealth-applet-wallet-bnpl-payment-detail',
  standalone: true,
  imports: [CommonModule, NgxAppBarComponent, NgxIcon, PipesModule, NgxDividerComponent, NgxCalloutComponent, NgxButtonComponent, NgxAlert],
  templateUrl: './wallet-bnpl-payment-detail.component.html',
  styleUrl: './wallet-bnpl-payment-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletBnplPaymentDetailComponent implements OnInit {
  private routeState = inject(RouteStateService);
  private activatedRoute = inject(ActivatedRoute);
  private walletService = inject(WalletService);
  private errorService = inject(ErrorService);
  private navigationService = inject(WealthNavigationService);
  state = signal<IWalletProcessState | undefined>(undefined);
  walletId = signal<string | undefined>(undefined);
  details = signal<{ title: string; value: number }[]>([]);
  messages = signal<string[]>([
    'موجودی شما متناسب با اعتبار درخواستی مسدود خواهد شد.',
    'در صورت داشتن اقساط پرداخت نشده، درخواست اعتبار شما رد خواهد شد.',
    'به موجودی مسدود شده نیز سود تعلق می‌گیرد.',
    'اعتبار دریافتی بدون کارمزد است.',
  ]);

  needToPay = signal<boolean>(false);
  isLoading = signal<boolean>(true);
  loadingProcess = signal<boolean>(false);

  messageService = inject(MessageService);

  protected readonly BorderColorsEnum = BorderColorsEnum;

  ngOnInit(): void {
    this.checkExpiredData();
  }

  onBackHandler() {
    this.navigationService.navigate([WALLET_BNPL_REQUEST_ROUTE, this.activatedRoute.snapshot.paramMap.get('id')], {
      state: this.state(),
    });
  }

  continue() {
    this.loadingProcess.set(true);
    const processData: IWalletProcessData = {
      action: 'confirmed',
      data: {
        walletName: this.state().walletName,
        planId: this.state().planId,
        amount: this.state().amount.toString(),
        walletId: this.walletId(),
        ...(this.state().confirmedDebtHint ? { confirmedDebtHint: true } : {}),
      },
    };
    this.walletService.walletProcess(WALLET_COORDINATOR_PROCESS_API, processData).subscribe((res) => {
      if (res.result.action === 'error') {
        this.messageService.showErrorMessage(res.result.data.message);
      }
      this.loadingProcess.set(false);
    });
  }

  private checkExpiredData() {
    if (this.activatedRoute.snapshot.queryParams['expired']) {
      this.errorService.setErrorPageExpired(false);
      this.navigationService.navigate([RESULT_ROUTE], {
        queryParams: {
          expired: true,
        },
      });
      return;
    } else {
      this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
      this.state.set(this.routeState.getAll());
      if (!this.state().walletName) {
        this.onBackHandler();
      } else {
        this.details.set([
          {
            title: 'مجموع اعتبار ۴ قسطه',
            value: this.state().bnplAmount,
          },
          ...(this.state().unsecureAmount > 0
            ? [
                {
                  title: 'اعتبار خوش حسابی',
                  value: this.state().unsecureAmount,
                },
              ]
            : []),
          {
            title: 'موجودی کیف ثروت',
            value: this.state().walletWithdrawableBalance,
          },
          {
            title: 'نیاز به افزایش موجودی',
            value: this.state().rechargeableAmount,
          },
        ]);
        this.needToPay.set(!!this.state().rechargeableAmount);
      }
    }
    this.isLoading.set(false);
  }
}

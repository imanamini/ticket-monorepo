import { NgxIcon } from '@digipay/ngx-icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { WalletService } from '../wallet/services/wallet.service';
import { IQuickPaymentState, PaymentMethodStatus } from './models';
import { NgxRadioButtonComponent } from '@digipay/ngx-radio-button';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { IDepositReview } from '../wallet/models/deposit-review.interface';
import { WALLET_DEPOSIT_PROCESS_API } from '../../data-access/constants/api';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { WALLET_FX_DEPOSIT, WALLET_GOLD_DEPOSIT } from '../../data-access/constants/app-routes';
import { UserActivitiesService } from '../../shared/services/activities/user-activities.service';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { AppBarWrapperComponent } from '../../components/core/components/app-bar-wrapper/app-bar-wrapper.component';
import { IWalletProcessData } from '../wallet/models/wallet-process.interface';

@Component({
  selector: 'wealth-applet-quick-payment',
  standalone: true,
  imports: [
    CommonModule,
    AppBarWrapperComponent,
    NgxIcon,
    NgxDividerComponent,
    PipesModule,
    NgxDividerComponent,
    NgxButtonComponent,
    NgxBadgeModule,
    NgxRadioButtonComponent,
  ],
  templateUrl: './quick-payment.component.html',
  styleUrl: './quick-payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickPaymentComponent implements OnInit {
  readonly BorderColorsEnum = BorderColorsEnum;
  private walletService = inject(WalletService);
  private activatedRoute = inject(ActivatedRoute);
  readonly PaymentMethodStatus = PaymentMethodStatus;
  private walletId = signal<string | undefined>(undefined);
  private navigationService = inject(WealthNavigationService);
  private routeState = inject(RouteStateService);
  private userActivitiesService = inject(UserActivitiesService);

  btnLoading = signal<boolean>(false);
  state = signal<IDepositReview | undefined>(undefined);
  selectedMethod = signal<string | undefined>(undefined);
  metadata = computed(() => {
    return [
      {
        title: 'خرید',
        value: `${this.state().walletTitle} کیف ثروت`,
        type: 'text',
      },
      {
        title: 'مبلغ',
        type: 'amount',
        value: this.state().amount,
      },
    ];
  });
  readonly quickPaymentItems = computed<IQuickPaymentState[]>(() => {
    const methods = this.state().methods ?? [];

    return methods
      .map((item) => ({
        ...item,
        ...this.getMethodUi(item.name),
      }))
      .slice()
      .sort((a, b) => a.order - b.order);
  });
  readonly availableMethods = computed(() => this.quickPaymentItems().filter((x) => x.status === PaymentMethodStatus.Available));
  readonly firstAvailableMethod = computed(() => this.availableMethods()[0] ?? null);
  readonly selectedMethodName = computed<string | null>(() => {
    return this.selectedMethod() ?? this.firstAvailableMethod()?.name ?? null;
  });
  readonly selectedMethodItem = computed<IQuickPaymentState | null>(() => {
    const name = this.selectedMethodName();
    if (!name) return null;
    return this.quickPaymentItems().find((x) => x.name === name) ?? null;
  });
  readonly calculatedCommission = computed(() => {
    const method = this.selectedMethodItem();
    const amount = Number(this.state().amount ?? 0);

    if (!method) return 0;
    return (method.commissionPercentage * amount) / 100;
  });
  readonly calculatedPayableAmount = computed(() => {
    return this.calculatedCommission() + Number(this.state().payableAmount ?? 0);
  });
  readonly availableAnyMethod = computed(() => this.availableMethods().length > 0);

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    if (!this.state().walletId) {
      this.onBackHandler();
      return;
    }

    const activity = {
      eventId: 'pay-getways-load-' + this.walletId(),
      payloads: {},
    };
    this.userActivitiesService.action(activity).subscribe();
  }

  private getMethodUi(name: string): Pick<IQuickPaymentState, 'iconName' | 'title' | 'type' | 'description'> {
    switch (name) {
      case 'Icp':
        return {
          iconName: 'bank-card',
          title: 'درگاه پرداخت اینترنتی (بدون کارمزد)',
          type: 'text',
          description: 'پرداخت آنلاین با تمامی کارت‌های بانکی',
        };

      case 'Credit':
        return {
          iconName: 'credit',
          title: 'وام (با کارمزد خرید اعتباری)',
          type: 'amount',
        };

      default:
        return {
          iconName: 'bnpl',
          title: 'اعتبار ۴ قسطه (با کارمزد خرید اعتباری)',
          type: 'amount',
        };
    }
  }

  onBackHandler() {
    const depositRoute = this.state().walletName === 'WALLET_GOLD' ? WALLET_GOLD_DEPOSIT : WALLET_FX_DEPOSIT;
    this.navigationService.navigate([depositRoute, this.walletId()], {
      state: {
        ...this.state(),
      },
    });
  }

  continue() {
    this.btnLoading.set(true);
    const processData: IWalletProcessData = {
      action: 'confirmed',
      data: {
        walletId: this.walletId(),
        amount: this.state().amount,
        walletName: this.state().walletName,
        paymentMethod: this.selectedMethodName(),
      },
    };

    const activity = {
      eventId: 'pay-getways-start-' + this.selectedMethod(),
      payloads: {},
    };
    this.userActivitiesService
      .action(activity)
      .pipe(
        catchError(() => of(null)),
        switchMap(() => this.walletService.walletProcess(WALLET_DEPOSIT_PROCESS_API, processData)),
        finalize(() => this.btnLoading.set(false)),
      )
      .subscribe();
  }
}

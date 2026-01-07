import { NgxIcon } from '@digipay/ngx-icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { ISwapResultState } from '../../models/swap-result-state.interface';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { WALLETS_ROUTE } from '../../../../data-access/constants/app-routes';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActionHandlerService, ActionType, RedirectAction } from '@client-monorepo/common/action-handler';

@Component({
  selector: 'wealth-applet-swap-result',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, NgxAppBarComponent, NgxIcon],
  templateUrl: './swap-result.component.html',
  styleUrl: './swap-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwapResultComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private readonly routeState = inject(RouteStateService);
  private navigationService = inject(WealthNavigationService);
  private actionHandlerService = inject(ActionHandlerService);

  walletId = signal<string | undefined>(undefined);
  state = signal<ISwapResultState | undefined>(undefined);
  swapTitle = computed(() => {
    return this.state().status ? 'دارایی شما تبدیل شد' : 'دارایی شما تبدیل نشد';
  });
  swapDescription = computed(() => {
    return this.state().status
      ? 'می‌توانید دارایی خود را در کیف ثروت مشاهده کنید.'
      : 'سرویس دهنده در دسترس نیست. لطفا دقایقی دیگر دوباره تلاش کنید.';
  });

  ngOnInit(): void {
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    this.state.set(this.routeState.getAll());
  }

  onBackHandler() {
    this.navigationService.navigate([WALLETS_ROUTE, this.walletId()]);
  }

  supperAppTransactions() {
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
}

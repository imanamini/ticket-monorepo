import { NgxIcon } from '@digipay/ngx-icon';
import { CommonModule } from '@angular/common';
import { ISwapDto, ISwapProcessData } from '../../models';
import { ActivatedRoute } from '@angular/router';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { MessageService, RouteStateService } from '@client-monorepo/common/utilities';
import { WalletBalancesMapper } from '../../utils/swap-detail-mapper';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { WALLETS_ROUTE } from '../../../../data-access/constants/app-routes';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ReceivedCreditComponent } from '../../components/received-credit/received-credit.component';
import { SwapConfirmationDetailComponent } from '../../components/swap-confirmation-detail/swap-confirmation-detail.component';
import { SwapService } from '../../data-access/swap.service';
import { finalize } from 'rxjs';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { SwapConfirmationBottomsheetComponent } from '../../components/swap-confirmation-bottomsheet/swap-confirmation-bottomsheet.component';

@Component({
  selector: 'wealth-applet-confirm-swap',
  standalone: true,
  imports: [
    CommonModule,
    NgxButtonComponent,
    NgxAppBarComponent,
    ReceivedCreditComponent,
    PipesModule,
    SwapConfirmationDetailComponent,
    NgxIcon,
  ],
  templateUrl: './confirm-swap.component.html',
  styleUrl: './confirm-swap.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmSwapComponent implements OnInit {
  private _activatedRoute = inject(ActivatedRoute);
  private readonly _routeState = inject(RouteStateService);
  private _navigationService = inject(WealthNavigationService);
  private _swapService = inject(SwapService);
  private _messageService = inject(MessageService);
  private _bottomsheetService = inject(NgxBottomSheetService);

  state = signal<ISwapProcessData | undefined>(undefined);
  btnLoading = signal<boolean>(false);
  walletId = signal<string | undefined>(undefined);

  currentDetail = computed(() => {
    return WalletBalancesMapper.toSummary(this.state().current);
  });

  subsequentDetail = computed(() => {
    return WalletBalancesMapper.toSummary(this.state().subsequent);
  });

  ngOnInit(): void {
    this.walletId.set(this._activatedRoute.snapshot.paramMap.get('id'));
    const processState: ISwapProcessData = this._routeState.getAll();
    if (!processState.walletId) {
      this.onBackHandler();
      return;
    }
    this.state.set(processState);
  }

  onBackHandler() {
    this._navigationService.navigate([WALLETS_ROUTE, this.walletId()]);
  }

  private _continuSwap() {
    this.btnLoading.set(true);
    const processData: ISwapDto = {
      action: 'confirmed',
      walletId: this.walletId(),
      ...this.state(),
    };
    this._swapService
      .swapProcess(processData)
      .pipe(finalize(() => this.btnLoading.set(false)))
      .subscribe((res) => {
        if (res.success && res.result.action.toLowerCase() === 'error') {
          this._messageService.showErrorMessage(res.result.data.message);
        }
      });
  }

  continueBottomsheet() {
    const currentState = this.state();

    this._bottomsheetService.openBottomSheet(
      SwapConfirmationBottomsheetComponent,
      {
        data: {
          origin: currentState.source,
          destination: currentState.destination,
        },
      },
      {
        noPadding: true,
      },
    );

    const bottomSheet = this._bottomsheetService.onClose.subscribe(() => {
      const result = this._bottomsheetService.outputData();
      if (result === 'continue') {
        this._continuSwap();
      } else {
        this.btnLoading.set(false);
      }

      bottomSheet.unsubscribe();
    });
  }
}

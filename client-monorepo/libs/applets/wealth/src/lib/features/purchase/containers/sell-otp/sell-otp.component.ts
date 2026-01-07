import { takeUntil } from 'rxjs';
import { PurchaseService } from '../../services/purchase-service.service';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../components/core/components/base/base.component';
import { ResponseError } from '../../../../data-access/models/response-error.model';
import { ErrorCodes } from '../../../../data-access/enums/error-codes';
import { INVESTMENT_LIST_ROUTE, RESULT_ROUTE, SELL_ROUTE } from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { MessageService, RouteStateService } from '@client-monorepo/common/utilities';
import { NgxCountDownComponent } from '@digipay/ngx-count-down';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PinInputComponent } from '../../../../shared/components/pin-input/pin-input.component';

@Component({
  selector: 'app-sell-otp',
  templateUrl: './sell-otp.component.html',
  styleUrls: ['./sell-otp.component.scss'],
  standalone: true,
  imports: [NgxAppBarComponent, NgxCountDownComponent, NgxButtonComponent, PinInputComponent],
})
export class SellOtpComponent extends BaseComponent implements OnInit {
  inProgress = true;
  otp = '';
  hasError = false;
  isLoading = false;
  otpSeconds = 120;
  state:
    | {
        symbol?: string;
        unit?: number;
        amount?: number;
        cardTitle?: string;
        providerName?: string;
        type?: string;
      }
    | undefined;
  errorInfo: ResponseError | null = null;
  timeIsOver: boolean;
  navigationService = inject(WealthNavigationService);
  routeState = inject(RouteStateService);
  private cdr = inject(ChangeDetectorRef);
  private purchaseService = inject(PurchaseService);
  private messageService = inject(MessageService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.state = this.routeState.getAll();
  }

  private getOtp() {
    if (this.state?.symbol) {
      this.purchaseService
        .sellOrder({
          symbol: this.state.symbol,
          instrumentUnit: +this.state.unit,
        })
        .subscribe((res) => {
          if (res?.success) {
            this.reInitializeTimer(120);
          } else {
            if (res && res.error && res.error.title) {
              this.messageService.showErrorMessage(res.error.title);
            }
          }
        });
    } else {
      this.navigationService.navigate([INVESTMENT_LIST_ROUTE]);
    }
  }

  onChanged(val: string) {
    this.hasError = false;
    this.otp = val;
  }

  createSellOrder() {
    if (this.state?.symbol && this.state?.amount) {
      this.isLoading = true;
      this.purchaseService
        .sellOrder({
          symbol: this.state.symbol,
          instrumentUnit: +this.state.unit,
          otp: +this.otp,
        })
        .pipe(takeUntil(this.destroyObservable))
        .subscribe((res) => {
          if (res?.success) {
            this.navigationService.navigate([RESULT_ROUTE], {
              queryParams: {
                isSuccess: res.result.orderStatus.toLowerCase() === 'succeed' ? 'true' : 'false',
                action: 'sell',
                receiptNumber: res.result.remoteOrderId,
                instrumentName: res.result.instrumentName,
                instrumentSymbol: res && res.result && res.result.instrumentSymbol,
              },
            });
          } else {
            if (res?.error?.code) {
              if (res && res.error && res.error.title) {
                this.messageService.showErrorMessage(res.error.title);
              }
              if (res?.error?.code === ErrorCodes.rayanTooManyRequest) {
                this.otpSeconds = 300;
                this.reInitializeTimer(this.otpSeconds);
              }
            } else {
              this.navigationService.navigate([INVESTMENT_LIST_ROUTE]);
            }
          }
          this.isLoading = false;
        });
    } else {
      this.isLoading = false;
      this.navigationService.navigate([INVESTMENT_LIST_ROUTE]);
    }
  }

  resend() {
    if (!this.inProgress) {
      this.getOtp();
    }
  }

  onTimerStopped() {
    this.inProgress = false;
    this.timeIsOver = true;
  }

  onBackHandler() {
    this.navigationService.navigateWithState([SELL_ROUTE, this.state?.symbol], {
      state: this.state,
    });
  }

  private reInitializeTimer(sec: number) {
    this.timeIsOver = true;
    setTimeout(() => {
      this.timeIsOver = false;
      this.inProgress = true;
      this.otpSeconds = sec;
      this.cdr.detectChanges();
    }, 0);
  }
}

import {
  PROVIDER_NOT_AVAILABLE_ROUTE,
  CAMPAIGN_AGREEMENT_ROUTE,
  COLLATERAL_ROUTE,
  HOME_ROUTE,
} from '../../../../data-access/constants/app-routes';
import { ICompaignState } from '../../models';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxCountDownComponent } from '@digipay/ngx-count-down';
import { NgxOtpComponent, NgxOtpStatus } from '@digipay/ngx-otp';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { COLLATERAL_PAGE_ROUTE_MAP, IProcessData } from '../../../collateral/data-access/models';
import { CampaignService } from '../../../../components/core/services/v1/campaign.service';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CollateralService } from '../../../collateral/data-access/services/collateral.service';

@Component({
  selector: 'app-otp',
  templateUrl: './campaign-otp.component.html',
  styleUrls: ['./campaign-otp.component.scss'],
  standalone: true,
  imports: [NgxButtonComponent, NgxAppBarComponent, NgxCountDownComponent, NgxOtpComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignOtpComponent implements OnInit {
  private routeState = inject(RouteStateService);
  private campaignService = inject(CampaignService);
  private collateralService = inject(CollateralService);
  private navigationService = inject(WealthNavigationService);

  otpCode = signal<string[]>([]);
  countDown = signal<number>(300);
  inProgress = signal<boolean>(true);
  btnLoading = signal<boolean>(false);
  otpStatus = signal<NgxOtpStatus>('default');
  state = signal<ICompaignState | undefined>(undefined);

  btnDisabled = computed(() => this.otpCode().length < 4);
  supportText = computed(() => (this.otpStatus() === 'error' ? 'کد وارد‌شده اشتباه است' : ''));
  pageTitle = computed(() => (this.state()?.campaignCode ? 'ثبت‌نام در کارگزاری' : 'امضای دیجیتال'));

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
    if (!this.state().campaignCode && !this.state().coordinatorAction) {
      this.navigationService.navigate([HOME_ROUTE]);
    }

    this.countDown.set(+this.state()?.countDown);
  }

  registerCustomer(): void {
    const currentState = this.state();
    if (!currentState) return;

    this.btnLoading.set(true);
    this.otpStatus.set('default');

    const otp = this.otpCode().join('');

    if (currentState.campaignCode) {
      this.campaignService.getCampaignProcess(currentState.campaignCode, null, { otpCode: otp }).subscribe({
        next: (res) => {
          if (res?.success && res.result) {
            if (res.result['action'] === 'error') {
              this.otpStatus.set('error');
            } else {
              this.navigationService.navigateWithState([CAMPAIGN_AGREEMENT_ROUTE], {
                state: {
                  campaignCode: currentState.campaignCode,
                  userInfo: res.result.data.customerProfile,
                  agreements: res.result.data.contractEtfAgreements,
                },
              });
            }
          }
        },
        complete: () => this.btnLoading.set(false),
      });
    } else {
      const data: IProcessData = {
        otpCode: otp,
        instrumentSymbol: currentState.symbol,
      };

      this.collateralService.process(data, currentState.coordinatorAction).subscribe({
        next: (res) => {
          if (res?.success && res.result) {
            if (res.result['action'] === 'error') {
              this.otpStatus.set('error');
            } else {
              const route: string = COLLATERAL_PAGE_ROUTE_MAP[res.result.data.pageName as string] ?? HOME_ROUTE;
              const state = {
                symbol: currentState.symbol,
              };
              this.navigationService.navigate([route], {
                state,
              });
            }
          }
        },
        complete: () => this.btnLoading.set(false),
      });
    }
  }

  resend(): void {
    const currentState = this.state();
    if (!currentState) return;

    if (currentState.campaignCode) {
      this.campaignService.getCampaignProcess(currentState.campaignCode).subscribe({
        next: (res) => {
          if (res?.success && res.result?.data) {
            const newCountdown = +res.result.data.countdownInSeconds || 300;
            this.countDown.set(newCountdown);
            this.inProgress.set(true);
            this.otpStatus.set('default');
            this.otpCode.set([]);
          }
        },
        error: () => {
          this.navigationService.navigate([PROVIDER_NOT_AVAILABLE_ROUTE]);
        },
      });
    } else if (currentState.symbol) {
      const data: IProcessData = { instrumentSymbol: currentState.symbol };
      this.collateralService.process(data, currentState.coordinatorAction).subscribe();
    }
  }

  onTimerStopped() {
    this.inProgress.set(false);
  }

  onBackHandler() {
    if (this.state().symbol) {
      this.navigationService.navigate([COLLATERAL_ROUTE, this.state().symbol]);
    } else {
      this.navigationService.navigate([HOME_ROUTE]);
    }
  }
}

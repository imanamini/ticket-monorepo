import { Component, inject, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase-service.service';
import { takeUntil } from 'rxjs';
import { PaymentHandlerService } from '../../services/payment-handler.service';
import { NgxButtonComponent } from '@digipay/ngx-button';

import { BaseComponent } from '../../../../components/core/components/base/base.component';
import { FundDataService } from '../../../../components/core/services/fund-data.service';
import { EIntrackEventName } from '../../../../components/core/models/intrack-event-name.enum';
import {
  CROWD_LIST_ROUTE,
  INVESTMENT_LIST_ROUTE,
  IPO_ROUTE,
  PROFILE_ROUTE,
  PURCHASE_ROUTE,
} from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { ProfileService } from '../../../../components/core/services/profile.service';
import { NgxCountDownComponent } from '@digipay/ngx-count-down';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { PinInputComponent } from '../../../../shared/components/pin-input/pin-input.component';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
  standalone: true,
  imports: [NgxButtonComponent, NgxAppBarComponent, NgxCountDownComponent, PinInputComponent],
})
export class OtpComponent extends BaseComponent implements OnInit {
  inProgress = true;
  otp = '';
  hasError = false;
  isLoading = false;

  state:
    | {
        symbol?: string;
        unitCount?: number;
        amount?: number;
        type?: string;
        investmentType?: string;
        ipo?: boolean;
        updateSejam?: boolean;
      }
    | undefined;

  private routeState = inject(RouteStateService);
  private profileService = inject(ProfileService);
  private purchaseService = inject(PurchaseService);
  private fundDataService = inject(FundDataService);
  private navigationService = inject(WealthNavigationService);
  private paymentHandlerService = inject(PaymentHandlerService);
  private eventService = inject(NgxEventTrackerService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.state = this.routeState.getAll();
  }

  onChanged(val: string) {
    this.hasError = false;
    this.otp = val;
  }

  registerCustomer() {
    if (this.state.updateSejam) {
      this.updateSejam();
    } else {
      if (this.state?.symbol) {
        this.isLoading = true;
        this.purchaseService
          .registerCustomer(this.otp, this.state?.investmentType === 'CrowdFund', this.state.symbol)
          .pipe(takeUntil(this.destroyObservable))
          .subscribe((res) => {
            const eventData = {
              eventName: EIntrackEventName.REGISTER_CUSTOMER_IN_INVESTMENT,
              eventData: {
                State: res.result,
                Fund_Id: this.state.symbol,
              },
            };
            this.eventService.sendEvent(eventData);
            if (res?.success) {
              if (this.state.investmentType === 'CrowdFund') {
                this.navigationService.navigate([PURCHASE_ROUTE, this.state.symbol], {
                  queryParams: { crowdFunding: 'true' },
                  state: {
                    ...this.state,
                    callShowDetail: true,
                  },
                });
              } else {
                this.paymentHandlerService.handleState(res.result.state, this.state);
              }
            } else {
              this.hasError = true;
              this.otp = '';
            }
            this.isLoading = false;
          });
      } else {
        if (this.state.investmentType === 'CrowdFund') {
          this.navigationService.navigate([CROWD_LIST_ROUTE]);
        } else {
          this.navigationService.navigate([INVESTMENT_LIST_ROUTE]);
        }
      }
    }
  }

  resend() {
    if (!this.inProgress) {
      this.getOtp();
      this.inProgress = true;
    }
  }

  private getOtp() {
    if (this.state.updateSejam) {
      this.fundDataService.verifyCustomerUpdateSejam(this.state.symbol).subscribe();
    } else {
      const isCrowdFunding = this.state.investmentType === 'CrowdFund';
      if (this.state?.symbol) {
        this.fundDataService.verifyCustomer(this.state.symbol).subscribe();
      } else {
        if (isCrowdFunding) {
          this.navigationService.navigate([CROWD_LIST_ROUTE]);
        } else {
          this.navigationService.navigate([INVESTMENT_LIST_ROUTE]);
        }
      }
    }
  }

  private updateSejam() {
    this.fundDataService.updateSejam(this.otp, this.state.symbol).subscribe((res) => {
      if (res?.success) {
        this.profileService.clearProfile();
        this.navigationService.navigate([PROFILE_ROUTE], {
          state: {
            isSejamUpdate: true,
            updateSejamSeccess: true,
          },
        });
      } else {
        this.navigationService.navigate([PROFILE_ROUTE], {
          state: {
            isSejamUpdate: true,
            updateSejamSeccess: false,
          },
        });
      }
    });
  }

  onTimerStopped() {
    this.inProgress = false;
  }

  onBackHandler() {
    if (this.state.ipo) {
      this.navigationService.navigate([IPO_ROUTE]);
    } else if (this.state?.investmentType === 'CrowdFund' || this.state.type === 'CrowdFund') {
      this.navigationService.navigate([CROWD_LIST_ROUTE, this.state?.symbol], {
        queryParams: {
          crowdFunding: true,
        },
        state: this.state,
      });
    } else if (this.state?.updateSejam) {
      this.navigationService.navigate([PROFILE_ROUTE], {
        state: {
          isSejamUpdate: true,
          updateSejamSeccess: false,
        },
      });
    } else {
      this.navigationService.navigate([INVESTMENT_LIST_ROUTE], {
        queryParams: {
          type: this.state.type,
        },
        state: this.state,
      });
    }
  }
}

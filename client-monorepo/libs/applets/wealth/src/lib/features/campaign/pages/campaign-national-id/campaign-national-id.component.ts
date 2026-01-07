import { ICompaignState } from '../../models';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import {
  HOME_ROUTE,
  COLLATERAL_ROUTE,
  SEJAM_ERROR_ROUTE,
  CAMPAIGN_OTP_ROUTE,
  CAMPAIGN_AGREEMENT_ROUTE,
  TREASURE_HUNT_START_ROUTE,
  CAMPAIGN_SHAHKAR_ERROR_ROUTE,
  TREASURE_HUNT_REGISTRATION_SUCCESSFUL_ROUTE,
} from '../../../../data-access/constants/app-routes';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { ICampaignProcessData } from '../../models/campaign-process.interface';
import { COLLATERAL_PAGE_ROUTE_MAP, IProcessData, ICollateralProcessData } from '../../../collateral/data-access/models';
import { CoordinatorPage } from '../../../../data-access/enums/coordinator-page';
import { CampaignService } from '../../../../components/core/services/v1/campaign.service';
import { CollateralService } from '../../../collateral/data-access/services/collateral.service';

@Component({
  selector: 'wealth-applet-campaign-national-id',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, ReactiveFormsModule, UiFormFieldBuilderModule, NgxAppBarComponent],
  templateUrl: './campaign-national-id.component.html',
  styleUrl: './campaign-national-id.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignNationalIdComponent implements OnInit {
  private routeState = inject(RouteStateService);
  private campaignService = inject(CampaignService);
  private collateralService = inject(CollateralService);
  private navigationService = inject(WealthNavigationService);

  isLoading = signal<boolean>(false);
  state = signal<ICompaignState | undefined>(undefined);
  nationalIdErrorMessage = signal<string>('کد ملی نامعتبر است');
  nationalIdController = new FormControl('', [Validators.required, NgxFormValidator.nationalCodeValidator()]);

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
    if (!this.state().phoneNumber) this.navigationService.navigate([HOME_ROUTE]);
  }

  onBackHandler() {
    if (this.state().coordinatorAction) {
      this.navigationService.navigate([COLLATERAL_ROUTE, this.state().symbol]);
    } else {
      this.navigationService.navigate([TREASURE_HUNT_START_ROUTE], {
        state: {
          campaignCode: this.state().campaignCode,
          phoneNumber: this.state().phoneNumber,
          role: this.state().role,
        },
      });
    }
  }

  onNationalCodeSubmit() {
    const state = this.state();
    if (!state) return;

    this.isLoading.set(true);
    const nationalId = this.nationalIdController.value;
    const process$ = (
      state.coordinatorAction
        ? this.collateralService.process({ nationalId } as IProcessData, state.coordinatorAction)
        : this.campaignService.getCampaignProcess(state.campaignCode, null, { nationalId })
    ) as Observable<any>;

    process$.pipe(finalize(() => this.isLoading.set(false))).subscribe((res) => {
      if (!res?.success || !res.result) return;

      const { result } = res;

      if (this.isErrorResult(result)) {
        this.setNationalIdError((result.data as ICollateralProcessData)?.message ?? '');
        return;
      }

      if (!result.data) return;
      const data = result.data;

      if (state.coordinatorAction) {
        this.handleCollateralNavigation(data as ICollateralProcessData, state);
        return;
      }

      this.handleCampaignNavigation(data as ICampaignProcessData, state);
    });
  }

  private handleCollateralNavigation(data: ICollateralProcessData, state: ICompaignState) {
    const route = COLLATERAL_PAGE_ROUTE_MAP[data.pageName as string] ?? [HOME_ROUTE];
    this.navigationService.navigate(route, {
      state,
    });
  }

  private handleCampaignNavigation(data: ICampaignProcessData, state: ICompaignState) {
    switch (data?.pageName as CoordinatorPage) {
      case CoordinatorPage.PAGE_GLOBAL_SHAHKAR_EXCEPTION:
        this.navigationService.navigate([CAMPAIGN_SHAHKAR_ERROR_ROUTE], {
          state: {
            campaignCode: state.campaignCode,
            phoneNumber: state.phoneNumber,
          },
        });
        break;
      case CoordinatorPage.PAGE_GLOBAL_SEJAMI_EXCEPTION:
        this.navigationService.navigate([SEJAM_ERROR_ROUTE]);
        break;
      case CoordinatorPage.PAGE_CAMPAIGN_PRIZE_WAITING:
        this.navigationService.navigate([TREASURE_HUNT_REGISTRATION_SUCCESSFUL_ROUTE], {
          state: {
            remainingDays: data.remainingDays,
          },
        });
        break;
      case CoordinatorPage.PAGE_CAMPAIGN_OTP:
        this.navigationService.navigate([CAMPAIGN_OTP_ROUTE], {
          state: {
            campaignCode: state.campaignCode,
            countDown: data.countdownInSeconds,
          },
        });
        break;
      case CoordinatorPage.PAGE_GLOBAL_ETF_CONTRACT_REGISTRATION:
        this.navigationService.navigate([CAMPAIGN_AGREEMENT_ROUTE], {
          state: {
            campaignCode: state.campaignCode,
            userInfo: data.customerProfile,
            agreements: data.contractEtfAgreements,
            phoneNumber: state.phoneNumber,
          },
        });
        break;
    }
  }

  private isErrorResult(result: any) {
    return result?.action === 'error';
  }

  private setNationalIdError(message: string) {
    this.nationalIdErrorMessage.set(message);
    this.nationalIdController.setErrors({ nationalIdErrorMessage: true });
    this.nationalIdController.markAsTouched();
    this.nationalIdController.updateValueAndValidity({ emitEvent: false });
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';

import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { JalaliDatePipe } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { ActivatedRoute } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { HOME_ROUTE, POSTAL_CODE_REGISTRATION_ROUTE, WALLETS_ROUTE } from '../../../../data-access/constants/app-routes';
import { BaseComponent } from '../../../../components/core/components/base/base.component';
import { WALLET_COORDINATOR_PROCESS_API, WALLET_DEPOSIT_PROCESS_API } from '../../../../data-access/constants/api';
import { AppBarWrapperComponent } from '../../../../components/core/components/app-bar-wrapper/app-bar-wrapper.component';
import { NationalIdValidator } from 'apps/website/src/app/core/validators/national-id.validator';
import { UserActivitiesService } from '../../../../shared/services/activities/user-activities.service';
import { IUserActivity } from '../../../../shared/services/activities/models/user-activities.interface';
import { CustomerService } from '../../../../components/core/services/v1/customer.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { IWalletBnplStateData } from '../../models/wallet-bnpl-state.interface';
import { convertTimestampToDate } from '../../../../components/utils/strings';
import { catchError, take, throwError } from 'rxjs';
import { IWalletProcessData } from '../../models/wallet-process.interface';
import { IWalletProcess } from '../../models/wallet-cashin-model.interface';

@Component({
  selector: 'wealth-applet-wallet-bnpl',
  standalone: true,
  imports: [UiFormFieldBuilderModule, ReactiveFormsModule, NgxButtonComponent, FormsModule, AppBarWrapperComponent],
  templateUrl: './wallet-bnpl.component.html',
  styleUrl: './wallet-bnpl.component.scss',
})
export class WalletBnplComponent extends BaseComponent implements OnInit {
  nationalIdValidation = [Validators.required, NationalIdValidator];
  navigationService = inject(WealthNavigationService);
  jalaliPipe = new JalaliDatePipe();

  isLoading = signal<boolean>(false);
  walletId = signal<string | undefined>(undefined);
  serverErrorMessage = signal<string | undefined>(undefined);
  state = signal<IWalletBnplStateData | undefined>(undefined);
  form: UntypedFormGroup;
  retrying = signal<boolean>(false);

  private formBuilder = inject(UntypedFormBuilder);
  private routeState = inject(RouteStateService);
  private walletService = inject(WalletService);
  private activatedRoute = inject(ActivatedRoute);
  private customerService = inject(CustomerService);
  private messageService = inject(MessageService);
  private userActivitiesService = inject(UserActivitiesService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      birthDay: ['', [Validators.required]],
      nationalId: ['', this.nationalIdValidation],
      postalCode: ['', [Validators.required]],
    });
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    this.retrying.set(this.activatedRoute.snapshot.queryParamMap.get('retrying') === 'true');
    this.state.set(this.routeState.getAll());
    if (!this.state()?.walletName) {
      this.navigationService.navigate([WALLETS_ROUTE, this.walletId()]);
    }
    if (this.state().nationalId) {
      this.form.controls['nationalId'].setValue(this.state().nationalId);
    }
    if (this.state().birthDate) {
      this.form.controls['birthDay'].setValue(new Date(this.state().birthDate));
    }
    if (this.state().postalCode) {
      this.form.controls['postalCode'].setValue(this.state().postalCode);
    }

    const activity: IUserActivity = {
      eventId: 'WW_CustomerInfo',
      payloads: {},
    };

    this.userActivitiesService.action(activity).subscribe();
  }

  onBackHandler() {
    if (this.state().requiresBirthdateLanding) {
      this.navigationService.navigate([HOME_ROUTE]);
    } else {
      this.navigationService.navigate([WALLETS_ROUTE, this.walletId()]);
    }
  }

  onContinue() {
    this.isLoading.set(true);
    const state = this.state();
    const walletId = this.walletId();

    const isRetrying = this.retrying();
    const { birthDay, nationalId, postalCode } = this.form.controls;
    const birthDateValue =
      this.state()?.birthDate?.length > 0
        ? this.state().birthDate
        : this.jalaliPipe.transform(convertTimestampToDate(birthDay?.value || 0));
    const nationalIdValue = typeof nationalId.value === 'string' ? nationalId.value.trim() : (nationalId.value as string | undefined);
    const postalCodeValue = typeof postalCode.value === 'string' ? postalCode.value.trim() : (postalCode.value as string | undefined);

    if (!state) {
      this.isLoading.set(false);
      return;
    }

    if (this.state().activeSwap) {
      const processData: IWalletProcess = {
        ...state,
        action: 'confirmed',
        walletName: state.walletName,
        postalCode: postalCodeValue,
        birthDate: birthDateValue,
        nationalId: nationalIdValue,
        walletId,
      };
      this.walletService.walletActivationProcess(processData).subscribe((res) => {
        const { message, success } = res?.result?.data ?? {};
        if (message) {
          success ? this.messageService.showSuccessMessage(message) : this.messageService.showErrorMessage(message);
        }
      });
      return;
    }

    if (!postalCodeValue) {
      postalCode.setErrors({ required: true });
      this.isLoading.set(false);
      return;
    }

    const processData: IWalletProcessData = {
      data: {
        ...state,
        walletName: state.walletName,
        postalCode: postalCodeValue,
        walletId,
        terms: state.terms,
        walletTitle: state.walletTitle,
      },
    };

    if (!isRetrying) {
      processData.data.birthDate = birthDateValue;
      processData.data.nationalId = nationalIdValue;
      processData.action = state.requiresBirthdateLanding ? 'birthdateLanding' : undefined;
    }

    const payloads = this.buildActivityPayloads({
      walletName: processData.data.walletName,
      walletId: processData.data.walletId,
      nationalId: nationalIdValue,
      postalCode: postalCodeValue,
      birthDate: birthDateValue,
    });

    const activity: IUserActivity = {
      eventId: isRetrying ? 'WW_CRPC_Confirm' : 'WW_CR_PostalCode2',
      payloads,
    };
    this.userActivitiesService.action(activity).subscribe();

    if (isRetrying) {
      this.customerService
        .verifyPostalCode(postalCodeValue)
        .pipe(
          take(1),
          catchError((err) => {
            this.isLoading.set(false);
            return throwError(err);
          }),
        )
        .subscribe((res) => {
          this.isLoading.set(false);
          if (res.result.status === 'ProviderNotAvailable') {
            this.messageService.showErrorMessage(res.result.title);
          } else if (res?.result?.status === 'Verified') {
            this.messageService.showSuccessMessage('کد پستی شما در سامانه ثبت شده است.');
            this.navigationService.navigate([WALLETS_ROUTE, walletId]);
          } else {
            this.navigationService.navigate([POSTAL_CODE_REGISTRATION_ROUTE, walletId], {
              queryParams: {
                retrying: 'true',
              },
              state: {
                ...this.state(),
                terms: 'retry_postal_code',
              },
            });
          }
        });
      return;
    }

    const api = state.terms === 'bnpl_terms' ? WALLET_COORDINATOR_PROCESS_API : WALLET_DEPOSIT_PROCESS_API;
    this.walletService.walletProcess(api, processData).subscribe((res) => {
      if (res?.success && res?.result?.action === 'error') {
        const errorKey = res.result.data?.key;
        if (errorKey === 'birthDate') {
          birthDay.setErrors({ invalidBirthDay: true });
        } else if (errorKey === 'nationalId') {
          nationalId.setErrors({ invalidNationalId: true });
        } else if (errorKey === 'postalCode') {
          postalCode.setErrors({ invalidPostalcode: true });
        }
        this.serverErrorMessage.set(res.result.data?.message);
      }
      this.isLoading.set(false);
    });
  }

  private buildActivityPayloads(values: Record<string, string | undefined>): Record<string, string> {
    const payloads: Record<string, string> = {};
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        payloads[key] = value;
      }
    });
    return payloads;
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { takeUntil } from 'rxjs';

import { BaseComponent } from '../../../../components/core/components/base/base.component';
import { FormErrorStatus } from '../../../../data-access/models/form-error-status.model';
import { ErrorService } from '../../../../components/core/services/error.service';
import { ProfileService } from '../../../../components/core/services/profile.service';
import {
  CAMPAIGN_SHAHKAR_ERROR_ROUTE,
  CROWD_LIST_ROUTE,
  HOME_ROUTE,
  INVESTMENT_LIST_ROUTE,
  IPO_ROUTE,
  NATIONAL_ID_ERROR_ROUTE,
  SEJAM_ERROR_ROUTE,
  USER_EXIST_WITH_ANOTHER_PHONE_NUMBER_ROUTE,
  WALLETS_ROUTE,
} from '../../../../data-access/constants/app-routes';
import { ErrorCodes } from '../../../../data-access/enums/error-codes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { FundDataService } from '../../../../components/core/services/fund-data.service';
import { PaymentHandlerService } from '../../services/payment-handler.service';
import { EIntrackEventName } from '../../../../components/core/models/intrack-event-name.enum';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { MessageService, RouteStateService } from '@client-monorepo/common/utilities';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { WalletService } from '../../../wallet/services/wallet.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { validateNationalCode } from '../../../../../../../../../apps/website/src/app/core/validators/national-id.validator';
import { IWalletProcessData } from '../../../wallet/models/wallet-process.interface';

@Component({
  selector: 'app-national-id',
  templateUrl: './national-id.component.html',
  styleUrls: ['./national-id.component.scss'],
  standalone: true,
  imports: [NgxButtonComponent, ReactiveFormsModule, UiFormFieldBuilderModule, NgxAppBarComponent, SpinnerComponent],
})
export class NationalIdComponent extends BaseComponent implements OnInit {
  showError: FormErrorStatus = 'hidden';
  errorMessage = signal<string | undefined>(undefined);
  form: FormGroup;
  state = signal<
    | {
        type?: string;
        symbol?: '';
        unitCount?: 0;
        amount?: 0;
        investmentType?: string;
        ipo?: boolean;
        action: string;
        coordinatorAction: string;
        pageName: string;
        phoneNumber: string;
        walletId: string;
        walletName: string;
      }
    | undefined
  >(undefined);
  phoneNumber = signal<string | undefined>(undefined);
  isLoading = signal<boolean>(false);
  loading = signal<boolean>(true);
  private formBuilder = inject(FormBuilder);
  private errorService = inject(ErrorService);
  private routeState = inject(RouteStateService);
  private messageService = inject(MessageService);
  private profileService = inject(ProfileService);
  private fundDataService = inject(FundDataService);
  private paymentHandlerService = inject(PaymentHandlerService);
  private navigationService = inject(WealthNavigationService);
  private eventService = inject(NgxEventTrackerService);
  private walletService = inject(WalletService);

  parentErrors = signal<{
    [key: string]: string;
  }>({});

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nationalCode: ['', [this.nationalCodeValidator, Validators.required, this.serverErrorValidator('nationalCode')]],
    });

    this.state.set(this.routeState.getAll());
    if (!this.state()?.symbol && !this.state()?.walletName) {
      this.navigationService.navigate([HOME_ROUTE]);
    }
    if (!this.state().phoneNumber) {
      this.getUserPhoneNumber();
    } else {
      this.phoneNumber.set(this.state().phoneNumber);
      this.loading.set(false);
    }
  }

  private resetValidators(): void {
    this.form
      .get('nationalCode')
      .valueChanges.pipe(takeUntil(this.destroyObservable))
      .subscribe((value) => {
        if (value.length <= 23) {
          this.parentErrors.set({});
          this.updateValidityOfErrorFields();
        }
      });
  }

  onBackHandler() {
    if (this.state().ipo) {
      this.navigationService.navigate([IPO_ROUTE]);
    } else if (this.state()?.investmentType === 'CrowdFund' || this.state().type === 'CrowdFund') {
      this.navigationService.navigate([CROWD_LIST_ROUTE]);
    } else if (this.state()?.walletId) {
      this.navigationService.navigate([WALLETS_ROUTE, this.state().walletId.toLowerCase()]);
    } else {
      this.navigationService.navigate([INVESTMENT_LIST_ROUTE], {
        queryParams: { type: this.state().type },
      });
    }
  }

  private async verifyShahkar() {
    this.isLoading.set(true);
    const shahkar = await this.profileService
      .verifyShahkar(this.form.value.nationalCode)
      .toPromise()
      .catch((e) => {
        this.eventService.sendEvent({
          eventName: EIntrackEventName.SHAHKAR_SERVICE_ERROR,
          eventData: {},
        });
        this.isLoading.set(false);
        if (e.error.code === ErrorCodes.NationalIdAlreadyExistWithDiffPhoneNumber) {
          this.navigationService.navigate([USER_EXIST_WITH_ANOTHER_PHONE_NUMBER_ROUTE], {
            queryParams: { number: e.error?.fields?.phoneNumber },
          });
        } else {
          this.errorService.setParams(e.error);
          this.navigationService.navigate([NATIONAL_ID_ERROR_ROUTE], {
            state: {
              symbol: this.state()?.symbol,
              type: this.state()?.['type'] || 'FixedIncome',
              amount: this.state()?.amount,
              unitCount: this.state()?.unitCount,
              phoneNumber: this.phoneNumber(),
            },
          });
        }
      });
    if (shahkar?.success) {
      this.eventService.sendEvent({
        eventName: EIntrackEventName.SHAHKAR_TRUE,
        eventData: {},
      });
      this.verifyCustomer();
    } else {
      this.eventService.sendEvent({
        eventName: EIntrackEventName.SHAHKAR_MISSMATCH,
        eventData: {},
      });
      this.navigationService.navigate([NATIONAL_ID_ERROR_ROUTE], {
        state: {
          symbol: this.state()?.symbol,
          type: this.state()?.['type'] || 'FixedIncome',
          amount: this.state()?.amount,
          unitCount: this.state()?.unitCount,
          phoneNumber: this.phoneNumber(),
        },
      });
    }
  }

  private verifyCustomer() {
    this.fundDataService.verifyCustomer(this.state()?.symbol).subscribe((res) => {
      if (res?.success) {
        this.paymentHandlerService.handleState(res.result.state, this.state());
      } else {
        if (res?.error?.code === ErrorCodes.CustomerIsNotSejami) {
          this.navigationService.navigate([SEJAM_ERROR_ROUTE], {
            state: {
              title: res.error?.title || res.error?.error?.title || 'شما حساب سجام ندارید',
              description:
                res.error?.description || res.error?.error?.description || 'شما حساب سجام ندارید یا ثبت‌نام سجام را کامل نکردید.',
            },
          });
        }
      }
    });
  }

  async onNationalCodeSubmit() {
    if (this.state().coordinatorAction === '/v1/coordinator/wallet-deposit/process') {
      const processData: IWalletProcessData = {
        data: {
          walletName: this.state().walletName,
          walletId: this.state().walletId,
          phoneNumber: this.state().phoneNumber,
          nationalId: this.form.controls['nationalCode'].value,
        },
      };
      this.walletService.walletProcess(this.state().coordinatorAction, processData).subscribe((res) => {
        if (res.success && res.result.action.toLowerCase() === 'exceptionpage') {
          if (res.result.data.pageName === 'page_global_shahkar_exception') {
            this.navigationService.navigate([CAMPAIGN_SHAHKAR_ERROR_ROUTE], {
              state: this.state(),
            });
          } else {
            this.parentErrors.set({
              nationalCode: 'این کد ملی متعلق به شماره موبایل وارد شده نیست',
            });
            this.updateValidityOfErrorFields();

            setTimeout(() => {
              this.resetValidators();
            }, 1000);
          }
        }
      });
    } else {
      if (this.form.value.nationalCode.length < 10) this.messageService.showErrorMessage('.لطفا کدملی را به درستی وارد کنید"');
      else {
        if (this.state()?.['symbol']) {
          this.verifyShahkar();
        } else {
          this.messageService.showErrorMessage('شما صندوقی برای خرید انتخاب نکرده اید.');
        }
      }
    }
  }

  private getUserPhoneNumber() {
    this.profileService
      .getUserPhoneNumber()
      .pipe(takeUntil(this.destroyObservable))
      .subscribe((res) => {
        this.phoneNumber.set(res.result);

        this.loading.set(false);
      });
  }

  nationalCodeValidator(control: AbstractControl): { [s: string]: boolean } {
    if (validateNationalCode(control.value)) {
      return null;
    }

    return { invalidNationalCode: true };
  }

  serverErrorValidator(controlName: string): ValidatorFn {
    return (): ValidationErrors | null => {
      return this.parentErrors()[controlName] ? { serverError: true } : null;
    };
  }

  updateValidityOfErrorFields() {
    Object.keys(this.parentErrors()).forEach((item) => {
      this.form.get(item).updateValueAndValidity();
      this.form.get(item).markAsDirty();
    });
  }
}

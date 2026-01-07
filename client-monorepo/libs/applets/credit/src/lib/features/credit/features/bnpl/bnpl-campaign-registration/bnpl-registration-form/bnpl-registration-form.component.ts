import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import moment from 'jalali-moment';
import { BnplErrorHandlingService } from '../services/bnpl-error-handling.service';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { convertNonEnglishDigits } from '@digipay/strings';
import { CreditUserService } from '../../../../data-access/services/credit-user.service';
import { CreditNavigationService } from '../../../../data-access/services/credit-navigation.service';
import { MessageService } from '../../../../data-access/services/message.service';
import { CreditApiService } from '../../../../data-access/services/credit-api.service';
import { CreditUrlService } from '../../../../data-access/utils/url';
import { CreditPageDialogComponent } from '../../../../components/credit-page-dialog/credit-page-dialog.component';
import { CampaignWalletResponse } from '../../../../data-access/models/bnpl/campaigns/campaign-wallet.response';
import { JournalTypeEnum } from '../../../../data-access/models/bnpl/campaigns/campaign-wallet.request';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { BnplActivatedComponent } from '../bnpl-activated/bnpl-activated.component';
import { BnplErrorPageComponent } from '../bnpl-error-page/bnpl-error-page.component';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';

export type StateType = 'INFO_FORM' | 'ERROR' | 'ACTIVATED';

@Component({
  selector: 'bnpl-registration-form',
  templateUrl: './bnpl-registration-form.component.html',
  styleUrls: ['./bnpl-registration-form.component.scss'],
  standalone: true,
  imports: [
    CreditAppBarComponent,
    FormsModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    NgxButtonComponent,
    NgxSpinnerModule,
    BnplErrorPageComponent,
    BnplActivatedComponent,
    NgxCheckboxComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BnplRegistrationFormComponent implements OnInit {
  cellNumber = signal('');
  state = signal<StateType>('INFO_FORM');
  form!: UntypedFormGroup;
  sendingData!: boolean;
  focusOnNationalCode!: boolean;
  errorType = signal<number | null>(null);
  gettingContract!: boolean;

  showLoading = signal(true);
  amount = signal<number | null>(null);
  installmentCount = signal<number | null>(null);
  journalTypeEnum = JournalTypeEnum;

  bottomSheetService = inject(NgxBottomSheetService);
  formBuilder = inject(FormBuilder);
  userService = inject(CreditUserService);
  router = inject(Router);
  creditNavigationService = inject(CreditNavigationService);
  bnplErrorHandlingService = inject(BnplErrorHandlingService);
  messageService = inject(MessageService);
  creditApiService = inject(CreditApiService);
  creditUrlService = inject(CreditUrlService);

  ngOnInit(): void {
    this.userService.currentUser().then((user) => {
      this.cellNumber.set(user.cellNumber);
      this.showLoading.set(false);
    });
    this.createForm();
  }

  birthDateValidator(control: UntypedFormControl): null | { lessThan18Years: boolean } {
    const value = control.value;
    const age = moment().diff(moment(value), 'years', true);
    return age >= 18 ? null : { lessThan18Years: true };
  }

  openContract($event: MouseEvent) {
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
    if (this.gettingContract) {
      return;
    }
    this.gettingContract = true;
    this.creditApiService.getTacData('bnpl').subscribe({
      next: (r) => {
        this.gettingContract = false;
        this.bottomSheetService.openBottomSheet(CreditPageDialogComponent, {
          title: 'قوانین و مقررات',
          relativeUrl: r.tacTextUrl,
        });
      },
      error: (e) => {
        this.gettingContract = false;
        if (e?.result) {
          this.messageService.showErrorOfErrorResponse(e.result.message);
        } else {
          this.messageService.showErrorOfErrorResponse('بروز خطا در دریافت اطلاعات قوانین و مقررات');
        }
      },
    });
  }

  onSubmit() {
    this.changeState('INFO_FORM');
    if (this.form.invalid && this.sendingData) {
      return;
    }

    this.sendingData = true;
    this.creditApiService.confirmTac('bnpl').subscribe({
      next: () => {
        this.creditApiService
          .registerBnpl({
            nationalCode: convertNonEnglishDigits(this.form.value.nationalCode),
            birthDate: moment(this.form.value.birthDate).locale('fa').format('YYYY/MM/DD'),
            journalType: this.journalTypeEnum.PDP,
          })
          .subscribe({
            next: (response: CampaignWalletResponse) => {
              this.amount.set(response.amount);
              this.installmentCount.set(response.installmentCount);
              this.changeState('ACTIVATED');
              this.sendingData = false;
            },
            error: (error) => {
              this.bnplErrorHandlingService.setCellNumber(error?.cellNumber ?? '');
              this.bnplErrorHandlingService.setNationalCode(error?.nationalCode ?? '');
              this.sendingData = false;
              if (error && error.httpStatus === 500) {
                this.messageService.showErrorOfErrorResponse(error.result.message);
                return;
              }

              // /*dp scoring or credit scoring failed*/
              if (error && (error.result?.status === 5245 || error.result?.status === 5246)) {
                this.router.navigateByUrl(this.creditUrlService.getInnerServicePath('/campaign/scoring-failed')).then();
                return;
              }

              this.changeState('ERROR');
              if (error && (error.httpStatus === 401 || error.httpStatus === 429)) {
                this.errorType.set(error.httpStatus);
                return;
              }
              this.errorType.set(error.result?.status);
            },
          });
      },
      error: (error) => {
        if (error && error.httpStatus === 401) {
          this.changeState('ERROR');
          this.errorType.set(error.httpStatus);
        }
        if (error && error.result) {
          this.messageService.showErrorOfErrorResponse(error.result.message);
        }
        this.sendingData = false;
      },
    });
  }

  changeState(state: StateType) {
    this.state.set(state);
  }

  onBack(): void {
    this.creditNavigationService.closeService();
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      nationalCode: [null, [Validators.required, NgxFormValidator.nationalCodeValidator]],
      birthDate: [null, [Validators.required, this.birthDateValidator]],
      acceptContract: [false, [Validators.requiredTrue]],
    });
  }
}

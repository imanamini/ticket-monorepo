import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import moment from 'jalali-moment';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { BnplSubscriptionButtonAction, bnplSubscriptionErrorHandlingConfig, STATUS_TYPE } from './bnpl-subscription-error-handling-config';
import { ActivatedRoute } from '@angular/router';

import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { MessageService } from '../../../data-access/services/message.service';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { CreditPageDialogComponent } from '../../../components/credit-page-dialog/credit-page-dialog.component';
import { CreditUserService } from '../../../data-access/services/credit-user.service';
import { SERVICE_TYPE_SUBSCRIPTION_ENUM } from '../../../data-access/models/bnpl/service-type-subscription/service-type-subscription.enum';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';

@Component({
  selector: 'app-bnpl-subscription-registration-form',
  standalone: true,
  imports: [
    PipesModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    NgxStatusResultModule,
    FormsModule,
    NgxButtonComponent,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
    NgxCheckboxComponent,
  ],
  templateUrl: './bnpl-subscription-registration-form.component.html',
  styleUrl: './bnpl-subscription-registration-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BnplSubscriptionRegistrationFormComponent implements OnInit {
  gettingContract = false;
  redirectUrl!: string;
  form!: FormGroup;
  status = signal<STATUS_TYPE | null>(null);
  statusResult = computed(() => bnplSubscriptionErrorHandlingConfig[this.status()!]);
  cellNumber = signal('');
  acceptedCondition = signal(false);
  showError = signal<'auto' | 'show'>('auto');
  statusTitle = computed(() =>
    this.status() === STATUS_TYPE.NATIONAL_CODE_ERROR
      ? this.statusResult().title.replace('{}', this.cellNumber())
      : this.statusResult().title,
  );

  bottomSheetService = inject(NgxBottomSheetService);
  formBuilder = inject(FormBuilder);
  userService = inject(CreditUserService);
  creditApiService = inject(CreditApiService);
  messageService = inject(MessageService);
  activatedRout = inject(ActivatedRoute);

  ngOnInit() {
    this.redirectUrl = this.activatedRout.snapshot.queryParams['redirectUrl'];
    this.userService.currentUser().then((user) => {
      this.cellNumber.set(user.cellNumber);
    });
    this.makeForm();
  }

  closeStep() {
    this.navigateToSubscription();
  }

  birthDateValidator(control: AbstractControl): { [p: string]: boolean } | null {
    const birthDate = control.value;
    if (!birthDate) {
      return null;
    }
    return null;
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
      next: (result) => {
        this.gettingContract = false;
        this.bottomSheetService.openBottomSheet(CreditPageDialogComponent, {
          title: 'قوانین و مقررات',
          relativeUrl: result.tacTextUrl,
        });
      },
      error: (error) => {
        this.gettingContract = false;
        if (error && error.result) {
          this.messageService.showErrorOfErrorResponse(error.result.message);
          return;
        }
        this.messageService.showErrorOfErrorResponse('بروز خطا در دریافت اطلاعات قوانین و مقررات');
      },
    });
  }

  submitForm() {
    this.showError.set('auto');
    if (!this.form.valid) {
      this.showError.set('show');
      return;
    }
    this.status.set(STATUS_TYPE.LOADING);
    this.creditApiService.confirmTac('bnpl').subscribe({
      next: () => {
        this.creditApiService
          .verifyUser({
            nationalCode: this.form.value.nationalCode,
            birthDate: moment(this.form.value.birthDate).locale('fa').format('YYYY/MM/DD'),
          })
          .subscribe({
            next: () => {
              this.status.set(STATUS_TYPE.SUCCESS);
              this.creditApiService.retryPlanServicesApi(SERVICE_TYPE_SUBSCRIPTION_ENUM.BNPL_1PAY).subscribe({
                next: () => {
                  setTimeout(() => {
                    this.navigateToSubscription();
                  }, 3000);
                },
                error: (error) => {
                  this.messageService.showErrorOfErrorResponse(error.result.message);
                },
              });
            },
            error: (error) => {
              if (error.status === 429) {
                this.status.set(STATUS_TYPE.MAXIMUM_TRY_ERROR);
                return;
              }
              if (error && error.result && error.result.status) {
                this.status.set(error.result.status);
                return;
              }
            },
          });
      },
      error: (error) => {
        this.status.set(null);
        this.messageService.showErrorOfErrorResponse(error.result.message);
      },
    });
  }

  statusResultClicked(id: BnplSubscriptionButtonAction | any) {
    switch (id) {
      case BnplSubscriptionButtonAction.CLOSE:
        this.closeStep();
        break;
      case BnplSubscriptionButtonAction.RETURN_TO_FORM:
        this.status.set(null);
        break;
      case BnplSubscriptionButtonAction.TYPE_AGAIN:
        // is for automatically retry in future
        break;
    }
  }

  navigateToSubscription() {
    window.open(`${this.redirectUrl}'&retryService=${SERVICE_TYPE_SUBSCRIPTION_ENUM.BNPL_1PAY}`, '_self');
  }

  private makeForm() {
    this.form = this.formBuilder.group({
      birthDate: [null, [Validators.required, this.birthDateValidator.bind(this)]],
      nationalCode: [null, [Validators.required, NgxFormValidator.nationalCodeValidator()]],
    });
  }
}

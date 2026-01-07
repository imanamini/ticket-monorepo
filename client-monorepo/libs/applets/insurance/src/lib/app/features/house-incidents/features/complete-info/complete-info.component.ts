import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MainHeaderComponent } from '../../../../components/main-header/main-header.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { AlertColorEnum } from '../../../../data-access/enums/alert-color.enum';
import { InsButtonComponent } from '../../../../components/ins-button/ins-button.component';
import { InsButtonSizeEnum } from '../../../../data-access/enums/ins-button-size.enum';
import { InsButtonStyleEnum } from '../../../../data-access/enums/ins-button-style.enum';
import { BaseComponent } from '../../../../components/base/base.component';
import { QueryParamHouseIncidentEnum } from '../../data-access/enums/query-param-house-incident.enum';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { HouseIncidentCompleteInfoModel } from '../complete-journey/model/house-incident-user-info-form.model';
import { PostalCodeValidator } from '../../../../util/postal-code-validator';
import { HouseIncidentsStepperComponent } from '../../components/house-incidents-stepper/house-incidents-stepper.component';
import { HouseIncidentsStepsEnum } from '../../data-access/enums/house-incidents-steps.enum';
import { HouseIncidentsActionService } from '../../data-access/services/house-incidents-action.service';
import { HouseIncidentsServiceActionType } from '../../data-access/enums/house-incidents-service-action-type.enum';
import { FaqCategoryTypeEnum } from '../../../../data-access/enums/faq-category-type.enum';
import { HouseIncidentsApiService } from '../../data-access/services/house-incidents-api.service';
import { NoWhitespaceOnlyValidator } from '../../../../util/no-white-space-only-validator';
import { FaEnNumberTextPattern } from '../../../../util/patterns';
import {
  VERIFY_POSTAL_CODE_ERROR_DESCRIPTION_MAPPER,
  VERIFY_POSTAL_CODE_ERROR_TITLE_MAPPER,
} from '../../../../data-access/constants/verify-postal-code-error-mapper.constant';
import { SnackbarService } from '@digipay/ngx-snackbar';
import { NgxAlert } from '@digipay/ngx-alert';
import { InsDigikalaService } from '../../../../data-access/services/ins-digikala.service';
@Component({
  selector: 'complete-info',
  standalone: true,
  imports: [
    MainHeaderComponent,
    UiFormFieldBuilderModule,
    InsButtonComponent,
    ReactiveFormsModule,
    HouseIncidentsStepperComponent,
    NgxAlert,
  ],
  templateUrl: './complete-info.component.html',
  styleUrl: './complete-info.component.scss',
})
export class CompleteInfoComponent extends BaseComponent implements OnInit {
  protected readonly AlertColorEnum = AlertColorEnum;
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly HouseIncidentsStepsEnum = HouseIncidentsStepsEnum;

  private fb = inject(FormBuilder);
  private houseIncidentsActionService = inject(HouseIncidentsActionService);
  private houseIncidentsApiService = inject(HouseIncidentsApiService);
  private snackService = inject(SnackbarService);
  private digikalaService = inject(InsDigikalaService);
  private applicationId: string | null = null;

  public form = signal(this.createForm());
  isSubmitting = signal(false);
  showError = signal<boolean>(false);
  progressButtonText = signal<string>(null);
  protected readonly FaqCategoryTypeEnum = FaqCategoryTypeEnum;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.applicationId = this.activatedRoute.snapshot.queryParamMap.get(QueryParamHouseIncidentEnum.ApplicationId);
    this.getUserInfo(this.applicationId);
    this.setProgressButtonText();
  }

  getUserInfo(id: string): void {
    this.houseIncidentsApiService.getPolicyUserInfo(id).subscribe({
      next: (result) => {
        this.form().patchValue({
          firstName: result.result.insuredParty.firstName,
          lastName: result.result.insuredParty.lastName,
          nationalCode: result.result.insuredParty.nationalCode,
          mobile: result.result.insuredParty.mobile,
          postalCode: result.result.insuredParty.postalCode,
          address: result.result.insuredParty.address,
        });
      },
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, NoWhitespaceOnlyValidator(), Validators.pattern(FaEnNumberTextPattern)]],
      lastName: ['', [Validators.required, NoWhitespaceOnlyValidator(), Validators.pattern(FaEnNumberTextPattern)]],
      nationalCode: ['', [Validators.required, Validators.minLength(10), NgxFormValidator.nationalCodeValidator()]],
      mobile: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
      postalCode: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), PostalCodeValidator]],
      address: ['', [Validators.required]],
    });
  }

  submitForm(): void {
    this.form().updateValueAndValidity();
    this.form().markAllAsTouched();
    this.showError.set(true);
    if (this.form().invalid || !this.applicationId || this.isSubmitting()) {
      return;
    }
    this.isSubmitting.set(true);
    const formValue = this.form().value;
    const userInfoData: HouseIncidentCompleteInfoModel = {
      insuredPartyDetail: {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        mobile: formValue.mobile,
        nationalCode: formValue.nationalCode,
      },
      address: {
        address: formValue.address,
        postalCode: formValue.postalCode,
      },
    };
    super.addSubscription(
      this.houseIncidentsActionService.completeInfo(this.applicationId, userInfoData).subscribe({
        next: () => {
          this.isSubmitting.set(false);
        },
        error: (error) => {
          this.isSubmitting.set(false);
          const errorCode = error?.error?.error?.code;
          this.snackService.openSnackBar({
            message: VERIFY_POSTAL_CODE_ERROR_TITLE_MAPPER[errorCode] ?? 'دسترسی نامعتبر',
            description:
            VERIFY_POSTAL_CODE_ERROR_DESCRIPTION_MAPPER[errorCode] ?? error?.error?.error?.title ?? 'خطایی در سامانه رخ داده است.',
            duration: 4000,
            status: 'error',
          });
        },
      })
    );
  }

  leaveJourney(): void {
    this.houseIncidentsActionService.leaveCompleteInfo();
  }

  setProgressButtonText(): void {
    this.houseIncidentsActionService.serviceType.subscribe({
      next: (value) => {
        this.progressButtonText.set(value === HouseIncidentsServiceActionType.A ? 'صدور بیمه‌نامه' : 'ثبت اطلاعات');
      },
    });
  }

  goToAmlak(): void {
    const url = 'https://amlak.mrud.ir/';
    if (this.digikalaService.isDigikalaSuperApp) {
      this.digikalaService.openExternalLink(url);
      return;
    }
    window.open(url, '_blank');
  }
}

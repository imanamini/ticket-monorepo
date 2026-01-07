import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { ThirdPartyStepperComponent } from '../../../../components/third-party-stepper/third-party-stepper.component';
import { InsAlertComponent } from '../../../../../../../../components/ins-alert/ins-alert.component';
import { InsIconComponent } from '../../../../../../components/ins-icon/ins-icon.component';
import { BaseComponent } from '../../../../../../../../components/base/base.component';
import { VehicleSharedService } from '../../../../../../data-access/services/vehicle-shared.service';
import {
  ActionButtonsComponent
} from '../../../../../../../../components/action-buttons/action-buttons.component';
import { MessageService } from '@client-monorepo/common/utilities';
import { AlertSizeEnum } from '../../../../../../../../data-access/enums/alert-size.enum';
import { VehicleErrorCode } from '../../../../../../data-access/enums/vehicle-error-code.enum';
import { ThirdPartyUrlsEnum } from '../../../../data-access/enums/third-party-urls.enum';
import { IconEnum } from '../../../../../../../../data-access/enums/icon.enum';
import { StoreService } from '../../../../data-access/services/store.service';
import {
  ApplicationFormApiService
} from '../../../../../../data-access/services/third-party/application-form-api.service';
import { CloseService } from '../../../../../../data-access/services/shared/close.service';
import { InsuredPartyModel } from '../../../../../../data-access/models/application-form/insured-party.model';
import { NgxPlateComponent } from '@digipay/ngx-plate';
import { InsuranceProductTypeEnum } from '../../../../../../../../data-access/enums/Insurance-product-type.enum';

@Component({
  selector: 'get-policy-method',
  standalone: true,
  imports: [
    ActionButtonsComponent,
    ThirdPartyStepperComponent,
    InsIconComponent,
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    PipesModule,
    InsAlertComponent,
    NgxPlateComponent,
  ],
  templateUrl: './get-policy-method.component.html',
  styleUrl: './get-policy-method.component.scss'
})
export class GetPolicyMethodComponent extends BaseComponent implements OnInit {

  plate: string | null = null;
  form: FormGroup;
  protected readonly IconEnum = IconEnum;
  protected readonly AlertSizeEnum = AlertSizeEnum;
  errorMessages = {
    pattern: 'لطفاً حروف انگلیسی وارد کنید.',
    email: 'آدرس پست الکترونیک وارد شده اشتباه است.',
    required: ''
  };
  showError = signal<boolean>(false);
  @ViewChild('emailInput', {static: false}) emailInput!: ElementRef;

  private sharedService = inject(VehicleSharedService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private closeService = inject(CloseService);
  private storeService = inject(StoreService);
  private applicationFormApiService = inject(ApplicationFormApiService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initData();
  }

  initData(): void {
    super.addSubscription(this.storeService.getStoreDataAsObservable()
      .subscribe({
        next: storeData => {
          if (!storeData) {
            return;
          }
          this.createFrom();
          this.form.patchValue({applicationFormId: this.storeService.getFormId()});
          this.plate = storeData.license ?? null;
          this.form.patchValue({email: storeData.insuredParty.email, isActiveEmail: !!storeData.insuredParty.email});
        }
      }));
  }

  private createFrom(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[^\u0600-\u06FF\s]+$/), Validators.email]],
      applicationFormId: ['', []],
      isActiveEmail: [false, []]
    });
  }

  public onSave(): void {
    if (this.form.get('isActiveEmail').value && this.form.invalid) {
      this.showError.set(true);
      this.emailInput?.nativeElement?.scrollIntoView({
        behavior: 'smooth',
      });
      return;
    }
    this.showError.set(false);
    const insuredParty: InsuredPartyModel = {
      insuredPartyDetail: structuredClone(this.storeService.getStoreValue().insuredParty),
      requesterPartyDetail: {
        ...this.storeService.getStoreValue().requesterParty,
        email: this.form.get('isActiveEmail').value ? this.form.get('email').value : ''
      },
      address: structuredClone(this.storeService.getStoreValue().address),
      license: this.storeService.getStoreValue().license
    };
    super.addSubscription(this.applicationFormApiService.putInsuredParty(
      this.storeService.getFormId(),
      insuredParty
    ).subscribe({
      next: response => {
        if (response.success) {
          this.storeService.setStoreData({
            ...this.storeService.appDataAsAppGetModel(),
            insuredParty: {
              ...this.storeService.appDataAsAppGetModel()?.insuredParty,
              email: this.form.get('isActiveEmail').value ? this.form.get('email').value : null
            }
          });
          this.sharedService.navigate(ThirdPartyUrlsEnum.Complete, null, InsuranceProductTypeEnum.ThirdParty);
        } else {
          this.messageService.showErrorMessage('آدرس پست الکترونیک وارد شده اشتباه است.');
        }
      },
      error: (err) => {
        if (err?.error?.error?.code === VehicleErrorCode.InappropriateAction) {
          this.sharedService.navigate(ThirdPartyUrlsEnum.State, {
            queryParamsHandling: 'merge'
          }, InsuranceProductTypeEnum.ThirdParty);
        }
      }
    }));
  }

  handleDeActiveButtonClicked(): void {
    this.sharedService.navigate(ThirdPartyUrlsEnum.Address, null, InsuranceProductTypeEnum.ThirdParty);
  }

  handleCloseClicked(): void {
    this.closeService.close();
  }

}

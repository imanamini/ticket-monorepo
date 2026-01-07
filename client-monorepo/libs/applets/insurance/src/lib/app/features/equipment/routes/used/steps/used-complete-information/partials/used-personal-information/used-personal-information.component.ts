import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { LoadingService } from '../../../../../../../../data-access/services/loading.service';
import { OnlyEnFaArNumbersPattern } from '../../../../../../../../util/patterns';
import { UsedHeaderButtonModes } from '../../../../partials/used-header/models/used-header-button.modes';
import { UsedCompleteInformationService } from '../../services/used-complete-information.service';
import { SharedUsedService } from '../../../../services/shared-used.service';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { JourneyButtonsComponent } from '../../../../../../partials/journey-buttons/journey-buttons.component';
import { AsyncPipe } from '@angular/common';
import { InformationBodyModel } from '../../../../../../api/models/used/information-body.model';
import { OrderModel } from '../../../../../../api/models/renewal/order.model';
import { IntrackService } from '../../../../../../../../data-access/services/intrack.service';

@Component({
  selector: 'used-personal-information',
  templateUrl: './used-personal-information.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    JourneyButtonsComponent,
    AsyncPipe,
  ],
  styleUrls: ['./used-personal-information.component.scss']
})
export class UsedPersonalInformationComponent implements OnInit, OnDestroy {
  @Input() uniqueCode: string;
  @Output()
  dataRegistered = new EventEmitter<InformationBodyModel>();
  isSelfInsurance = true;
  valueLength = 11;
  accessToken: string;
  userId: string;
  subscriptions: Subscription[] = [];
  loading$: Observable<boolean> = this.loadingService.getLoading();
  form = this.formBuilder.group({
    mobile: ['', [
      Validators.required,
      Validators.pattern('^(?:09|۰۹)(?:[۰-۹0-9]){9}$'),
      Validators.minLength(this.valueLength),
      Validators.maxLength(this.valueLength)
    ]],
    firstName: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[\u0600-\u06FF\u0698\u067E\u0686\u06AF\s]+$/)
    ]],
    lastName: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[\u0600-\u06FF\u0698\u067E\u0686\u06AF\s]+$/)
    ]],
    nationalCode: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern(OnlyEnFaArNumbersPattern),
      Validators.maxLength(10),
      Validators.minLength(10)
    ]),
  });
  controls = this.form.controls;
  orderInfo: OrderModel;

  constructor(private loadingService: LoadingService,
              private formBuilder: UntypedFormBuilder,
              private intrackService: IntrackService,
              private usedInfoService: UsedCompleteInformationService,
              private service: SharedUsedService
  ) {
  }

  ngOnInit(): void {
    this.isSelfInsurance = true;
    this.setHeaderData();
    if (this.usedInfoService.getInformationValue()) {
      const info = this.usedInfoService.getInformationValue();
      this.fillForm(info.customerMobile, info.firstName, info.lastName, info.nationalCode);
    }

    const subscription = this.service.getOrderInfo()
      .subscribe((res) => {
        this.orderInfo = res;
        if (this.orderInfo) {
          this.fillForm(this.orderInfo.mobile, this.orderInfo.firstName,
            this.orderInfo.lastName, this.orderInfo.nationalCode);
        }
      });
    this.subscriptions.push(subscription);
  }

  fillForm(mobile: string, firstName: string, lastName: string, nationalCode: string): void {
    const controls = this.form.controls;
    controls.mobile.patchValue(mobile);
    controls.firstName.patchValue(firstName);
    controls.lastName.patchValue(lastName);
    controls.nationalCode.patchValue(nationalCode);
  }

  changeModeRegister(): void {
    const controls = this.form.controls;
    if (this.isSelfInsurance) {
      this.usedInfoService.setInformation({
        key: null,
        firstName: controls.firstName.value,
        lastName: controls.lastName.value,
        customerMobile: controls.mobile.value,
        hasDifferentHolder: !this.isSelfInsurance,
        nationalCode: controls.nationalCode.value,
        serial: null
      });
      this.form.reset();
    } else {
      if (this.usedInfoService.getInformationValue()) {
        const info = this.usedInfoService.getInformationValue();
        this.fillForm(info.customerMobile, info.firstName, info.lastName, info.nationalCode);
      }
    }
    this.isSelfInsurance = !this.isSelfInsurance;
  }

  registerInformation(): void {
    this.intrackService.sendIntrackEvent('I_CPI', {
      DeviceModel: this.orderInfo?.productModel ?? '',
      DeviceBrand: this.orderInfo?.productBrand ?? '',
      DevicePrice: this.orderInfo?.announcedPrice ?? 0,
      uniquecode: this.uniqueCode ?? '',
      TotalAmountPaid: (this.orderInfo?.taxAmount || 0) + (this.orderInfo?.payableAmount || 0),
      VoucherUsed: !!this.orderInfo?.voucherId,
      PaymentWay: this.orderInfo?.paymentTicketTypeTitle ?? ''
    });
    const controls = this.form.controls;
    const personalInfo = {
      ...this.form.value,
      ...{
        hasDifferentHolder: !this.isSelfInsurance
      }
    };
    this.usedInfoService.setInformation({
      key: null,
      firstName: controls.firstName.value,
      lastName: controls.lastName.value,
      customerMobile: controls.mobile.value,
      hasDifferentHolder: !this.isSelfInsurance,
      nationalCode: controls.nationalCode.value,
      serial: null
    });
    this.dataRegistered.emit(personalInfo);
  }

  setHeaderData(): void {
    this.service.setHeaderData({
      showBackBtn: false,
      headerTitle: 'اطلاعات شخصی',
      actionButtons: [
        {mode: UsedHeaderButtonModes.PROFILE}
      ]
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s && s.unsubscribe());
    this.loadingService.setLoading(false);
  }
}

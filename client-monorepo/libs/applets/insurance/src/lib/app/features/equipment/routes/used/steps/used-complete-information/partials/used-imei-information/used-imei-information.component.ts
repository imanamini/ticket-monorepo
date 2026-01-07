import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { convertNonEnglishDigits } from '@digipay/strings';
import { Observable } from 'rxjs';
import { LoadingService } from '../../../../../../../../data-access/services/loading.service';
import { AppWindow } from '../../../../../../../../data-access/web-interfaces/app-window';
import { UsedHeaderButtonModes } from '../../../../partials/used-header/models/used-header-button.modes';
import { InsuranceJsInterface } from '../../../../../../../../data-access/web-interfaces/insurance-js-interface';
import { OnlyEnFaArNumbersPattern } from '../../../../../../../../util/patterns';
import { UsedCompleteInformationService } from '../../services/used-complete-information.service';
import { SharedUsedService } from '../../../../services/shared-used.service';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { JourneyButtonsComponent } from '../../../../../../partials/journey-buttons/journey-buttons.component';
import { AsyncPipe } from '@angular/common';
import { UsedInfoBoxComponent } from '../../../../partials/used-info-box/used-info-box.component';
import { OrderModel } from '../../../../../../api/models/renewal/order.model';
import { InformationBodyModel } from '../../../../../../api/models/used/information-body.model';
import { IntrackService } from '../../../../../../../../data-access/services/intrack.service';

declare const window: AppWindow;

@Component({
  selector: 'used-imei-information',
  templateUrl: './used-imei-information.component.html',
  standalone: true,
  imports: [
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    JourneyButtonsComponent,
    AsyncPipe,
    UsedInfoBoxComponent
  ],
  styleUrls: ['./used-imei-information.component.scss']
})
export class UsedImeiInformationComponent implements OnInit {

  @Input() orderInfo: OrderModel;
  @Input() uniqueCode: string;
  @Output()
  imeiRegistered = new EventEmitter<InformationBodyModel>();
  mPreSelectedImei: string;
  loading$: Observable<boolean> = this.loadingService.getLoading();
  valueLength = 15;
  isFromNativeApp = this.service.getIsUserFromNativeAppValue();
  // It has to be implemented later
  isFromHybridApp = false;
  form = this.formBuilder.group({
    imei: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern(OnlyEnFaArNumbersPattern),
      Validators.minLength(this.valueLength),
      Validators.maxLength(this.valueLength)
    ]),
  });
  controls = this.form.controls;

  constructor(private formBuilder: UntypedFormBuilder,
              private service: SharedUsedService,
              private intrackService: IntrackService,
              private infoService: UsedCompleteInformationService,
              private loadingService: LoadingService,
  ) {
  }

  get preSelectedImei(): string {
    return this.mPreSelectedImei;
  }

  @Input()
  set preSelectedImei(val: string) {
    if (val) {
      this.mPreSelectedImei = val;
      this.fillForm(val);
    }
  }

  ngOnInit(): void {
    this.setHeaderData();
    const serial = this.infoService.getInformationValue()?.serial;
    if (serial) {
      this.fillForm(serial);
    }
  }

  fillForm(imei: string): void {
    this.controls.imei.patchValue(imei);
    this.controls.imei.markAsTouched();
  }

  getImei(): void {
    /*
    * Get IMEI From Native App **/
    if (this.isFromNativeApp) {
      if (window.DigipayJsInterface && typeof window.DigipayJsInterface.getImei === 'function') {
        window.DigipayJsInterface = window.DigipayJsInterface || {} as InsuranceJsInterface;
        window.DigipayJsInterface.setImei = (imei: string) => {
          if (imei) {
            this.controls.imei.patchValue(imei);
          }
        };
        window.DigipayJsInterface.getImei();
      }
    }
    if (this.isFromHybridApp) {
      if (window.digipayHybridApp && typeof window.digipayHybridApp.getImei === 'function') {
        window.digipayHybridApp.setImei = (imei: string) => {
          if (imei) {
            this.controls.imei.patchValue(imei);
          }
        };
        window.digipayHybridApp.getImei();
        return;
      }
    }
    if (!this.isFromNativeApp && !this.isFromHybridApp) {
      window.location.href = 'tel:' + encodeURIComponent('*#06#');
    }

  }

  setHeaderData(): void {
    this.service.setHeaderData({
      showBackBtn: true,
      headerTitle: 'شماره سریال دستگاه',
      actionButtons: [
        {mode: UsedHeaderButtonModes.PROFILE},
      ]
    });
  }

  registerInfo(): void {
    const orderInfoValue: OrderModel = this.service.getOrderInfoValue();
    this.intrackService.sendIntrackEvent('I_CIMEI', {
      DeviceModel: orderInfoValue?.productModel ?? '',
      DeviceBrand: orderInfoValue?.productBrand ?? '',
      DevicePrice: orderInfoValue?.announcedPrice ?? 0,
      TotalAmountPaid: (orderInfoValue?.taxAmount || 0) + (orderInfoValue?.payableAmount || 0),
      VoucherUsed: !!orderInfoValue?.voucherId,
      PaymentWay: orderInfoValue?.paymentTicketTypeTitle,
      uniquecode: this.uniqueCode ?? '',
      DeviceIMEI: this.form.value
    });
    this.infoService.setInformation(
      {
        ...this.infoService.getInformationValue(),
        serial: convertNonEnglishDigits(this.controls.imei.value)
      });
    this.imeiRegistered.emit(this.form.value);

  }
}

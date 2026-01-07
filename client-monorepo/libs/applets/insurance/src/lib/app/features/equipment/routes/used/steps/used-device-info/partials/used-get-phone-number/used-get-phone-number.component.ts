import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { convertNonEnglishDigits } from '@digipay/strings';
import { Observable, Subscription } from 'rxjs';

import { UsedDeviceInfoService } from '../../services/used-device-info.service';
import { LoadingService } from '../../../../../../../../data-access/services/loading.service';
import { SharedUsedService } from '../../../../services/shared-used.service';
import { UsedStoredDeviceInfoModel } from '../../models/used-stored-device-info.model';
import { LoggedInUser } from '../../../../../../../../data-access/models/logged-in-user.model';
import { JourneyNamesModel } from '../../../../../../shared-steps/models/journey-names.model';
import { AsyncPipe, NgIf } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { UiButtonComponent } from '../../../../../../../../components/ui-button/ui-button/ui-button.component';
import {
  UiLoadingSpinnerComponent
} from '../../../../../../../../components/ui-loading-spinner/ui-loading-spinner.component';

@Component({
  selector: 'used-get-phone-number',
  templateUrl: './used-get-phone-number.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    NgIf,
    UiButtonComponent,
    UiLoadingSpinnerComponent
  ],
  styleUrls: ['./used-get-phone-number.component.scss']
})
export class UsedGetPhoneNumberComponent implements OnInit {

  constructor(private sheetRef: MatBottomSheetRef<UsedGetPhoneNumberComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public sheetData: { phoneNumber: string },
              private deviceInfoService: UsedDeviceInfoService,
              private loadingService: LoadingService,
              private sharedService: SharedUsedService,
              private fb: UntypedFormBuilder) {
  }

  subscriptions: Subscription[] = [];
  storedDeviceInfo: UsedStoredDeviceInfoModel;
  form: UntypedFormGroup = this.fb.group({
    phoneNumber: ['', [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11),
      Validators.pattern('^(?:09|۰۹)(?:[۰-۹0-9]){9}$'),
    ]]
  });
  uniqueCode: string;
  loading$: Observable<boolean> = this.loadingService.getLoading();
  userInfo: LoggedInUser;

  ngOnInit(): void {
    this.sharedService.setJourney(JourneyNamesModel.USED_DEVICE);
    this.getStoredDeviceInfo();
    if (this.sheetData.phoneNumber) {
      this.fillForm(this.sheetData.phoneNumber);
    }
  }

  getStoredDeviceInfo(): void {
    this.storedDeviceInfo = this.deviceInfoService.getStoredDeviceInfo();
    this.loadingService.setLoading(false);
  }

  fillForm(mobile: string): void {
    this.form.controls.phoneNumber.patchValue(mobile);
  }

  closeDialog(): void {
    const phoneNumber = convertNonEnglishDigits(this.form.get('phoneNumber').value);
    this.deviceInfoService.setStoredDeviceInfo({...this.storedDeviceInfo, phoneNumber});
    if (this.storedDeviceInfo?.phoneNumber && this.storedDeviceInfo?.phoneNumber !== phoneNumber) {
      this.deviceInfoService.setStoredDeviceInfo({
        ...this.storedDeviceInfo,
        brandTitle: null,
        brandId: null,
        modelTitle: null,
        modelId: null,
        deviceId: null
      });
    }
    this.subscriptions.forEach((s) => s && s.unsubscribe());
    return this.sheetRef.dismiss(phoneNumber);
  }

}

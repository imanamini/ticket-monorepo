import { Component, inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ApplicationFormApiService } from '../../../../data-access/services/third-party/application-form-api.service';
import { InsAlertComponent } from '../../../../../../components/ins-alert/ins-alert.component';
import { CarInfoFormComponent } from '../../components/car-info-form/car-info-form.component';
import { CarInfoBoxComponent } from '../../components/car-info-box/car-info-box.component';
import { QueryParamService } from '../../../../../../data-access/services/query-param.service';
import { BaseComponent } from '../../../../../../components/base/base.component';
import { VehicleSharedService } from '../../../../data-access/services/vehicle-shared.service';
import { QueryParamKeysEnum } from '../../../../../home/query-param-keys.enum';
import { AlertSizeEnum } from '../../../../../../data-access/enums/alert-size.enum';
import { ThirdPartyUrlsEnum } from '../../data-access/enums/third-party-urls.enum';
import { IconEnum } from '../../../../../../data-access/enums/icon.enum';
import { StoreService } from '../../data-access/services/store.service';
import { InsuranceProductTypeEnum } from '../../../../../../data-access/enums/Insurance-product-type.enum';

@Component({
  selector: 'car-info',
  standalone: true,
  imports: [
    CarInfoBoxComponent,
    CarInfoFormComponent,
    InsAlertComponent
  ],
  templateUrl: './car-info.component.html',
  styleUrl: './car-info.component.scss',
})
export class CarInfoComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  private appFormApiService = inject(ApplicationFormApiService);
  private sharedService = inject(VehicleSharedService);
  private untypedFormBuilder = inject(UntypedFormBuilder);
  private queryParamService = inject(QueryParamService);
  private storeService = inject(StoreService);

  protected readonly IconEnum = IconEnum;
  protected readonly AlertSizeEnum = AlertSizeEnum;

  showError = false;
  carInfoForm: UntypedFormGroup = this.untypedFormBuilder.group({});

  ngOnInit(): void {
    this.storeService.loadUnauthorizedApplicationData();
  }

  handleActiveButtonsClicked(): void {
    if (!this.carInfoForm.valid) {
      this.showError = true;
      return;
    }

    super.addSubscription(this.appFormApiService.putApplicationForm({
      ...this.storeService.getStoreValueAsPutRequest(),
      applicationFormId: this.storeService?.getFormId(),
      vehicleInfo: {
        ...this.storeService.getStoreValueAsPutRequest().vehicleInfo,
        carUsageId: this.carInfoForm?.value?.usage,
        carModelId: this.carInfoForm?.value?.model,
        carBuildYear: this.carInfoForm?.value?.buildYear?.toString(),
      }
    }).subscribe({
      next: res => {
        this.storeService.setStoreData(res.result);
        this.sharedService.navigate(ThirdPartyUrlsEnum.ExInsurer, null, InsuranceProductTypeEnum.ThirdParty);
      }
    }));
  }

  handleDeActiveButtonClicked(): void {
    this.queryParamService.deleteQueryParams([QueryParamKeysEnum.JourneyType]).then(() => {
      this.location.back();
    });
  }
}

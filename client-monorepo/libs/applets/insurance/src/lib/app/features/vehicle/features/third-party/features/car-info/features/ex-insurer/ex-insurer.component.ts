import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';

import {
  ApplicationFormApiService
} from '../../../../../../data-access/services/third-party/application-form-api.service';
import { ExInsurerFormComponent } from '../../../../components/ex-insurer-form/ex-insurer-form.component';
import { CarInfoBoxComponent } from '../../../../components/car-info-box/car-info-box.component';
import { BaseComponent } from '../../../../../../../../components/base/base.component';
import { VehicleSharedService } from '../../../../../../data-access/services/vehicle-shared.service';
import { ThirdPartyUrlsEnum } from '../../../../data-access/enums/third-party-urls.enum';
import { StoreService } from '../../../../data-access/services/store.service';
import { ExtraInsurerForm } from '../../../../../../data-access/enums/extra-insurance-company-items.enum';
import {
  ApplicationFormPutRequestModel
} from '../../../../../../data-access/models/application-form/application-form-put-request.model';
import { InsuranceProductTypeEnum } from '../../../../../../../../data-access/enums/Insurance-product-type.enum';
import moment from 'jalali-moment';

@Component({
  selector: 'ex-insurer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CarInfoBoxComponent,
    ExInsurerFormComponent
  ],
  templateUrl: './ex-insurer.component.html',
  styleUrl: './ex-insurer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExInsurerComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  private sharedService = inject(VehicleSharedService);
  private untypedFormBuilder = inject(UntypedFormBuilder);
  private appFormApiService = inject(ApplicationFormApiService);
  private storeService = inject(StoreService);

  showError = false;

  exInsurerForm = this.untypedFormBuilder.group({});

  errorMapper: { [key: string]: string } = {
    required: '',
  };

  ngOnInit(): void {
    this.storeService.loadUnauthorizedApplicationData();
  }

  handleActiveButtonClicked(): void {
    if (!this.exInsurerForm.valid) {
      this.showError = true;
      return;
    }

    const model: ApplicationFormPutRequestModel = {
      ...this.storeService.getStoreValueAsPutRequest(),
      applicationFormId: this.storeService?.getFormId(),
      previousInsuranceDetail: {
        ...this.storeService.getStoreValueAsPutRequest().previousInsuranceDetail,
        insurerParty: {
          ...this.storeService.getStoreValueAsPutRequest().previousInsuranceDetail?.insurerParty,
          insurerPartyId: this.exInsurerForm?.controls.name?.value
        }
      }
    };
    const hasExtraInsurer = model.previousInsuranceDetail.insurerParty.insurerPartyId === ExtraInsurerForm.NoInsurance ||
      model.previousInsuranceDetail.insurerParty.insurerPartyId === ExtraInsurerForm.NewCar;

    if (hasExtraInsurer) {
      if (model.previousInsuranceDetail.insurerParty.insurerPartyId === ExtraInsurerForm.NoInsurance) {
        model.vehicleInfo.releaseDate = null;
      } else if (model.previousInsuranceDetail.insurerParty.insurerPartyId === ExtraInsurerForm.NewCar) {
        model.vehicleInfo.releaseDate =
          moment(this.exInsurerForm?.controls?.releaseDate?.value, 'jYYYY/jMM/jDD')
            .format('YYYY/MM/DD');
      }
      model.previousInsuranceDetail.insurerParty.insurerPartyId = null;
    }
    super.addSubscription(this.appFormApiService.putApplicationForm(model).subscribe({
      next: res => {
        this.storeService.setStoreData(res.result);
        if (hasExtraInsurer) {
          this.sharedService.navigate(ThirdPartyUrlsEnum.PriceCardList, null, InsuranceProductTypeEnum.ThirdParty);
        } else {
          this.sharedService.navigate(ThirdPartyUrlsEnum.ExInsurerDate, null, InsuranceProductTypeEnum.ThirdParty);
        }
      }
    }));
  }

  handleDeActiveButtonClicked(): void {
    this.location.back();
  }
}

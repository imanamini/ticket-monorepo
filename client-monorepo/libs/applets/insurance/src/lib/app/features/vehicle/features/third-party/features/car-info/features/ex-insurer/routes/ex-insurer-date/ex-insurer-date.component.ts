import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { CarInfoBoxComponent } from '../../../../../../components/car-info-box/car-info-box.component';
import { VehicleSharedService } from '../../../../../../../../data-access/services/vehicle-shared.service';
import {
  ExInsurerDateFormComponent
} from '../../../../../../components/ex-insurer-date-form/ex-insurer-date-form.component';
import {
  ApplicationFormApiService
} from '../../../../../../../../data-access/services/third-party/application-form-api.service';
import { ThirdPartyUrlsEnum } from '../../../../../../data-access/enums/third-party-urls.enum';
import {
  BaseComponent
} from '../../../../../../../../../../components/base/base.component';
import { StoreService } from '../../../../../../data-access/services/store.service';
import { InsuranceProductTypeEnum } from '../../../../../../../../../../data-access/enums/Insurance-product-type.enum';
import moment from 'jalali-moment';

@Component({
  selector: 'ex-insurer-date',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CarInfoBoxComponent,
    ExInsurerDateFormComponent
  ],
  templateUrl: './ex-insurer-date.component.html',
  styleUrl: './ex-insurer-date.component.scss',
})
export class ExInsurerDateComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  private appFormApiService = inject(ApplicationFormApiService);
  private sharedService = inject(VehicleSharedService);
  private untypedFormBuilder = inject(UntypedFormBuilder);
  private storeService = inject(StoreService);

  showError = false;
  dateForm = this.untypedFormBuilder.group({});

  ngOnInit(): void {
    this.storeService.loadUnauthorizedApplicationData();
  }

  handleActiveButtonClicked(): void {
    if (!this.dateForm.valid) {
      this.showError = true;
      return;
    }

    super.addSubscription(this.appFormApiService.putApplicationForm({
      ...this.storeService.getStoreValueAsPutRequest(),
      applicationFormId: this.storeService?.getFormId(),
      previousInsuranceDetail: {
        ...this.storeService.getStoreValueAsPutRequest().previousInsuranceDetail,
        endsAt: moment(this.dateForm.controls.end.value, 'jYYYY/jMM/jDD').locale('en').valueOf(),
        startsAt: moment(this.dateForm.controls.start.value, 'jYYYY/jMM/jDD').locale('en').valueOf()
      }
    }).subscribe({
      next: res => {
        this.storeService.setStoreData(res.result);
        this.sharedService.navigate(ThirdPartyUrlsEnum.OwnershipChange, null, InsuranceProductTypeEnum.ThirdParty);
      }
    }));
  }

  handleDeActiveButtonClicked(): void {
    this.location.back();
  }
}

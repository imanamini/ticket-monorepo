import { Component, inject, input, model, OnInit } from '@angular/core';
import { FormFieldOption } from '@digipay/ui-form-field-builder/lib/models/form-field-option.interface';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { DeviceDetector } from '@digipay/layout';

import { CarDataModel } from '../../../../data-access/models/third-party/constant-all/car-data.model';
import { BaseComponent } from '../../../../../../components/base/base.component';
import { FormControlItemModel } from '../../../../data-access/models/form-control-item.model';
import { StoreService } from '../../data-access/services/store.service';
import { ConstantAllService } from '../../../../data-access/services/shared/constant-all.service';

@Component({
  selector: 'discount-detail-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule
  ],
  templateUrl: './discount-detail-form.component.html',
  styleUrl: './discount-detail-form.component.scss'
})
export class DiscountDetailFormComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  private constantAllService = inject(ConstantAllService);
  private deviceDetector = inject(DeviceDetector);
  private storeService = inject(StoreService);

  discountForm = input.required<FormGroup>();
  showError = model<boolean>(false);

  thirdPartyDiscounts: FormFieldOption[] = [];
  driverDiscounts: FormFieldOption[] = [];

  formControls: FormControlItemModel[] = [
    {
      name: 'thirdPartyDiscount',
      disabled: false,
      validators: []
    },
    {
      name: 'driverDiscount',
      disabled: false,
      validators: []
    },
  ];

  errorMapper: { [key: string]: string } = {
    required: '',
  };

  showRadioButton = false;

  ngOnInit(): void {
    this.setFormControls();
    this.getThirdPartyDiscounts();
    this.getDriverDiscounts();
    this.getDataFromURL();
    this.showRadioButton = !this.deviceDetector.isDesktop;
  }

  getDriverDiscounts(): void {
    super.addSubscription(this.constantAllService.getDriverDiscounts().subscribe({
      next: res => {
        this.driverDiscounts = this.mapToDropdown(res);
      }
    }));
  }

  getThirdPartyDiscounts(): void {
    super.addSubscription(this.constantAllService.getThirdPartyDiscounts().subscribe({
      next: res => {
        this.thirdPartyDiscounts = this.mapToDropdown(res);
      }
    }));
  }

  getDataFromURL(): void {
    super.addSubscription(this.storeService.getStoreDataAsObservable()
      .subscribe({
        next: value => {
          const driverDiscount = value?.previousInsurance?.driverDiscount?.id;
          const thirdPartyDiscount = value?.previousInsurance?.thirdPartyDiscount?.id;

          if (thirdPartyDiscount) {
            this.discountForm()?.controls.thirdPartyDiscount.setValue(thirdPartyDiscount);
          }

          if (driverDiscount) {
            this.discountForm()?.controls.driverDiscount.setValue(driverDiscount);
          }
        }
      }));
  }

  setFormControls(): void {
    this.formControls.forEach(item => {
      this.discountForm()?.setControl(item.name, new FormControl({
        value: null,
        disabled: item.disabled
      }, [Validators.required, ...item.validators]));
    });
  }

  private mapToDropdown(res: Array<CarDataModel>): Array<FormFieldOption> {
    return res?.map(b => ({
      title: !isNaN(+b.title) ? (b.title + ' درصد ') : b.title,
      value: b.id
    }));
  }
}

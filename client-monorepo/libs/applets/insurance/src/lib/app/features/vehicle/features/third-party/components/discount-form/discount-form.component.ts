import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { InsRadioButtonComponent } from '../../../../components/ins-radio-button/ins-radio-button.component';
import { InsRadioButtonItemModel } from '../../../../data-access/models/ins-radio-button-item.model';
import { BaseComponent } from '../../../../../../components/base/base.component';
import { FormControlItemModel } from '../../../../data-access/models/form-control-item.model';
import { StoreService } from '../../data-access/services/store.service';
import { ConstantAllService } from '../../../../data-access/services/shared/constant-all.service';

@Component({
  selector: 'discount-form',
  standalone: true,
  imports: [
    InsRadioButtonComponent
  ],
  templateUrl: './discount-form.component.html',
  styleUrl: './discount-form.component.scss'
})
export class DiscountFormComponent extends BaseComponent implements OnInit, OnDestroy {

  constructor() {
    super();
  }

  private storeService = inject(StoreService);
  discountForm = input.required<FormGroup>();
  showError = input<boolean>(false);

  items: InsRadioButtonItemModel[] = [
    {
      title: 'تخفیفی ندارم',
      value: 0
    },
    {
      title: 'با همین پلاک تخفیف دارم',
      value: 1
    }
  ];

  formControls: FormControlItemModel[] = [
    {
      name: 'discount',
      disabled: false,
      validators: []
    }
  ];

  ngOnInit(): void {
    this.setFormControls();
    this.getDataFromUrl();
  }

  getDataFromUrl(): void {

    super.addSubscription(this.storeService.getStoreDataAsObservable().subscribe({
      next: (value) => {
        const areDiscountsSelected = value.previousInsurance?.thirdPartyDiscount && value.previousInsurance?.thirdPartyDiscount.id
          && value.previousInsurance?.driverDiscount && value.previousInsurance?.driverDiscount.id;
        this.discountForm()?.controls?.discount?.setValue(areDiscountsSelected ? (this.storeService.hasDiscount ? 1 : 0) : null);
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

  handleValueChange(e: number | null): void {
    this.discountForm()?.controls.discount?.setValue(e);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.formControls.forEach(item => {
      this.discountForm()?.removeControl(item.name);
    });
  }
}

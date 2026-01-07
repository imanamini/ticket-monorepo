import { Component, inject, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { InsRadioButtonComponent } from '../../../../components/ins-radio-button/ins-radio-button.component';
import { InsRadioButtonItemModel } from '../../../../data-access/models/ins-radio-button-item.model';
import { BaseComponent } from '../../../../../../components/base/base.component';
import { FormControlItemModel } from '../../../../data-access/models/form-control-item.model';
import { StoreService } from '../../data-access/services/store.service';
import { ConstantAllService } from '../../../../data-access/services/shared/constant-all.service';

@Component({
  selector: 'claim-form',
  standalone: true,
  imports: [
    InsRadioButtonComponent
  ],
  templateUrl: './claim-form.component.html',
  styleUrl: './claim-form.component.scss'
})
export class ClaimFormComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  private storeService = inject(StoreService);
  private constantAllService = inject(ConstantAllService);
  showError = input<boolean>(false);
  claimForm = input.required<FormGroup>();

  items: InsRadioButtonItemModel[] = [
    {
      title: 'بله، گرفته‌ام',
      value: 1
    },
    {
      title: 'خیر، نگرفته‌ام',
      value: 0
    }
  ];

  formControls: FormControlItemModel[] = [
    {
      name: 'claim',
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
        const isEmpty =
          value?.previousInsurance?.propertyDamage.id == null &&
          value?.previousInsurance?.propertyDamage.id == null &&
          value?.previousInsurance?.driverDamage.id == null;
        if (isEmpty) {
          return;
        }
        const hasPropertyDamage = value?.previousInsurance?.propertyDamage.id !== this.constantAllService.propertyDamageDefaultValue();
        const hasHealthDamage = value?.previousInsurance?.healthDamage.id !== this.constantAllService.healthDamageDefaultValue();
        const hasDriverDamage = value?.previousInsurance?.driverDamage.id !== this.constantAllService.driverDamageDefaultValue();
        const hasClaim = hasPropertyDamage || hasHealthDamage || hasDriverDamage;
        this.claimForm()?.controls?.claim?.setValue(hasClaim ? 1 : 0);
      }
    }));
  }

  setFormControls(): void {
    this.formControls.forEach(item => {
      this.claimForm()?.setControl(item.name, new FormControl({
        value: null,
        disabled: item.disabled
      }, [Validators.required, ...item.validators]));
    });
  }

  handleValueChange(e: number | null): void {
    this.claimForm()?.controls.claim?.setValue(e);
  }
}

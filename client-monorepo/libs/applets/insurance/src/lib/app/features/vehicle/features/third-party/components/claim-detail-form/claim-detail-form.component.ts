import { Component, inject, input, model, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldOption } from '@digipay/ui-form-field-builder/lib/models/form-field-option.interface';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { DeviceDetector } from '@digipay/layout';

import { BaseComponent } from '../../../../../../components/base/base.component';
import { FormControlItemModel } from '../../../../data-access/models/form-control-item.model';
import { StoreService } from '../../data-access/services/store.service';
import { ConstantAllService } from '../../../../data-access/services/shared/constant-all.service';

@Component({
  selector: 'claim-detail-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule
  ],
  templateUrl: './claim-detail-form.component.html',
  styleUrl: './claim-detail-form.component.scss'
})
export class ClaimDetailFormComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  private constantAllService = inject(ConstantAllService);
  private deviceDetector = inject(DeviceDetector);
  private storeService = inject(StoreService);

  claimDetailForm = input.required<FormGroup>();
  showError = model<boolean>(false);

  propertyDamages: FormFieldOption[] = [];
  driverDamages: FormFieldOption[] = [];
  healthDamages: FormFieldOption[] = [];

  errorMapper: { [key: string]: string } = {
    required: '',
  };

  formControls: FormControlItemModel[] = [
    {
      name: 'propertyDamage',
      disabled: false,
      validators: []
    },
    {
      name: 'driverDamage',
      disabled: false,
      validators: []
    },
    {
      name: 'healthDamage',
      disabled: false,
      validators: []
    },
  ];
  showRadioButton = false;

  ngOnInit(): void {
    this.getDriverDamages();
    this.getHealthDamages();
    this.getPropertyDamages();
    this.setFormControls();
    this.getDataFromURL();
    this.showRadioButton = !this.deviceDetector.isDesktop;
  }

  getPropertyDamages(): void {
    super.addSubscription(this.constantAllService.getPropertyDamages().subscribe({
      next: res => {
        this.propertyDamages = res.map(p => ({title: p.title, value: p.id}));
      }
    }));
  }

  getDriverDamages(): void {
    super.addSubscription(this.constantAllService.getDriverDamages().subscribe({
      next: res => {
        this.driverDamages = res.map(d => ({title: d.title, value: d.id}));
      }
    }));
  }

  getHealthDamages(): void {
    super.addSubscription(this.constantAllService.getHealthDamages().subscribe({
      next: res => {
        this.healthDamages = res.map(h => ({title: h.title, value: h.id}));
      }
    }));
  }

  getDataFromURL(): void {
    super.addSubscription(this.storeService.getStoreDataAsObservable().subscribe({
      next: value => {
        const propertyDamages = value?.previousInsurance?.propertyDamage?.id;
        const healthDamage = value?.previousInsurance?.healthDamage?.id;
        const driverDamage = value?.previousInsurance?.driverDamage?.id;

        if (propertyDamages) {
          this.claimDetailForm()?.controls.propertyDamage?.setValue(propertyDamages);
        }

        if (healthDamage) {
          this.claimDetailForm()?.controls.healthDamage?.setValue(healthDamage);
        }

        if (driverDamage) {
          this.claimDetailForm()?.controls.driverDamage?.setValue(driverDamage);
        }
      }
    }));
  }

  setFormControls(): void {
    this.formControls.forEach(item => {
      this.claimDetailForm()?.setControl(item.name, new FormControl({
        value: null,
        disabled: item.disabled
      }, [Validators.required, ...item.validators]));
    });
  }
}

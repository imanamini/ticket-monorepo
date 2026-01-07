import { Component, effect, inject, input, model, OnInit } from '@angular/core';
import { FormFieldOption } from '@digipay/ui-form-field-builder/lib/models/form-field-option.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { DeviceDetector } from '@digipay/layout';
import moment from 'jalali-moment';

import { ConstantsApiService } from '../../../../data-access/services/shared/constants-api.service';
import { BaseComponent } from '../../../../../../components/base/base.component';
import { FormControlItemModel } from '../../../../data-access/models/form-control-item.model';
import { StoreService } from '../../data-access/services/store.service';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { GetTitleFromDropdownModelPipe } from '../../../../../../pipes/get-title-from-dropdown-model.pipe';
import { ConstantAllService } from '../../../../data-access/services/shared/constant-all.service';

@Component({
  selector: 'car-info-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    NgxTooltipDirective,
    GetTitleFromDropdownModelPipe
  ],
  templateUrl: './car-info-form.component.html',
  styleUrl: './car-info-form.component.scss'
})
export class CarInfoFormComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
    effect(() => {
      if (!this.showUsage()) {
        this.carInfoForm()?.removeControl('usage');
      }
    });
  }

  private apiService = inject(ConstantsApiService);
  private constantAllServices = inject(ConstantAllService);
  public deviceDetector = inject(DeviceDetector);
  private storeService = inject(StoreService);

  carInfoForm = input.required<FormGroup>();
  showUsage = input<boolean>(true);
  showError = model<boolean>(false);

  types: FormFieldOption[] = [];
  usages: FormFieldOption[] = [];
  brands: FormFieldOption[] = [];
  models: FormFieldOption[] = [];
  years: FormFieldOption[] = [];

  latestBrandId: number;
  latestCarTypeId: number;

  formControls: FormControlItemModel[] = [
    {
      name: 'type',
      disabled: false,
      validators: []
    },
    {
      name: 'usage',
      disabled: true,
      validators: []
    },
    {
      name: 'brand',
      disabled: true,
      validators: []
    },
    {
      name: 'model',
      disabled: true,
      validators: []
    },
    {
      name: 'buildYear',
      disabled: false,
      validators: []
    },
  ];

  errorMapper: { [key: string]: string } = {
    required: ''
  };

  showRadioButton = false;

  ngOnInit(): void {
    this.setFormControls();
    this.subscribeOnFormChanges();
    this.getTypes();
    this.getYears();
    this.showRadioButton = !this.deviceDetector.isDesktop;
  }

  getTypes(): void {
    super.addSubscription(this.constantAllServices.getCarTypes().subscribe({
      next: value => {
        if (!value) {
          return;
        }
        this.types = value.map(c => ({title: c.title, value: c.id}));
        if (this.types.length) {
          this.getDataFromURL();
        }
      }
    }));
  }

  getUsages(type: number): void {
    this.usages = [];
    super.addSubscription(this.constantAllServices.getCarUsages().subscribe({
      next: value => {
        this.usages = value.filter(u => u.carTypeId === type)
          .map(u => ({title: u.title, value: u.id}));
      }
    }));
  }

  getBrands(carTypeId: number): void {
    if (this.latestCarTypeId === carTypeId) {
      return;
    }
    this.latestCarTypeId = carTypeId;
    this.brands = [];
    super.addSubscription(this.apiService.getBrands(carTypeId).subscribe({
      next: value => {
        this.brands = value.result.map(b => ({title: b.title, value: b.id}));
      }
    }));
  }

  getModels(carBrandId: number): void {
    if (this.latestBrandId === carBrandId) {
      return;
    }
    this.latestBrandId = carBrandId;
    this.models = [];
    super.addSubscription(this.apiService.getModels(carBrandId).subscribe({
      next: value => {
        this.models = value.result.map(m => ({
          value: m.id,
          title: m.title
        }));
      }
    }));
  }

  getYears(): void {
    const currentYear = new Date().getFullYear();
    let shamsi = 1367;
    for (let i = 1988; i <= currentYear; i++) {
      this.years.push({
        title: i + ' - ' + shamsi,
        value: shamsi
      });
      shamsi += 1;
    }
    this.years = this.years.reverse();
  }

  getDataFromURL(): void {
    super.addSubscription(this.storeService.getStoreDataAsObservable().subscribe({
      next: value => {
        if (value?.vehicleInfo?.buildYear && +value?.vehicleInfo?.buildYear >= 1350
          && +value?.vehicleInfo?.buildYear <= moment().locale('fa').year()) {
          this.carInfoForm().controls.buildYear?.setValue(+value?.vehicleInfo?.buildYear);
        }

        if (!value?.vehicleInfo?.carType?.id) {
          return;
        }

        const type = value?.vehicleInfo?.carType?.id;
        this.carInfoForm().controls.type?.setValue(type);
        this.carInfoForm().controls.usage?.enable({
          onlySelf: true
        });

        if (!this.showUsage()) {
          this.carInfoForm().controls.brand?.enable({
            onlySelf: true
          });
        }

        if (value?.vehicleInfo?.carUsage?.id) {
          this.carInfoForm().controls.usage?.setValue(value?.vehicleInfo?.carUsage?.id);
          this.carInfoForm().controls.brand?.enable({
            onlySelf: true
          });
        }

        if (value?.vehicleInfo?.carBrand?.id) {
          this.carInfoForm().controls.brand?.setValue(value?.vehicleInfo?.carBrand?.id);
          this.carInfoForm().controls.brand?.enable({
            onlySelf: true
          });

          this.carInfoForm().controls.model?.enable({
            onlySelf: true
          });
        }

        if (value?.vehicleInfo?.carModel?.id) {
          this.carInfoForm().controls.model.setValue(value?.vehicleInfo?.carModel?.id);
        }
      }
    }));
  }

  subscribeOnFormChanges(): void {
    super.addSubscription(this.carInfoForm()?.valueChanges.subscribe({
      next: () => {
        this.showError.set(false);
      }
    }));

    super.addSubscription(this.carInfoForm().controls.type?.valueChanges.subscribe({
      next: value => {
        if (!value) {
          return;
        }
        this.getUsages(value);
        this.getBrands(value);
        this.carInfoForm().controls.usage?.setValue(null);
        this.carInfoForm().controls.brand.setValue(null);
        this.carInfoForm().controls.model.setValue(null);
        this.carInfoForm().controls.usage?.enable({
          onlySelf: true
        });
        if (!this.showUsage()) {
          this.carInfoForm().controls.brand?.enable({
            onlySelf: true
          });
        } else {
          this.carInfoForm().controls.brand.disable({
            onlySelf: true
          });
        }

        this.carInfoForm().controls.model.disable({
          onlySelf: true
        });
      }
    }));

    super.addSubscription(this.carInfoForm().controls.usage?.valueChanges.subscribe({
      next: value => {
        if (!value) {
          return;
        }
        this.carInfoForm().controls.brand.setValue(null);
        this.carInfoForm().controls.brand.enable({
          onlySelf: true
        });
        this.carInfoForm().controls.model.setValue(null);
        this.carInfoForm().controls.model.disable({
          onlySelf: true
        });
      }
    }));

    super.addSubscription(this.carInfoForm().controls.brand?.valueChanges.subscribe({
      next: value => {
        if (!value) {
          return;
        }
        this.getModels(value);
        this.carInfoForm().controls.model.setValue(null);
        this.carInfoForm().controls.model.enable({
          onlySelf: true
        });
      }
    }));
  }

  setFormControls(): void {
    this.formControls.forEach(item => {
      this.carInfoForm()?.setControl(item.name, new FormControl({
        value: null,
        disabled: item.disabled
      }, [Validators.required, ...item.validators]));
    });
  }
}

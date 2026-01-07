import { Component, effect, inject, input, model, OnInit, untracked } from '@angular/core';
import { FormFieldOption } from '@digipay/ui-form-field-builder/lib/models/form-field-option.interface';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { BaseComponent } from '../../../../../../components/base/base.component';
import { FormControlItemModel } from '../../../../data-access/models/form-control-item.model';
import { AddressModel } from '../../data-access/models/address.model';
import { DeviceDetector } from '@digipay/layout';
import { ConstantsApiService } from '../../../../data-access/services/shared/constants-api.service';
import { PostalCodeValidator } from '../../../../../../util/postal-code-validator';
import { NgxAlert } from '@digipay/ngx-alert';
import { InsDigikalaService } from '../../../../../../data-access/services/ins-digikala.service';

@Component({
  selector: 'address-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, UiFormFieldBuilderModule, NgxAlert],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
})
export class AddressFormComponent extends BaseComponent implements OnInit {
  constructor() {
    super();

    effect(() => {
      if (this.address()) {
        untracked(() => {
          this.addressForm()?.setValue({
            ...this.address(),
          });
        });
      }
    });
  }

  private constantsApiService = inject(ConstantsApiService);
  private deviceDetector = inject(DeviceDetector);
  private digikalaService = inject(InsDigikalaService);

  addressForm = input.required<FormGroup>();
  showError = model<boolean>(false);
  address = input<AddressModel>();

  provinces: FormFieldOption[] = [];
  cities: FormFieldOption[] = [];

  errorMapper: { [key: string]: string } = {
    required: '',
  };

  formControls: FormControlItemModel[] = [
    {
      name: 'province',
      disabled: false,
      validators: [],
    },
    {
      name: 'city',
      disabled: true,
      validators: [],
    },
    {
      name: 'address',
      disabled: false,
      validators: [Validators.maxLength(500)],
    },
    {
      name: 'number',
      disabled: false,
      validators: [Validators.maxLength(10)],
    },
    {
      name: 'apt',
      disabled: false,
      validators: [Validators.maxLength(10)],
    },
    {
      name: 'postalCode',
      disabled: false,
      validators: [Validators.minLength(10), Validators.maxLength(10), PostalCodeValidator],
    },
  ];

  showRadioButton = false;

  ngOnInit(): void {
    this.setFormControls();
    this.getProvinces();
    this.subscribeOnFormChanges();
    this.showRadioButton = !this.deviceDetector.isDesktop;
  }

  setFormControls(): void {
    this.formControls.forEach((item) => {
      this.addressForm()?.setControl(
        item.name,
        new FormControl(
          {
            value: null,
            disabled: item.disabled,
          },
          [Validators.required, ...item.validators],
        ),
      );
    });
  }

  getProvinces(): void {
    super.addSubscription(
      this.constantsApiService.getProvinces().subscribe({
        next: (res) => {
          this.provinces = res?.result.map((p) => ({ title: p.title, value: p.id })) ?? [];
        },
      }),
    );
  }

  goToAmlak(): void {
    const url = 'https://amlak.mrud.ir/';
    if (this.digikalaService.isDigikalaSuperApp) {
      this.digikalaService.openExternalLink(url);
      return;
    }
    window.open(url, '_blank');
  }

  getCities(province: number): void {
    this.cities = [];
    super.addSubscription(
      this.constantsApiService.getCities(province).subscribe({
        next: (res) => {
          this.cities = res?.result.map((c) => ({ title: c.title, value: c.id })) ?? [];
        },
      }),
    );
  }

  subscribeOnFormChanges(): void {
    super.addSubscription(
      this.addressForm().controls.province?.valueChanges.subscribe({
        next: (res) => {
          if (!res) {
            return;
          }
          this.getCities(res);
          this.addressForm()?.controls.city?.setValue(null);
          this.addressForm()?.controls.city?.enable({ onlySelf: true });
        },
      }),
    );
  }
}

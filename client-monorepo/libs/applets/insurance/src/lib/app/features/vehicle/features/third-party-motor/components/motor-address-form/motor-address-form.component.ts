import { Component, effect, inject, input, model, OnInit, signal, untracked } from '@angular/core';
import { FormFieldOption } from '@digipay/ui-form-field-builder/lib/models/form-field-option.interface';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { DeviceDetector } from '@digipay/layout';
import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';
import { FormControlItemModel } from '../../../../data-access/models/form-control-item.model';
import { ConstantsApiService } from '../../../../data-access/services/shared/constants-api.service';
import { AddressModel } from '../../../third-party/data-access/models/address.model';
import { PostalCodeValidator } from '../../../../../../util/postal-code-validator';
import { NgxAlert } from '@digipay/ngx-alert';

@Component({
  selector: 'motor-address-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    NgxAlert
  ],
  templateUrl: './motor-address-form.component.html',
  styleUrl: './motor-address-form.component.scss'
})
export class MotorAddressFormComponent extends ThirdPartyMotorDirective implements OnInit {

  constructor() {
    super();

    effect(() => {
      if (this.address()) {
        untracked(() => {
          this.addressForm()?.patchValue({
            province: this.address().province ?? null,
            city: this.address().city ?? null,
            address: this.address().address ?? '',
            number: this.address().number ?? '',
            apt: this.address().apt ?? '',
            postalCode: this.address().postalCode ?? null,
          });
        });
      }
    });
  }

  private constantsApiService = inject(ConstantsApiService);
  private deviceDetector = inject(DeviceDetector);

  showError = model<boolean>(false);

  addressForm = input.required<FormGroup>();
  address = input<AddressModel>();

  provinces = signal<FormFieldOption[]>([]);
  cities = signal<FormFieldOption[]>([]);
  errorMapper = signal<{ [key: string]: string }>({
    required: ''
  });

  formControls: FormControlItemModel[] = [
    {
      name: 'province',
      disabled: false,
      validators: []
    },
    {
      name: 'city',
      disabled: true,
      validators: []
    },
    {
      name: 'address',
      disabled: false,
      validators: [Validators.maxLength(500)]
    },
    {
      name: 'number',
      disabled: false,
      validators: [Validators.maxLength(10)]
    },
    {
      name: 'apt',
      disabled: false,
      validators: [Validators.maxLength(10)]
    },
    {
      name: 'postalCode',
      disabled: false,
      validators: [
        Validators.minLength(10),
        Validators.maxLength(10),
        PostalCodeValidator,
      ]
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
    this.formControls.forEach(item => {
      this.addressForm()?.setControl(item.name, new FormControl({
        value: null,
        disabled: item.disabled
      }, [Validators.required, ...item.validators]));
    });
  }

  getProvinces(): void {
    super.addSubscription(this.constantsApiService.getProvinces().subscribe({
      next: res => {
        this.provinces.set(res?.result.map(p => ({title: p.title, value: p.id})) ?? []);
      }
    }));
  }

  getCities(province: number): void {
    this.cities.set([]);
    super.addSubscription(this.constantsApiService.getCities(province).subscribe({
      next: res => {
        this.cities.set(res?.result.map(c => ({title: c.title, value: c.id})) ?? []);
      }
    }));
  }

  subscribeOnFormChanges(): void {
    super.addSubscription(this.addressForm().controls.province?.valueChanges.subscribe({
      next: res => {
        if (!res) {
          return;
        }
        this.getCities(res);
        this.addressForm()?.controls.city?.setValue(null);
        this.addressForm()?.controls.city?.enable({onlySelf: true});
      }
    }));
  }

  goToAmlak(): void {
    window.open('http://amlak.mrud.ir/', '_blank');
  }

  protected onClose(): void {
  }

  protected onNext(route: string): void {
  }
}

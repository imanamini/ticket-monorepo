import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { StepBase } from '../../../step-base';
import { RegistrationService } from '../../../../../registration.service';
import { FormFieldOption } from '@digipay/ui-form-field-builder';
import { Province } from '../../../../../../../api/models/geo/province';
import { CitiesApiService } from '../../../../../../../api/clients/registration/cities-api.service';
import { SmartDialog } from '../../../../../../../user-interface/services/smart-dialog';
import {
  AddressConfirmationDialogComponent
} from './address-confirmation-dialog/address-confirmation-dialog.component';
import { MessageService } from '../../../../../../../core/message.service';

@Component({
  selector: 'step-address',
  templateUrl: './step-address.component.html',
  styleUrls: ['./step-address.component.scss']
})
export class StepAddressComponent extends StepBase implements OnInit {

  form: UntypedFormGroup;

  submitting = false;

  provinceOptions: FormFieldOption[] = [];
  cityOptions: FormFieldOption[] = [];
  citiesApiResponse: Province[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private service: RegistrationService,
    private citiesApiService: CitiesApiService,
    private smartDialog: SmartDialog,
    private messageService: MessageService,
  ) {
    super();
    this.form = this.formBuilder.group({
      provinceCode: ['', Validators.required],
      cityCode: ['', [
        Validators.required
      ]],
      address: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.service.refreshTicketDetails().subscribe(detail => {
      this.form.controls['provinceCode'].setValue(detail?.registration.address.provinceCode);
      this.form.controls['cityCode'].setValue(detail?.registration.address.cityCode);
      this.form.controls['address'].setValue(detail?.registration.address.address);
    });

    const creditId = this.service.creditId;
    this.getCities(creditId);
    this.handleProvinceChange();

  }

  proceed(): void {
    if (this.submitting) {
      return;
    }
    this.smartDialog.open(AddressConfirmationDialogComponent, {
      address: this.form.controls['address'].value
    }).then(data => {
      if (data && data.confirmed) {
        this.submitting = true;
        this.service.setAddress(this.form.value).then(res => {
          this.submitting = false;
          this.nextStep.emit();
        }).catch(e => {
          this.submitting = false;
          this.messageService.showErrorIfExists(e);
        });
      }
    });
  }

  handleProvinceChange(): void {
    this.form.controls.provinceCode.valueChanges.subscribe(provinceCode => {
      if (provinceCode) {
        this.setCityOptions(provinceCode);
        this.form.patchValue({
          cityCode: ''
        });
      }
    });
  }

  getCities(creditId: string): void {
    this.citiesApiService.getPostalListOfCities(creditId).subscribe(res => {
      this.citiesApiResponse = res.provinces;
      this.provinceOptions = res.provinces.map(p => {
        return {
          value: p.code,
          title: p.value
        };
      });
      this.setCityOptions(this.form.controls.provinceCode.value);
    });
  }

  setCityOptions(provinceCode: string) {
    let options: FormFieldOption[] = [];
    this.citiesApiResponse.forEach(p => {
      if (p.code === provinceCode) {
        options = p.cities.map(c => {
          return {
            title: c.value,
            value: c.code
          };
        });
      }
    });
    this.cityOptions = options;
  }

  checkForbiddenChar = (input: string) => {
    const regex = /[\u0600-\u06FFa-zA-Z0-9, ]+/g;
    return regex.test(input);
  };
}

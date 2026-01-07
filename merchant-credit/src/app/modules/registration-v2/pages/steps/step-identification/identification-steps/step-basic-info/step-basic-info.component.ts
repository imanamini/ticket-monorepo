import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  UntypedFormGroup,
  ValidationErrors, ValidatorFn,
  Validators
} from '@angular/forms';
import { StepBase } from '../../../step-base';
import { CitiesApiService } from '../../../../../../../api/clients/registration/cities-api.service';
import { FormFieldOption } from '@digipay/ui-form-field-builder';
import { Province } from '../../../../../../../api/models/geo/province';
import { RegistrationService } from '../../../../../registration.service';
import { MessageService } from '../../../../../../../core/message.service';

enum NationalCardType {
  idCardSerialNo,
  nationalCardTrackingCode
}

@Component({
  selector: 'step-basic-info',
  templateUrl: './step-basic-info.component.html',
  styleUrls: ['./step-basic-info.component.scss']
})
export class StepBasicInfoComponent extends StepBase implements OnInit {

  personBasicInfo: { label: string, value: any, id?: string }[] = [];

  form: UntypedFormGroup;

  provinceOptions: FormFieldOption[] = [];

  cityOptions: FormFieldOption[] = [];

  citiesApiResponse: Province[] = [];

  expirationDateRange: [number, number] = [+new Date() - (10 * 365 * 24 * 60 * 60 * 1000), +new Date() + (20 * 365 * 24 * 60 * 60 * 1000)];

  sendingData: boolean = false;

  noServiceErrorData: {} = {};

  isError = false;
  selectedId: number = NationalCardType.idCardSerialNo;

  existNationalCodeInfo: any =
    {
      id: NationalCardType.idCardSerialNo,
      cardTitle: 'کارت ملی هوشمند دارم',
      icon: 'credit-card',
      content: {
        title: 'اطلاعات کارت هوشمند:'
      }
    };
  existNationalCardTrackingCodeInfo = {
    id: NationalCardType.nationalCardTrackingCode,
    cardTitle: 'کارت ملی هوشمند ندارم',
    icon: 'receipt',
    content: {
      title: 'اطلاعات کد رهگیری رسید کارت ملی:'
    }
  };
  checkEnglishChar = (input: string) => {
    const regex = /[a-zA-Z\s]{1}/g;
    return regex.test(input);
  };

  constructor(
    private registrationService: RegistrationService,
    private citiesApiService: CitiesApiService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {
    super();
    this.form = this.formBuilder.group({
      enName: ['', [Validators.required]],
      enSurname: ['', [Validators.required]],
      province: [''],
      city: ['', [
        Validators.required
      ]],
      postalCode: ['', [
        Validators.required,
        Validators.minLength(10),
      ]],
      idCardSerialNo: ['', [this.requiredIfSelectedIdIs(NationalCardType.idCardSerialNo).bind(this), Validators.pattern(/^(\d{1})([a-zA-Z]{1})(\d{8})$/)]],
      nationalCardTrackingCode: ['', [this.requiredIfSelectedIdIs(NationalCardType.nationalCardTrackingCode).bind(this), Validators.pattern(/\d{10}/)]]
    });
  }

  ngOnInit(): void {
    this.handleProvinceChange();
    const creditId = this.registrationService.creditId;
    this.getCities(creditId);
    this.getData();
  }

  handleProvinceChange(): void {
    this.form.controls.province.valueChanges.subscribe(province => {
      if (province) {
        let options: FormFieldOption[] = [];
        this.citiesApiResponse.forEach(p => {
          if (p.code === province) {
            options = p.cities.map(c => {
              return {
                title: c.value,
                value: c.code
              };
            });
          }
        });
        this.cityOptions = options;
        this.form.patchValue({
          city: ''
        });
      }
    });
  }

  getCities(creditId: string): void {
    this.citiesApiService.getBirthListOfCities(creditId).subscribe(res => {
      this.citiesApiResponse = res.provinces;
      this.provinceOptions = res.provinces.map(p => {
        return {
          value: p.code,
          title: p.value
        };
      });
    });
  }

  getData(): void {
    this.registrationService.refreshTicketDetails().subscribe(details => {
      if (details) {
        const identityInfo = details.registration.identityInfo;
        this.personBasicInfo = [
          {
            label: 'نام و نام خانوادگی',
            value: identityInfo.name,
          },
          {
            label: 'کد ملی',
            value: details.registration.nationalCode,
          },
          {
            label: 'تاریخ تولد',
            value: identityInfo.birthDate,
          },
          {
            label: 'نام پدر',
            value: identityInfo.fatherName,
          },
        ];
      }
    });
  }

  proceed(): void {
    if (this.form.invalid || this.sendingData) {
      return;
    }
    const val = this.form.value;
    this.sendingData = true;
    this.registrationService.setUserBasicInfo({
      postalCode: val.postalCode,
      birthLocation: val.city,
      englishFirstName: val.enName,
      englishLastName: val.enSurname,
      nationalCardSerialNo: val.idCardSerialNo ? val.idCardSerialNo : val.nationalCardTrackingCode
    }).subscribe({
      next: res => {
        this.nextStep.emit();
        this.sendingData = false;
      },
      error: err => {
        if (err.error.result.status === 1139) {
          this.isError = true;
          this.noServiceErrorData = {
            title: 'متاسفانه، امکان نمایش اطلاعات پستی شما را نداریم',
            message: 'لطفاً برای ادامه فرآیند دقایقی دیگر دوباره تلاش کنید.',
            primaryBtn: 'بستن',
            secondaryBtn: 'تلاش مجدد',
            staticImage: 'img-no-service'
          };
        } else {
          this.messageService.showErrorIfExists(err);
        }
        this.sendingData = false;
      }
    });
  }

  onRetry() {
    this.isError = false;
  }

  onExit() {
    this.registrationService.goToOverviewPage();
  }

  onBasicInfoClick(event: any) {
    this.selectedId = event.id;
    this.form?.controls['nationalCardTrackingCode']?.setValue('');
    this.form?.controls['idCardSerialNo']?.setValue('');
  }

  requiredIfSelectedIdIs(id: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.selectedId === id) {
        return control.value ? null : {required: true};
      }
      return null;
    };
  }

  checkForbiddenChar = (input: string) => {
    const regex = /[0-9a-zA-Z\s]{1}/g;
    return regex.test(input);
  };
  checkForbiddenCharForTrackingCode = (input: string): any => {
    if (input === 'Backspace' || input === 'Delete' || input === 'ArrowRight' || input === 'ArrowLeft') {
      const regex = /[0-9a-zA-Z\s]{1}/g;
      return regex.test(input);
    } else {
      const regex = /[0-9\s]{1}/g;
      return regex.test(input);
    }
  };

}

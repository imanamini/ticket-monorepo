import { Component, inject, input, model, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldOption } from '@digipay/ui-form-field-builder/lib/models/form-field-option.interface';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { DeviceDetector } from '@digipay/layout';
import { BaseComponent } from '../../../../../../components/base/base.component';
import { StoreService } from '../../data-access/services/store.service';
import { ExtraInsurerForm } from '../../../../data-access/enums/extra-insurance-company-items.enum';
import moment from 'jalali-moment';
import { ConstantAllService } from '../../../../data-access/services/shared/constant-all.service';
import { CalendarPickTypeEnum, NgxDatePickerComponent } from '@digipay/ngx-date-picker';
import { DateRangeModel } from '@digipay/ngx-date-picker/lib/data-access/models/date-range.model';

@Component({
  selector: 'ex-insurer-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    NgxDatePickerComponent,
  ],
  templateUrl: './ex-insurer-form.component.html',
  styleUrl: './ex-insurer-form.component.scss'
})
export class ExInsurerFormComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  protected readonly CalendarPickTypeEnum = CalendarPickTypeEnum;

  private constantAllService = inject(ConstantAllService);
  private dDetector = inject(DeviceDetector);
  private storeService = inject(StoreService);

  exInsurerForm = input.required<FormGroup>();
  showError = model<boolean>(false);

  dataRange: DateRangeModel;

  insurers: FormFieldOption[] = [];
  protected readonly extraInsurerForm = ExtraInsurerForm;
  protected readonly Date = Date;

  errorMapper: { [key: string]: string } = {
    required: ''
  };

  showRadioButton = false;

  ngOnInit(): void {
    this.createDateRange();
    this.setFormControls();
    this.getInsurers();
    this.getNameFromStore();
    this.showRadioButton = !this.dDetector.isDesktop;
  }

  createDateRange(): void {
    const endDate = moment().locale('fa');
    this.dataRange = {
      start: {
        year: 1360,
        month: 1,
        day: 1
      },
      end: {
        year: endDate.year(),
        month: endDate.month() + 1,
        day: endDate.date()
      },
    };
  }

  getInsurers(): void {
    super.addSubscription(this.constantAllService.getInsuranceCompanies().subscribe({
      next: res => {
        this.insurers = [
          ...[
            {value: ExtraInsurerForm.NoInsurance, title: 'فاقد بیمه‌نامه'},
            {value: ExtraInsurerForm.NewCar, title: 'صفر کیلومتر'}],
          ...res.map(i => ({value: i.id, title: i.name}))];
      }
    }));
  }

  getNameFromStore(): void {
    super.addSubscription(this.storeService.getStoreDataAsObservable().subscribe({
      next: value => {
        this.exInsurerForm()?.controls.name.setValue(value?.previousInsurance?.company?.id ?? null);
        if (value?.vehicleInfo.releaseDate) {
          this.exInsurerForm()?.controls.releaseDate
            .setValue(moment(value?.vehicleInfo?.releaseDate, 'YYYY/MM/DD').locale('fa').format('jYYYY/jMM/jDD'));
        }
      }
    }));
  }

  setFormControls(): void {
    this.exInsurerForm()?.setControl('name', new FormControl(null));
    this.exInsurerForm()?.setControl('releaseDate', new FormControl(null));

    super.addSubscription(this.exInsurerForm()?.controls.name.valueChanges.subscribe({
      next: value => {
        if (value === ExtraInsurerForm.NoInsurance || value === ExtraInsurerForm.NewCar) {
          this.exInsurerForm()?.controls.name.clearValidators();
          if (value === ExtraInsurerForm.NewCar) {
            this.exInsurerForm()?.controls.releaseDate.addValidators([Validators.required]);
          } else {
            this.exInsurerForm()?.controls.releaseDate.setValue(null);
            this.exInsurerForm()?.controls.releaseDate.clearValidators();
          }
        } else {
          this.exInsurerForm()?.controls.releaseDate.setValue(null);
          this.exInsurerForm()?.controls.releaseDate.clearValidators();
          this.exInsurerForm()?.controls.name.setValidators([Validators.required]);
        }
        this.exInsurerForm()?.controls.releaseDate.updateValueAndValidity();
      }
    }));
  }

}

import { Component, inject, input, model, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import moment, { Moment } from 'jalali-moment';
import { BaseComponent } from '../../../../../../components/base/base.component';
import { FormControlItemModel } from '../../../../data-access/models/form-control-item.model';
import { StoreService } from '../../data-access/services/store.service';
import { CalendarPickTypeEnum, NgxDatePickerComponent } from '@digipay/ngx-date-picker';
import { DateRangeModel } from '@digipay/ngx-date-picker/lib/data-access/models/date-range.model';

@Component({
  selector: 'ex-insurer-date-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgxDatePickerComponent
  ],
  templateUrl: './ex-insurer-date-form.component.html',
  styleUrl: './ex-insurer-date-form.component.scss',
})
export class ExInsurerDateFormComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  private storeService = inject(StoreService);

  exInsurerDateForm = input.required<FormGroup>();
  showError = model<boolean>(false);

  protected readonly CalendarPickTypeEnum = CalendarPickTypeEnum;

  errorMapper: { [key: string]: string } = {
    required: '',
  };

  formControls: FormControlItemModel[] = [
    {
      name: 'start',
      disabled: false,
      validators: []
    },
    {
      name: 'end',
      disabled: true,
      validators: []
    },
  ];

  endDateRange: DateRangeModel;
  startDateRange: DateRangeModel;

  ngOnInit(): void {
    this.createStartDateRange();
    this.setFormControls();
    this.getDateFromURL();
    this.subscribeOnDateChange();
  }

  setFormControls(): void {
    this.formControls.forEach(item => {
      this.exInsurerDateForm()?.setControl(item.name, new FormControl({
        value: null,
        disabled: item.disabled
      }, [Validators.required, ...item.validators]));
    });
  }

  createStartDateRange(): void {
    const endDate = moment().locale('fa');
    this.startDateRange = {
      start: {
        year: 1360,
        month: 1,
        day: 1
      },
      end: {
        year: endDate.year(),
        month: endDate.month(),
        day: endDate.date()
      },
    };
  }

  setEndDateRange(value: string): void {
    const startDate = moment(value, 'jYYYY/jMM/jDD').locale('fa').add(1, 'jMonth');
    const endDate = this.getNextYear(startDate.valueOf());
    this.endDateRange = {
      start: {
        year: startDate.year(),
        month: startDate.month(),
        day: startDate.date()
      },
      end: {
        year: endDate.year(),
        month: endDate.month(),
        day: endDate.date()
      }
    };
  }

  getNextYear(value: number): Moment {
    return moment(value).locale('fa').add(1, 'jYear');
  }

  subscribeOnDateChange(): void {
    this.exInsurerDateForm()?.controls.start?.valueChanges.subscribe({
      next: value => {
        this.setEndDateRange(value);
        this.exInsurerDateForm()?.controls.end.enable({onlySelf: true});
        this.exInsurerDateForm()?.controls.end.setValue(value ? moment(value, 'jYYYY/jMM/jDD').add(1, 'jYear').locale('fa').format('jYYYY/jMM/jDD') : null);
      }
    });
  }

  getDateFromURL(): void {
    super.addSubscription(this.storeService.getStoreDataAsObservable().subscribe({
      next: value => {
        if (value?.previousInsurance?.startsAt) {
          this.exInsurerDateForm()?.controls.start.setValue(moment(value?.previousInsurance?.startsAt).locale('fa').format('jYYYY/jMM/jDD'));
          this.setEndDateRange(moment(value?.previousInsurance?.startsAt).locale('fa').format('jYYYY/jMM/jDD'));
        }
        if (value?.previousInsurance?.endsAt) {
          this.exInsurerDateForm()?.controls.end.enable({onlySelf: true});
          this.exInsurerDateForm()?.controls.end.setValue(moment(value?.previousInsurance?.endsAt).locale('fa').format('jYYYY/jMM/jDD'));
        }
      }
    }));
  }

}

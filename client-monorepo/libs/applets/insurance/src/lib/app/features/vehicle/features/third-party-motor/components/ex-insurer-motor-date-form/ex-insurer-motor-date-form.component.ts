import { ChangeDetectorRef, Component, inject, input, model, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import moment from 'jalali-moment';
import { ThirdPartyMotorDirective } from '../../directives/third-party-motor.directive';

interface FormControlItemModel {
  name: string;
  disabled: boolean;
  validators: ValidatorFn[];
}

@Component({
  selector: 'ex-insurer-motor-date-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule
  ],
  templateUrl: './ex-insurer-motor-date-form.component.html',
  styleUrl: './ex-insurer-motor-date-form.component.scss',
})
export class ExInsurerMotorDateFormComponent extends ThirdPartyMotorDirective implements OnInit {
  exInsurerMotorDateForm = input.required<FormGroup>();
  showError = model<boolean>(false);

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

  endDateRange: [number, number] | undefined;
  startDateRange: [number, number] | undefined;
  private changeDetectionRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
    super.ngOnInit();
    this.setFormControls();
    this.getDateFromStore();
    this.subscribeOnDateChange();
    this.setStartDateRange();
  }

  setFormControls(): void {
    this.formControls.forEach(item => {
      this.exInsurerMotorDateForm()?.setControl(item.name, new FormControl({
        value: null,
        disabled: item.disabled
      }, [Validators.required, ...item.validators]));
    });
  }

  setEndDateRange(value: number | null): void {
    this.endDateRange = value ? [value, this.getNextYear(value)] : undefined;
  }

  getNextYear(value: number): number {
    return moment(value).add(1, 'year').utc().valueOf();
  }

  subscribeOnDateChange(): void {
    super.addSubscription(this.exInsurerMotorDateForm()?.controls.start?.valueChanges.subscribe({
      next: value => {
        this.setEndDateRange(value);
        this.exInsurerMotorDateForm()?.controls.end.enable({onlySelf: true});
        this.exInsurerMotorDateForm()?.controls.end.setValue(value ? this.getNextYear(value) : null);
        queueMicrotask(() => this.changeDetectionRef.detectChanges());
      }
    }));
  }

  getDateFromStore(): void {
    super.addSubscription(this.storeService.getStoreDataAsObservable().subscribe({
      next: value => {
        if (value?.previousInsuranceDetail?.startsAt) {
          this.exInsurerMotorDateForm().controls.start.patchValue(value.previousInsuranceDetail.startsAt, {emitEvent: true});
          this.setEndDateRange(value.previousInsuranceDetail.startsAt);
        }
        if (value?.previousInsuranceDetail?.endsAt) {
          this.exInsurerMotorDateForm().controls.end.enable({onlySelf: true, emitEvent: true});
          this.exInsurerMotorDateForm().controls.end.setValue(value.previousInsuranceDetail.endsAt, {emitEvent: true});
        }
        this.changeDetectionRef.markForCheck();
      }
    }));
  }

  setStartDateRange(): void {
    this.startDateRange = [69923937000, moment().add(12, 'month').utc().valueOf()];
  }

  protected onNext(route: string): void {
  }

  protected override onClose(): void {
  }
}

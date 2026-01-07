import { Component, computed, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormStepService } from '../../services/form-step.service';
import { Subject, takeUntil } from 'rxjs';
import { AvailableReturnInperson, DeliveryProviderAddress } from '../../models/available-return-inperson.model';
import moment from 'jalali-moment';
import { ReturnApiService } from '../../services/return-api.service';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { CommonModule, NgIf } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-delivery-in-person',
  templateUrl: './delivery-in-person.component.html',
  styleUrl: './delivery-in-person.component.scss',
  standalone: true,
  imports: [UiFormFieldBuilderModule, NgIf, ReactiveFormsModule, NgxButtonComponent, CommonModule],
})
export class DeliveryInPersonComponent implements OnInit, OnDestroy {
  cityId = input.required<number>();
  deliveryInPersonForm: FormGroup;
  onFormSubmit = output();
  branches: AvailableReturnInperson[];
  branchesOption = [];
  selectedProviderAddress: DeliveryProviderAddress;
  reserveDatesOption = [];
  timeSlotsOption = [];
  deliveryDetailsSubmitted = false;
  unsubscribe$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private formStepService = inject(FormStepService);
  currentStep = computed(() => this.formStepService.currentStep());
  private api = inject(ReturnApiService);

  get deliveryDetails() {
    return this.deliveryInPersonForm.controls.deliveryDetails as FormGroup;
  }

  ngOnInit(): void {
    this.createForm();
    this.getAvailableReturnInperson();
    this.subscribeOnDeliveryProviderValueChanges();
    this.subscribeOnReserveDateValueChanges();
  }

  goToDeliveryDetailsStep() {
    const deliveryProviderFormControl = this.deliveryInPersonForm.get('deliveryProvider');
    deliveryProviderFormControl.markAllAsTouched();

    if (deliveryProviderFormControl.invalid) {
      throw new Error('form is invalid');
    }

    this.formStepService.nextStep();
  }

  onSubmit() {
    this.deliveryDetailsSubmitted = true;
    if (this.deliveryInPersonForm.invalid) {
      throw new Error('form is invalid');
    }

    this.onFormSubmit.emit({
      deliveryProvider: this.deliveryInPersonForm.controls.deliveryProvider.getRawValue(),
      ...this.deliveryDetails.getRawValue(),
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.unsubscribe$ = undefined;
  }

  private subscribeOnReserveDateValueChanges() {
    this.deliveryDetails.controls.reserveDate.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((dateTime) => {
      const deliveryProviderId = this.deliveryInPersonForm.controls.deliveryProvider.value.deliveryProviderId;
      const branch = this.branches.find((f) => f.deliveryProviderId === deliveryProviderId);
      this.timeSlotsOption = branch.dates
        .find((f) => f.date === dateTime)
        .timeSlots.map((d) => ({
          title: d.title,
          value: d,
          caption: `(${d.toTime.slice(0, 2)} - ${d.fromTime.slice(0, 2)})`,
        }));
      this.deliveryDetails.patchValue({
        timeSlot: null,
      });
    });
  }

  private subscribeOnDeliveryProviderValueChanges() {
    this.deliveryInPersonForm.controls.deliveryProvider.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
      const branch = this.branches.find((f) => f.deliveryProviderId === value.deliveryProviderId);
      this.selectedProviderAddress = branch.deliveryProviderAddress;
      this.reserveDatesOption = branch.dates.map((m) => ({
        title: moment(m.date).format('jYYYY/jMM/jDD'),
        value: m.date,
      }));
      this.timeSlotsOption = [];
      this.deliveryInPersonForm.patchValue({
        timeSlot: null,
        reserveDate: null,
      });
    });
  }

  private getAvailableReturnInperson() {
    this.api.getAvailableReturnInperson(this.cityId()).subscribe({
      next: (res) => {
        this.branches = res.items;
        this.branchesOption = res.items.map((m) => ({
          title: m.deliveryProviderName,
          value: {
            deliveryProviderId: m.deliveryProviderId,
            deliveryProviderName: m.deliveryProviderName,
            deliveryProviderAddress: m.deliveryProviderAddress,
          },
        }));
      },
    });
  }

  private createForm() {
    this.deliveryInPersonForm = this.fb.group({
      deliveryProvider: ['', Validators.required],
      deliveryDetails: this.fb.group({
        reserveDate: ['', Validators.required],
        timeSlot: ['', Validators.required],
      }),
    });
  }
}

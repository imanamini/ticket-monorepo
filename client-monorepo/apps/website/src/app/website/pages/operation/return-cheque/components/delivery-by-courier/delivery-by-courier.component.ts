import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormStepService } from '../../services/form-step.service';
import { AvailableReturnCourier } from '../../models/available-return-courier.model';
import moment from 'jalali-moment';
import { ReturnApiService } from '../../services/return-api.service';
import { CommonModule } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-delivery-by-courier',
  templateUrl: './delivery-by-courier.component.html',
  styleUrl: './delivery-by-courier.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, UiFormFieldBuilderModule, NgxButtonComponent]
})
export class DeliveryByCourierComponent implements OnInit {
  deliveryByCourierForm: FormGroup;
  cityId = input.required<number>();
  deliveryDates: AvailableReturnCourier[];
  deliveryDatesOption = [];
  timeSlotsOption = [];
  onFormSubmit = output();
  addressFormSubmitted = false;
  deliveryFormSubmitted = false;
  private fb = inject(FormBuilder);
  private formStepService = inject(FormStepService);
  currentStep = computed(() => this.formStepService.currentStep());
  private api = inject(ReturnApiService);

  get addressDetails() {
    return this.deliveryByCourierForm.controls.addressDetails as FormGroup;
  }

  get deliveryDetails() {
    return this.deliveryByCourierForm.controls.deliveryDetails as FormGroup;
  }

  ngOnInit(): void {
    this.createForm();
    this.getAvailableReturnCourier();
    this.subscribeOnDeliveryDateValueChanges();
  }

  goToDeliveryStep() {
    this.addressFormSubmitted = true;

    if (this.addressDetails.invalid) {
      throw new Error('form is invalid');
    }

    this.formStepService.nextStep();
  }

  onSubmit() {
    this.deliveryFormSubmitted = true;
    if (this.deliveryByCourierForm.valid) {
      this.onFormSubmit.emit({
        ...this.addressDetails.getRawValue(),
        ...this.deliveryDetails.getRawValue()
      });
    }
  }

  clearForm() {
    this.addressDetails.reset();
  }

  private subscribeOnDeliveryDateValueChanges() {
    this.deliveryDetails.controls.deliveryDate.valueChanges.subscribe((dateTime) => {
      this.timeSlotsOption = this.deliveryDates
        .find((f) => f.dateTime === dateTime)
        .timeSlots.map((d) => ({
          title: d.title,
          caption: `(${d.toTime.slice(0, 2)} - ${d.fromTime.slice(0, 2)})`,
          value: d
        }));

      this.deliveryDetails.patchValue({
        timeSlot: ''
      });
    });
  }

  private getAvailableReturnCourier() {
    this.api.getAvailableReturnCourier(this.cityId()).subscribe({
      next: (res) => {
        this.deliveryDates = res.items;
        this.deliveryDatesOption = res.items.map((c) => ({
          title: moment(c.dateTime).format('jYYYY/jMM/jDD'),
          value: c.dateTime
        }));
      }
    });
  }

  private createForm() {
    this.deliveryByCourierForm = this.fb.group({
      addressDetails: this.fb.group({
        no: ['', Validators.required],
        unit: ['', Validators.required],
        postalCode: ['', Validators.required],
        address: ['', Validators.required]
      }),
      deliveryDetails: this.fb.group({
        deliveryDate: ['', Validators.required],
        timeSlot: ['', Validators.required]
      })
    });
  }
}

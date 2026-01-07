import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { Observable } from 'rxjs';
import { AvailableReturnCourier } from '../../models/available-return-courier.model';
import { ReturnApiService } from '../../services/return-api.service';
import { FormStepService } from '../../services/form-step.service';
import moment from 'jalali-moment';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-delivery-by-post',
  standalone: true,
  imports: [
    NgxButtonComponent,
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './delivery-by-post.component.html',
  styleUrl: './delivery-by-post.component.scss'
})
export class DeliveryByPostComponent implements OnInit{
  deliveryByPostForm: FormGroup;
  cityId = input.required<number>();
  deliveryDates: AvailableReturnCourier[];
  deliveryDatesOption = [];
  timeSlotsOption = [];
  onFormSubmit = output();

  formSubmitted = false;
  private fb = inject(FormBuilder);
  private formStepService = inject(FormStepService);
  currentStep = computed(() => this.formStepService.currentStep());
  private api = inject(ReturnApiService);

  ngOnInit(): void {
    this.createForm();
  }

  onSubmit() {
    if (this.deliveryByPostForm.invalid) {
      throw new Error('form is invalid');
    }
    this.onFormSubmit.emit(this.deliveryByPostForm.getRawValue());
  }

  clearForm() {
    this.deliveryByPostForm.reset();
  }

  private createForm() {
    this.deliveryByPostForm = this.fb.group({
      no: ['', Validators.required],
      unit: ['', Validators.required],
      postalCode: ['', Validators.required],
      address: ['', Validators.required]
    });
  }
}

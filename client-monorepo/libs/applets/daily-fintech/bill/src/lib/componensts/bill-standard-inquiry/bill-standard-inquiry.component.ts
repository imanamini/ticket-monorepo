import { AfterViewChecked, ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { BILL_NUMERIC_PAY_TYPES } from '../../data-access/models/bill-pay-types.enum';
import { BillValidationService } from '../../data-access/services/bill-validation.service';
import { ActivatedRoute } from '@angular/router';
import { BillTypeModel } from '../../data-access/models/bill-type.model';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'bill-applet-standard-inquiry',
  standalone: true,
  imports: [CommonModule, FormsModule, UiFormFieldBuilderModule, ReactiveFormsModule, NgxButtonComponent],
  templateUrl: './bill-standard-inquiry.component.html',
  styleUrl: './bill-standard-inquiry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillStandardInquiryComponent implements AfterViewChecked {
  private route = inject(ActivatedRoute);
  private fb = inject(UntypedFormBuilder);
  private billValidationService = inject(BillValidationService);

  isSubmitting = signal(false);
  initialSubmit = signal(false);

  billTypeModel = computed<BillTypeModel | null>(() => this.billValidationService.billTypeModelState());
  billType = computed<string>(() => this.billValidationService.billTypeName());

  billInquiryForm!: UntypedFormGroup;

  constructor() {
    const params = this.route.snapshot.queryParams;
    this.billInquiryForm = this.fb.group({
      billId: [params['billId'], [Validators.required, Validators.minLength(6)]],
      payId: [params['payId'], [Validators.required, Validators.minLength(6)]],
    });
  }

  ngAfterViewChecked() {
    if (
      this.route.snapshot.queryParams['billId'] &&
      this.route.snapshot.queryParams['payId'] &&
      !this.initialSubmit() &&
      this.billInquiryForm.controls['billId'].value &&
      this.billInquiryForm.controls['payId'].value
    ) {
      this.initialSubmit.set(true);
      this.confirmNavigation(true);
    }
  }

  confirmNavigation(isAuto = false): void {
    this.isSubmitting.set(true);
    this.billValidationService
      .billValidationApiNavigateToConfirm(
        this.billInquiryForm.controls['billId'].value,
        BILL_NUMERIC_PAY_TYPES.STANDARD,
        this.billInquiryForm.controls['payId'].value,
        isAuto,
      )
      .then(() => {
        this.isSubmitting.set(false);
      })
      .catch(() => {
        this.isSubmitting.set(false);
      });
  }
}

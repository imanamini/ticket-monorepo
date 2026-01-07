import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { noop } from 'rxjs';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { UiButtonComponent } from '../../../../../../../../components/ui-button/ui-button/ui-button.component';

@Component({
  selector: 'used-custom-brand-model',
  templateUrl: './used-custom-brand-model.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    UiButtonComponent
  ],
  styleUrls: ['./used-custom-brand-model.component.scss']
})
export class UsedCustomBrandModelComponent implements OnInit {

  constructor(private sheetRef: MatBottomSheetRef<UsedCustomBrandModelComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public sheetData: { brand: string, model: string },
              private fb: UntypedFormBuilder) {
  }

  form: UntypedFormGroup = this.fb.group({
    model: ['', [
      Validators.required,
      Validators.minLength(2)
    ]],
    brand: ['', [
      Validators.required,
      Validators.minLength(2)
    ]]
  });

  ngOnInit(): void {
    this.fillForm();
  }

  fillForm(): void {
    const controls = this.form.controls;
    this.sheetData.model ? controls.model.patchValue(this.sheetData.model) : noop();
    this.sheetData.brand ? controls.brand.patchValue(this.sheetData.brand) : noop();
  }

  closeDialog(): void {
    const brandModel = {
      brand: this.form.get('brand').value,
      model: this.form.get('model').value
    };
    return this.sheetRef.dismiss(brandModel);
  }
}

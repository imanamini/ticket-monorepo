import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import {
  UiSpecialDialogComponent
} from '../../../../../../../../components/ui-special-dialog/ui-special-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { StepperService } from '../../../../../../../../util/stepper.service';

@Component({
  selector: 'app-get-new-insurer-info',
  templateUrl: './get-new-insurer-info.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    UiSpecialDialogComponent
  ],
  styleUrls: ['./get-new-insurer-info.component.scss']
})
export class GetNewInsurerInfoComponent implements OnInit {

  @Output()
  setNewInsurerInfo = new EventEmitter<any>();

  form: UntypedFormGroup = new UntypedFormGroup({
    transferMobileNo: new UntypedFormControl(null, [Validators.required])
  });

  constructor(private dialogRef: MatDialogRef<GetNewInsurerInfoComponent>,
              private stepperService: StepperService
  ) {
  }

  ngOnInit(): void {
  }

  submitPhoneNumber(): void {
    this.setNewInsurerInfo.emit(this.form.value);
    this.stepperService.nextStep();

  }

}

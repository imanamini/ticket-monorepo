import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EEIRegisterModel } from '../../api/models/EEI-register.model';
import { OnlyEnFaArNumbersPattern } from '../../../../util/patterns';
import { UiButtonComponent } from '../../../../components/ui-button/ui-button/ui-button.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import {
  NoticeDialogComponent
} from '../../../vehicle/features/third-party/components/notice-dialog/notice-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  NoticeDialogDataModel
} from '../../../vehicle/features/third-party/components/notice-dialog/models/notice-dialog-data.model';
import {
  NoticeDialogOutputModel
} from '../../../vehicle/features/third-party/components/notice-dialog/models/notice-dialog-output.model';

@Component({
  selector: 'electronic-equipment-register',
  templateUrl: './electronic-equipment-register.component.html',
  styleUrls: ['./electronic-equipment-register.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, UiFormFieldBuilderModule, UiButtonComponent]
})
export class ElectronicEquipmentRegisterComponent implements OnInit {
  buttonText = 'تایید اطلاعات و ادامه';

  @Output() submitted: EventEmitter<EEIRegisterModel> = new EventEmitter<EEIRegisterModel>();

  form: UntypedFormGroup = new UntypedFormGroup({
    firstName: new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[\u0600-\u06FF\u0698\u067E\u0686\u06AF\s]+$/)]),
    lastName: new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[\u0600-\u06FF\u0698\u067E\u0686\u06AF\s]+$/)]),
    postalCode: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]/)]
    ),
    nationalCode: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern(OnlyEnFaArNumbersPattern),
      Validators.maxLength(10),
      Validators.minLength(10)
    ]),
    mobile: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{11}$/),
    ]),
    address: new UntypedFormControl('', Validators.required),
  });

  constructor(private matDialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  submitClick(): void {
    const noticeData: NoticeDialogDataModel = {
      id: '1',
      title: 'انتقال بیمه نامه',
      text: ' پس از تایید، اطلاعات وارد شده قابل ویرایش نمی باشد ،آیا از صحت اطلاعات وارد شده اطمینان دارید؟',
      actionBtnText: 'تایید',
      dismissBtnText: 'بازگشت'
    };
    this.matDialog.open(NoticeDialogComponent, {
      width: '90%',
      panelClass: 'notice-container',
      data: noticeData
    })
      .afterClosed()
      .subscribe({
        next: (data: NoticeDialogOutputModel) => {
          if (data?.isAccepted) {
            this.submitted.emit(this.form.value);
          }
        }
      });
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { EditProfileDialogData } from './models/EditProfileDialogData';
import { UserService } from '../../../../core/services/user.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { DialogBottomSheetService } from '../../../../core/services/dialog-bottom-sheet.service';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgIf } from '@angular/common';
import { UiIconDirective } from '../../../ui-directive/ui-icon.directive';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';

@Component({
  selector: 'app-ui-dialog-edit-profile',
  templateUrl: './ui-dialog-edit-profile.component.html',
  styleUrls: ['./ui-dialog-edit-profile.component.scss'],
  standalone: true,
  imports: [NgIf, UiIconDirective, ReactiveFormsModule, UiFormFieldBuilderModule, UiButtonComponent, NgxSpinnerModule],
})
export class UiDialogEditProfileComponent implements OnInit {
  profileDialogData: EditProfileDialogData;

  form: UntypedFormGroup;

  updatingProfileRequest = false;

  PLACEHOLDERS = {
    phoneNumber: '02112312312',
    email: 'somebody@somewhere.com',
    nationalCode: '2821231231',
    name: 'نام',
    surname: 'نام خانوادگی',
  };

  focusState = {};

  parentErrors: {
    name?: string;
    surname?: string;
  } = {};

  constructor(
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public bottomSheetDialogData: {
      data: EditProfileDialogData;
    },
    @Inject(MAT_DIALOG_DATA)
    public matDialogData: {
      data: EditProfileDialogData;
    },
    private user: UserService,
    private messageService: MessageService,
    private dialog: DialogBottomSheetService,
  ) {
    this.profileDialogData = matDialogData && matDialogData.data ? matDialogData.data : bottomSheetDialogData.data;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [this.profileDialogData.userData.name || '', [this.parentErrorValidator('name').bind(this)]],
      surname: [this.profileDialogData.userData.surname || '', [this.parentErrorValidator('surname').bind(this)]],
    });

    for (const i in this.form.controls) {
      if (this.form.controls.hasOwnProperty(i)) {
        this.form.controls[i].valueChanges.subscribe((res) => {
          if (this.parentErrors[i]) {
            delete this.parentErrors[i];
          }
        });
      }
    }
  }

  getPlaceHolder(fieldName: string) {
    if (this.focusState.hasOwnProperty(fieldName) && this.focusState[fieldName] && this.PLACEHOLDERS.hasOwnProperty(fieldName)) {
      return this.PLACEHOLDERS[fieldName];
    }
    return 'وارد کنید';
  }

  save() {
    if (this.updatingProfileRequest) {
      return;
    }
    const params = {};
    Object.keys(this.form.value).forEach((key) => {
      if (this.form.value[key]) {
        params[key] = this.form.value[key];
      }
    });

    this.updatingProfileRequest = true;
    this.user.updateUserProfile(params).subscribe(
      (response) => {
        this.messageService.showErrorMessage(response.result.message);
        this.profileDialogData.userData = response.userDetail;
        this.user.emitUserProfile(this.profileDialogData.userData);
        this.updatingProfileRequest = false;
        this.closeDialog();
      },
      (e) => {
        if (e.errorMessages && e.errorMessages.length > 0) {
          this.updatingProfileRequest = false;
        }
      },
    );
  }

  parentErrorValidator(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      if (this.parentErrors && this.parentErrors[formControlName]) {
        return { parentError: true };
      }
      return null;
    };
  }

  closeDialog() {
    this.dialog.close();
  }
}

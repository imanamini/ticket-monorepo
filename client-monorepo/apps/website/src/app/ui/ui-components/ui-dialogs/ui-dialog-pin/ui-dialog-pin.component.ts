import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PinDialogData } from './models/pin-dialog-data';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserApiService } from '../../../../api/digipay/user-api.service';
import { LoginWithPasswordRequest } from '../../../../api/digipay/models/user/login-with-password.request';
import { PinDialogResult } from './models/pin-dialog-result';
import { MessageService } from '@client-monorepo/common/utilities';
import { HttpErrorResponse } from '@angular/common/http';
import { UiSpinnerComponent } from '../../ui-loading/ui-spinner/ui-spinner.component';
import { UiButtonComponent } from '../../ui-button/ui-button/ui-button.component';
import { UiFormHintComponent } from '../../ui-hint-text/ui-form-hint/ui-form-hint.component';
import { NgIf } from '@angular/common';
import { UiPinInputComponent } from '../../ui-pin-input/pin-input/ui-pin-input.component';
import { UiDialogBaseComponent } from '../ui-dialog-base/ui-dialog-base.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-ui-dialog-pin',
  templateUrl: './ui-dialog-pin.component.html',
  styleUrls: ['./ui-dialog-pin.component.scss'],
  standalone: true,
  imports: [UiDialogBaseComponent, UiPinInputComponent, NgIf, UiFormHintComponent, UiButtonComponent, UiSpinnerComponent],
})
export class UiDialogPinComponent implements OnInit {
  form: UntypedFormGroup;

  verifying = false;

  errorMessage: string = null;

  pinError = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PinDialogData,
    private formBuilder: UntypedFormBuilder,
    private userApiService: UserApiService,
    private matRef: MatDialogRef<UiDialogPinComponent>,
    private messageService: MessageService,
  ) {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  ngOnInit(): void {
    this.form.controls.password.valueChanges.subscribe((val) => {
      if (val && val.length === 4) {
        // as there is small delay in form update
        // send the latest value of the password
        // field to the pay method
        this.onPay(val);
      }
    });
  }

  onPay(password: string = null): void {
    if (this.verifying) {
      return;
    }
    this.errorMessage = null;
    this.verifying = true;
    this.pinError = false;

    const request = {
      username: this.data.userId,
      password: password ? password : this.form.value.password,
      features: this.data.features,
    } as LoginWithPasswordRequest;

    this.userApiService.loginUsingIdAndPasswordWithTicket(request, this.data.ticket).subscribe(
      (response) => {
        this.matRef.close({
          verified: true,
        } as PinDialogResult);
      },
      (e: HttpErrorResponse) => {
        this.verifying = false;
        if (e.status === 401) {
          this.pinError = true;
          of('')
            .pipe(delay(1500))
            .subscribe({
              next: () => {
                this.pinError = false;
              },
            });
        }
        this.errorMessage = this.messageService.getMessageIfHasAny(e);
      },
    );
  }

  onDialogClose(): void {
    this.matRef.close({
      verified: false,
    } as PinDialogResult);
  }

  onPinChange($event): void {
    this.form.setValue({
      password: $event,
    });
  }
}

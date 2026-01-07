import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Subscription } from 'rxjs';
import { CustomFormComponent } from '../../custom-form/custom-form.component';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-nobitex-stepper-dialog',
  templateUrl: './nobitex-stepper-dialog.component.html',
  styleUrls: ['./nobitex-stepper-dialog.component.scss'],
  standalone: true,
  imports: [CustomFormComponent, NgxIcon],
})
export class NobitexStepperDialogComponent {
  subscription: Subscription;

  image;
  contactForm;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetData: any,
    private dialogService: MatDialog,
  ) {
    this.contactForm = this.dialogData.contactForm;
    this.image = this.dialogData.image;
  }

  closeDialog(): void {
    this.dialogService.closeAll();
  }
}

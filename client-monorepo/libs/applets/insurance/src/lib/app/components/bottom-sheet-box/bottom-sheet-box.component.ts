import { Component, inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NavigationStart, Router } from '@angular/router';
import { NgComponentOutlet } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';

import { FullscreenBottomSheetModel } from '../../features/vehicle/data-access/models/fullscreen-bottom-sheet.model';
import { BaseComponent } from '../base/base.component';
import { IconEnum } from '../../data-access/enums/icon.enum';

@Component({
  standalone: true,
  imports: [
    NgxIcon,
    NgComponentOutlet
  ],
  templateUrl: './bottom-sheet-box.component.html',
  styleUrl: './bottom-sheet-box.component.scss'
})

export class BottomSheetBoxComponent extends BaseComponent implements OnInit {

  public bottomSheetData = inject<FullscreenBottomSheetModel>(MAT_BOTTOM_SHEET_DATA);
  public dialogData = inject<FullscreenBottomSheetModel>(MAT_DIALOG_DATA);
  private bottomSheetRef = inject(MatBottomSheetRef<BottomSheetBoxComponent>);
  private dialogRef = inject(MatDialogRef<BottomSheetBoxComponent>);
  private router = inject(Router);

  constructor() {
    super();
  }

  protected readonly IconEnum = IconEnum;

  ngOnInit(): void {
    super.addSubscription(this.router.events.subscribe({
      next: e => {
        if (e instanceof NavigationStart) {
          this.handleCloseClicked();
        }
      }
    }));
  }

  handleCloseClicked(): void {
    if (this.bottomSheetRef instanceof MatBottomSheetRef) {
      this.bottomSheetRef?.dismiss();
    }

    if (this.dialogRef instanceof MatDialogRef) {
      this.dialogRef?.close();
    }
  }
}

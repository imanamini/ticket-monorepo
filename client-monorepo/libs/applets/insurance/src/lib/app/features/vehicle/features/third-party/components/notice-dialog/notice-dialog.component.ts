import { Component, Inject, OnInit, signal, WritableSignal } from '@angular/core';
import { InsIconComponent } from '../../../../components/ins-icon/ins-icon.component';
import { IconEnum } from '../../../../../../data-access/enums/icon.enum';
import { InsButtonComponent } from '../../../../../../components/ins-button/ins-button.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoticeDialogOutputModel } from './models/notice-dialog-output.model';
import { NoticeDialogDataModel } from './models/notice-dialog-data.model';
import { InsButtonStyleEnum } from '../../../../../../data-access/enums/ins-button-style.enum';
import { InsButtonModeEnum } from '../../../../../../data-access/enums/ins-button-mode.enum';
import { InsButtonSizeEnum } from '../../../../../../data-access/enums/ins-button-size.enum';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'notice-dialog',
  standalone: true,
  imports: [
    InsIconComponent,
    InsButtonComponent,
    CommonModule,
    NgClass,
  ],
  templateUrl: './notice-dialog.component.html',
  styleUrl: './notice-dialog.component.scss'
})
export class NoticeDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: NoticeDialogDataModel,
              public dialogRef: MatDialogRef<NoticeDialogComponent>) {
  }

  protected readonly IconEnum = IconEnum;
  noticeData: NoticeDialogDataModel;
  output: NoticeDialogOutputModel;

  ngOnInit(): void {
    this.noticeData = this.dialogData;
    this.dialogRef.updatePosition({
      bottom: '24px'
    });
    this.dialogRef.updateSize('90%');
  }

  handleReturnClick(event: any): void {
    this.output = {
      isAccepted: false,
      event,
      id: this.noticeData.id,
    };
    this.dialogRef?.close(this.output);
  }

  handleActonClick(event: any): void {
    this.output = {
      isAccepted: true,
      event,
      id: this.noticeData.id,
    };
    this.dialogRef?.close(this.output);
  }

  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly InsButtonModeEnum = InsButtonModeEnum;
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;
}

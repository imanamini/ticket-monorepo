import { Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InsuranceNoticeModel } from './insurance-notice.model';
import { ActionButtonsComponent } from '../action-buttons/action-buttons.component';
import { NgClass } from '@angular/common';
import { InsButtonStyleEnum } from '../../data-access/enums/ins-button-style.enum';
import { InsIconFlokiEnum } from '../../features/floki/common/components/ins-icon-floki/ins-icon-floki.enum';
import { InsIconFlokiComponent } from '../../features/floki/common/components/ins-icon-floki/ins-icon-floki.component';

@Component({
  selector: 'insurance-notice',
  standalone: true,
  templateUrl: './insurance-notice.component.html',
  imports: [
    ActionButtonsComponent,
    NgClass,
    InsIconFlokiComponent
  ],
  styleUrl: './insurance-notice.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class InsuranceNoticeComponent implements OnInit {

  data = signal<Partial<InsuranceNoticeModel>>({mode: 'error'});
  public dialogData = inject<InsuranceNoticeModel>(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<InsuranceNoticeComponent>);
  protected readonly FlokiIconEnum = InsIconFlokiEnum;
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;

  ngOnInit(): void {
    this.dialogRef.updatePosition({
      bottom: '24px'
    });
    this.dialogRef.updateSize('91%');
    this.dialogRef.addPanelClass('insurance-notice');
    const dialogDataWithDefaults = {
      ...this.dialogData,
      mode: this.dialogData.mode || 'error'
    };
    this.data.set(dialogDataWithDefaults);
  }

  activeButtonClicked(): void {
    this.dialogRef?.close(true);
  }

  deActiveButtonClicked(): void {
    this.dialogRef?.close(false);
  }
}

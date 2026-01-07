import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { BadgeAlertInterface } from '../../data-access/models/badge-alert.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as Sentry from '@sentry/angular-ivy';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'payment-checkout-badge-alert',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './badge-alert.component.html',
  styleUrls: ['./badge-alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeAlertComponent implements OnInit {
  state!: BadgeAlertInterface;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogState: BadgeAlertInterface,
    private matDialogRef: MatDialogRef<BadgeAlertComponent>,
  ) {
    Sentry.setTag('module', 'UPG-Front-Module');
  }

  ngOnInit() {
    this.state = this.dialogState;
  }

  public confirm(): void {
    this.matDialogRef.close('SUBMIT');
  }

  public cancel(): void {
    this.matDialogRef.close('CANCEL');
  }
}

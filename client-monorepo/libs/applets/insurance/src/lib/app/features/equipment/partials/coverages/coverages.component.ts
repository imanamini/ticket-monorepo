import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForOf } from '@angular/common';
import { UiButtonComponent } from '../../../../components/ui-button/ui-button/ui-button.component';

@Component({
  selector: 'coverages',
  templateUrl: './coverages.component.html',
  standalone: true,
  imports: [
    NgForOf,
    UiButtonComponent
  ],
  styleUrls: ['./coverages.component.scss']
})
export class CoveragesComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CoveragesComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { coverages: string[] },
  ) {
  }

  ngOnInit(): void {
  }

  goToMoreInfo(): void {
    window.location.href = 'https://mydigipay.com/insurtech/equipment/?utm_source=InsurTechMoreInfoBut&utm_medium=DKBanner';
  }

  closeDialog(isAccepted: boolean): void {
    const result = {
      isAccepted,
    };
    this.dialogRef?.close(result);
  }

}

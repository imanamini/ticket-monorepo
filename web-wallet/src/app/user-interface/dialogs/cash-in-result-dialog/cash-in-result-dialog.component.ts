import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cash-in-result-dialog',
  templateUrl: './cash-in-result-dialog.component.html',
  styleUrls: ['./cash-in-result-dialog.component.scss']
})
export class CashInResultDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      successful: boolean,
      trackingCode: string,
      text: string,
    },
    private matDialog: MatDialogRef<CashInResultDialogComponent>,
  ) {
  }

  confirm() {
    this.matDialog.close();
  }
}

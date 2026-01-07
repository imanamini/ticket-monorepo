import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upg-action-dialog',
  templateUrl: './upg-action-dialog.component.html',
  styleUrls: ['./upg-action-dialog.component.scss']
})
export class UpgActionDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      title: string,
      description: string,
      actionTitle: string,
      rejectTitle: string,
      logoId: string
    },
    private matDialogRef: MatDialogRef<UpgActionDialogComponent>) {
  }

  ngOnInit() {
    this.dialogData.rejectTitle = this.dialogData.rejectTitle || 'انصراف';
  }

  confirm() {
    //  todo: Handle confirm action
  }

  cancel() {
    this.matDialogRef.close();
  }

}

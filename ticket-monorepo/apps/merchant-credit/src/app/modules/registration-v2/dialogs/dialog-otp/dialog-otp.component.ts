import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'dialog-otp',
  templateUrl: './dialog-otp.component.html',
  styleUrls: ['./dialog-otp.component.scss']
})
export class DialogOtpComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      cellNumber: string
    }
  ) {}

  ngOnInit(): void {
  }

}

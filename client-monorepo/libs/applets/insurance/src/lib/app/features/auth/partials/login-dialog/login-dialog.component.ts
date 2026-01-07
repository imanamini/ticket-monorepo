import { Component, OnInit } from '@angular/core';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose
  ],
  standalone: true
})
export class LoginDialogComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}

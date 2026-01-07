import { Component, OnInit } from '@angular/core';
import { SmartDialog } from '../../../../../../user-interface/services/smart-dialog';

@Component({
  selector: 'signature-confirmation',
  templateUrl: './signature-confirmation.component.html',
  styleUrls: ['./signature-confirmation.component.scss']
})
export class SignatureConfirmationComponent implements OnInit {

  constructor(
    private dialog: SmartDialog
  ) {
  }

  ngOnInit(): void {
  }

  onAgreeClick(): void {
    this.dialog.close(true);
  }

}

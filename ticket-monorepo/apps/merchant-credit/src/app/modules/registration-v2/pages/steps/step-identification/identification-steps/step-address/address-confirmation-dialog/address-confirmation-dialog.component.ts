import { Component, OnInit } from '@angular/core';
import { SmartDialog } from '../../../../../../../../user-interface/services/smart-dialog';

@Component({
  selector: 'address-confirmation-dialog',
  templateUrl: './address-confirmation-dialog.component.html',
  styleUrls: ['./address-confirmation-dialog.component.scss']
})
export class AddressConfirmationDialogComponent implements OnInit {
  address: string = '';

  constructor(private smartDialog: SmartDialog) {
    this.address = this.smartDialog.data.address;
  }

  ngOnInit(): void {
  }

  onsubmit() {
    this.smartDialog.close({confirmed: true});
  }

  onCancel() {
    this.smartDialog.close();
  }

}

import { Component, OnInit } from '@angular/core';
import { SmartDialog } from '../../../user-interface/services/smart-dialog';

@Component({
  selector: 'app-early-settlement-confirmation-fee-dialog',
  templateUrl: './early-settlement-confirmation-fee-dialog.component.html',
  styleUrls: ['./early-settlement-confirmation-fee-dialog.component.scss']
})
export class EarlySettlementConfirmationFeeDialogComponent implements OnInit {

  constructor(
    private smartDialog: SmartDialog,
  ) {

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

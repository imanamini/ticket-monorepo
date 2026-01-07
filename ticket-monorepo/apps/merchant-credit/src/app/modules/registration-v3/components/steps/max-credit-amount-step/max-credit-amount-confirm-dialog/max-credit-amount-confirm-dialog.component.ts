import { Component, OnInit } from '@angular/core';
import { SmartDialog } from '../../../../../../user-interface/services/smart-dialog';
import { numberToString } from '../../../../../../utils/number-to-string';

@Component({
  selector: 'app-max-credit-amount-confirm-dialog',
  templateUrl: './max-credit-amount-confirm-dialog.component.html',
  styleUrls: ['./max-credit-amount-confirm-dialog.component.scss']
})
export class MaxCreditAmountConfirmDialogComponent implements OnInit {
  agreed: boolean = false;
  selectedDoc: string = '';
  tacShow: boolean = false;

  constructor(private smartDialog: SmartDialog) {
  }

  ngOnInit(): void {
    this.selectedDoc = numberToString(this.smartDialog.data.selectedDoc);
  }

  submit(): void {
    this.smartDialog.close({confirmed: true});
  }

  cancel(): void {
    this.smartDialog.close();

  }

  showTac() {
    this.tacShow = true;
  }

  onClose(event: any): void {
    this.tacShow = event;
  }

}

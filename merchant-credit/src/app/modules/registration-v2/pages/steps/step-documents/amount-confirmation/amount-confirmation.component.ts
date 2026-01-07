import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SmartDialog } from '../../../../../../user-interface/services/smart-dialog';

@Component({
  selector: 'amount-confirmation',
  templateUrl: './amount-confirmation.component.html',
  styleUrls: ['./amount-confirmation.component.scss']
})
export class AmountConfirmationComponent implements OnInit {
  amount: number = 0;
  agreed = false;
  tacShow: boolean = false;

  constructor(
    private dialog: SmartDialog,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.amount = this.dialog.data.amount;
  }

  proceed(): void {
    this.dialog.close(true);
  }

  cancel(): void {
    this.dialog.close(false);
  }

  showTac() {
    this.tacShow = true;
    this.changeDetectorRef.detectChanges();
  }

  onClose(event: any): void {
    this.tacShow = event;
  }

}

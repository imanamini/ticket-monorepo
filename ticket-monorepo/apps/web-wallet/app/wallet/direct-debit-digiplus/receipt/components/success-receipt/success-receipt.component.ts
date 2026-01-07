import { Component, Input } from '@angular/core';
import { DirectDebitContractDuration } from '../../../../../api/models/direct-debit.response';

@Component({
  selector: 'app-success-receipt',
  templateUrl: './success-receipt.component.html',
  styleUrls: ['./success-receipt.component.scss']
})
export class SuccessReceiptComponent {
  @Input()
  contractDuration: DirectDebitContractDuration;
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DirectDebitBank } from '../../../../api/models/direct-debit.response';
import { GA_DIRECT_DEBIT_ID } from '../../../../api/constants/ga-direct-debit-id';

@Component({
  selector: 'app-create-contract-select-bank-dialog',
  templateUrl: './create-contract-select-bank-dialog.component.html',
  styleUrls: ['./create-contract-select-bank-dialog.component.scss']
})
export class CreateContractSelectBankDialogComponent {
  defaultDailyAmountMax = 2000000;
  GA_DIRECT_DEBIT_ID_CONTRACT_SELECT_BANK_CLICK = GA_DIRECT_DEBIT_ID.CONTRACT.SELECT_BANK_CLICK;
  @Input()
  selectedBank: DirectDebitBank;
  @Input()
  banks: Array<DirectDebitBank>;

  @Output()
  selectedBankEvent: EventEmitter<DirectDebitBank> = new EventEmitter<DirectDebitBank>();

  public selectBank(bankItem): void {
    this.selectedBank = bankItem;
    this.selectedBankEvent.emit(this.selectedBank);
  }
}

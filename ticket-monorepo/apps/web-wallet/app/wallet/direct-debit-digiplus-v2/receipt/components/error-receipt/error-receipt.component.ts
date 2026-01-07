import { Component, Input, OnInit } from '@angular/core';
import { DirectDebitContractDuration } from '../../../../../api/models/direct-debit.response';

@Component({
  selector: 'app-error-receipt',
  templateUrl: './error-receipt.component.html',
  styleUrls: ['./error-receipt.component.scss']
})
export class ErrorReceiptComponent implements OnInit {
  @Input()
  contractDuration: DirectDebitContractDuration;

  constructor() {
  }

  ngOnInit() {
  }

}

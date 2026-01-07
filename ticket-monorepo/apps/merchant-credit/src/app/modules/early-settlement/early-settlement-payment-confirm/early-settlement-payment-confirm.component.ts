import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CreditAllocationDetail } from '../../../api/clients/early-settlement/basic-models/credit-allocation-detail';
import moment from 'moment-jalaali';

@Component({
  selector: 'app-early-settlement-payment-confirm',
  templateUrl: './early-settlement-payment-confirm.component.html',
  styleUrls: ['./early-settlement-payment-confirm.component.scss']
})
export class EarlySettlementPaymentConfirmComponent implements OnInit, OnChanges {

  @Input() feeDetail?: CreditAllocationDetail;

  @Input() loadingCta: boolean = false;

  @Input() profileDisabled: boolean = false;

  @Input() fundProviderName: string = '';

  dueDateString: string = '';
  payable: boolean = true;

  @Output()
  confirm = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.feeDetail) {
      this.dueDateString = this.feeDetail ? moment(this.feeDetail.settlementDate).locale('fa').format('jDD jMMMM jYYYY') : '';
      this.payable = !!this.feeDetail && (this.feeDetail.fundProviderFee + this.feeDetail.digipayFee) > 0;
    }
  }

  onConfirm() {
    if (this.loadingCta) {
      return;
    }
    this.confirm.emit();
  }
}

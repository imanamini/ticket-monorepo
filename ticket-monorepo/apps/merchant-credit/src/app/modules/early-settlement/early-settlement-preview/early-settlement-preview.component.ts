import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CreditAllocationDetail } from '../../../api/clients/early-settlement/basic-models/credit-allocation-detail';
import { currencyFormat } from '@digipay/strings';
import moment from 'jalali-moment';

@Component({
  selector: 'app-early-settlement-preview',
  templateUrl: './early-settlement-preview.component.html',
  styleUrls: ['./early-settlement-preview.component.scss']
})
export class EarlySettlementPreviewComponent implements OnInit, OnChanges {

  @Input()
  feeDetail?: CreditAllocationDetail;
  @Input()
  minFeeDifference?: number;
  @Input()
  minFeeDifferenceLabel?: string;
  @Input()
  amount: number = 0;
  @Input()
  totalInvoiceAmount: number = 0;
  @Input()
  maxCreditAmount: number = 0;
  @Input()
  disabled: boolean = false;
  @Input()
  loading: boolean = false;

  detailInfoItems: { key: string, value: string, withoutLoading?: boolean }[] = [];
  mainInfoItems: { key: string, value: string, withoutLoading?: boolean }[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.feeDetail || changes.disabled) {
      this.prepareData();
    }
  }

  prepareData(): void {
    const feeDetail = this.disabled ? null : this.feeDetail;
    this.detailInfoItems = [
      {
        key: 'دریافتی نهایی شما',
        value: feeDetail?.settlementAmount ? this.amountString(feeDetail?.settlementAmount) : '-'
      },
      {
        key: 'حداکثر مبلغ قابل تسویه', value: this.maxCreditAmount ? this.amountString(this.maxCreditAmount) : '-',
        withoutLoading: true
      },

    ];
    this.mainInfoItems = [
      {
        key: feeDetail?.fundProviderInterestLabel || '...',
        value: feeDetail ? this.amountString(feeDetail?.fundProviderInterest) : '-'
      },
      {
        key: feeDetail?.feeLabel || '...',
        value: feeDetail ? (feeDetail.digipayFee + feeDetail.fundProviderFee) > 0 ? this.amountString(feeDetail.digipayFee + feeDetail.fundProviderFee) : 'رایگان' : '-'
      },
      {
        key: feeDetail?.settlementDate ? 'زمان واریز' : '...'
        , value: feeDetail ? this.dateString(feeDetail.settlementDate) : '-'
      }
    ];
  }

  amountString(amount: number): string {
    return (currencyFormat(amount) || 0) + ' ریال';

  }

  dateString(date: number): string {
    if (!date) {
      return '';
    }
    return moment(date).locale('fa').format('jDD jMMMM');
  }
}

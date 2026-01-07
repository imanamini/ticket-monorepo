import {Component, Input} from '@angular/core';
import {GA_DIRECT_DEBIT_ID} from '../../../../api/constants/ga-direct-debit-id';
import {DirectDebitContract} from '../../../../api/models/direct-debit.response';
import {NavigateService} from '../../../../api/services/navigate.service';
import {DIRECT_DEBIT_BANKS, DIRECT_DEBIT_BANKS_TRANSLATE} from '../../../../api/constants/direct-debit.constants';

@Component({
  selector: 'app-cash-in-result',
  templateUrl: './cash-in-result.component.html',
  styleUrls: ['./cash-in-result.component.scss']
})
export class CashInResultComponent {
  GA_DIRECT_DEBIT_ID_CONTRACT = GA_DIRECT_DEBIT_ID.CONTRACT;
  DIRECT_DEBIT_BANKS = DIRECT_DEBIT_BANKS;
  DIRECT_DEBIT_BANKS_TRANSLATE = DIRECT_DEBIT_BANKS_TRANSLATE;

  @Input() contractInfo: DirectDebitContract;

  constructor(public navigateService: NavigateService) {
  }
}

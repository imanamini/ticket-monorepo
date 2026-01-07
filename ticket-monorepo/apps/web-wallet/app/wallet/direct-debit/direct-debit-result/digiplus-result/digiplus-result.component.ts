import { Component, Input } from '@angular/core';
import { DirectDebitContract } from '../../../../api/models/direct-debit.response';
import { GA_DIRECT_DEBIT_ID } from '../../../../api/constants/ga-direct-debit-id';
import {
  DIRECT_DEBIT_BANKS,
  DIRECT_DEBIT_BANKS_TRANSLATE
} from '../../../../api/constants/direct-debit.constants';
import { RedirectService } from '../../../../core/services/redirect.service';
import { DirectDebitResultDataInterface } from '../interfaces/direct-debit-result-data.interface';

@Component({
  selector: 'app-digiplus-result',
  templateUrl: './digiplus-result.component.html',
  styleUrls: ['./digiplus-result.component.scss']
})
export class DigiplusResultComponent {
  GA_DIRECT_DEBIT_ID_CONTRACT = GA_DIRECT_DEBIT_ID.CONTRACT;
  DIRECT_DEBIT_BANKS_TRANSLATE = DIRECT_DEBIT_BANKS_TRANSLATE;
  DIRECT_DEBIT_BANKS = DIRECT_DEBIT_BANKS;
  @Input() contractId: string;
  @Input() resultData: DirectDebitResultDataInterface;
  @Input() contractInfo: DirectDebitContract;

  constructor(private redirectService: RedirectService) {
  }

  finish(): void {
    const contractId = {key: 'contractId', value: this.contractId};
    const status = {key: 'status', value: this.resultData.status};
    this.redirectService.setAndRedirect([contractId, status]);

  }

}

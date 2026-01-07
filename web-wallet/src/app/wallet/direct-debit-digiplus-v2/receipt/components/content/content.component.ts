import {Component, Input} from '@angular/core';
import {DirectDebitContract, DirectDebitTicketInfoResponse} from '../../../../../api/models/direct-debit.response';
import {RedirectService} from '../../../../../core/services/redirect.service';
import {DIRECT_DEBIT_BANKS, DIRECT_DEBIT_BANKS_TRANSLATE} from 'src/app/api/constants/direct-debit.constants';
import {
  DirectDebitResultDataInterface
} from 'src/app/wallet/direct-debit/direct-debit-result/interfaces/direct-debit-result-data.interface';
import {RedirectFormDataService} from '../../../services/redirect-form-data.service';
import {TicketInfoService} from '../../../services/ticket-info.service';
import {TicketService} from '../../../services/ticket.service';
import {DirectDebitNavigationService} from '../../../services/direct-debit-navigation.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  providers: [
    TicketInfoService,
    TicketService,
    RedirectFormDataService,
    DirectDebitNavigationService]
})
export class ContentComponent {
  DIRECT_DEBIT_BANKS_TRANSLATE = DIRECT_DEBIT_BANKS_TRANSLATE;
  DIRECT_DEBIT_BANKS = DIRECT_DEBIT_BANKS;
  @Input() decodedData: DirectDebitResultDataInterface;
  @Input() contractInfo: DirectDebitContract;
  @Input() ticketInfo: DirectDebitTicketInfoResponse;

  constructor(
    private redirectService: RedirectService,
    private redirectFormDataService: RedirectFormDataService) {
  }

  async finish(): Promise<void> {
    const providerId: string = (this.ticketInfo && this.ticketInfo.providerId) ? this.ticketInfo.providerId : null;
    this.redirectService.setAndRedirect(
      this.redirectFormDataService.get(
        this.contractInfo.contractId, this.decodedData.status, providerId));
  }
}

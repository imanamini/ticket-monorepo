import { Component, OnInit } from '@angular/core';
import { DirectDebitNavigationService } from './services/direct-debit-navigation.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';
import { PERSISTENT_STORAGE_KEYS } from '../../../core/constants';
import { DirectDebitTicketInfoResponse } from '../../../api/models/direct-debit.response';

@Component({
  selector: 'app-withdrawal-details-digiplus',
  templateUrl: './withdrawal-details-digiplus.component.html',
  styleUrls: ['./withdrawal-details-digiplus.component.scss']
})
export class WithdrawalDetailsDigiplusComponent implements OnInit {
  isLoading = false;
  submitLoading = false;
  state: DirectDebitTicketInfoResponse;

  constructor(
    private directDebitNavigationService: DirectDebitNavigationService,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService) {
  }

  ngOnInit() {
    this.getAmount();
  }

  public cancel(): void {
    this.directDebitNavigationService.navigateToCallback();
  }

  public submit(): void {
    const ticket: string = this.directDebitNavigationService.getParam(this.activatedRoute, 'ticket');
    const actionType: string = this.directDebitNavigationService.getQueryParam(this.activatedRoute, 'actionType');
    this.directDebitNavigationService.navigateToContract(ticket, {actionType});
  }

  private getAmount(): void {
    this.state = this.storageService.getPersistantJsonItem(PERSISTENT_STORAGE_KEYS.DIRECT_DEBIT_TICKET_INFO);
  }
}

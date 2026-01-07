import { Component, OnInit } from '@angular/core';
import { DirectDebitTicketInfoResponse } from '../../../api/models/direct-debit.response';
import { DirectDebitNavigationService } from '../services/direct-debit-navigation.service';
import { Router } from '@angular/router';
import { FormService } from './services/form.service';
import { RedirectDataFactory } from '../utiles/redirect-form-data';
import { RedirectFormData } from '../../../core/services/redirect.service';
import { TicketInfoService } from '../services/ticket-info.service';
import { TicketService } from '../services/ticket.service';

@Component({
  selector: 'app-withdrawal-detail',
  templateUrl: './withdrawal-detail.component.html',
  styleUrls: ['./withdrawal-detail.component.scss'],
  providers: [
    TicketService,
    TicketInfoService,
    DirectDebitNavigationService
  ]
})
export class WithdrawalDetailComponent implements OnInit {
  loadingPage = false;
  submitLoading = false;
  ticketInfo: DirectDebitTicketInfoResponse;
  tokenExpired = false;

  constructor(
    public formService: FormService,
    private directDebitNavigationService: DirectDebitNavigationService,
    private router: Router,
    private ticketInfoService: TicketInfoService,
    private ticketService: TicketService,
  ) {
  }

  ngOnInit() {
    this.getTicketInfo().then();
  }

  public cancel(): void {
    const redirectFormData: RedirectFormData[] = new RedirectDataFactory()
      .cancelByUserFormData(this.ticketInfo.providerId);
    this.directDebitNavigationService.navigateToMerchant(redirectFormData).then();
  }

  public unAuthorizedRedirectFormData(): void {
    const redirectFormData: RedirectFormData[] = new RedirectDataFactory()
      .unknownFormData(this.ticketInfo.providerId);
    this.directDebitNavigationService.navigateToMerchant(redirectFormData).then();
  }

  public async continue(): Promise<void> {
    this.submitLoading = true;
    const ticket: string = this.ticketService.get();
    try {
      await this.formService.checkValidateNationalCode(ticket);
      const nationalCode = Boolean(this.formService.state.controls['nationalCode'].value) ?
       this.formService.state.controls['nationalCode'].value: null;
      await this.directDebitNavigationService.satQueryParam('nationalCode', nationalCode);
      await this.directDebitNavigationService.navigateToBackUpAccount('nationalCode', nationalCode);
      this.submitLoading = false;
    } catch (error) {
      this.submitLoading = false;
    }
  }

  private async getTicketInfo(): Promise<void> {
    this.loadingPage = true;
    try {
      this.ticketInfo = await this.ticketInfoService.get();
      this.loadingPage = false;
    } catch (error) {
    }
  }
}

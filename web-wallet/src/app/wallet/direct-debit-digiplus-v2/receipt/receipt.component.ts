import { Component, OnInit } from '@angular/core';
import { DirectDebitContract, DirectDebitTicketInfoResponse } from '../../../api/models/direct-debit.response';
import { DirectDebitCardModel } from '../../direct-debit/direct-debit-result/models/direct-debit-card.model';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../../core/services/message.service';
import { RedirectService } from '../../../core/services/redirect.service';
import { HandleErrorService } from '../services/handle-error.service';
import { ApiResult } from '../../../api/models/api-result';
import { ResultDataStatusEnum } from './enums/receipt-status.enum';
import { CARD } from './consts/digiplus-reciept-card.const';
import { DigiplusReceiptStateInterface } from './models/digiplus-receipt-state.interface';
import { DirectDebitResultDataInterface } from '../models/direct-debit-result-data.interface';
import {DirectDebitApiV2Service} from "../../../api/direct-debit-api-v2.service";

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],

})
export class ReceiptComponent implements OnInit {
  ResultDataStatusEnum = ResultDataStatusEnum;
  isLoading = false;
  contract: DirectDebitContract;
  state: DigiplusReceiptStateInterface;
  decodedData: DirectDebitResultDataInterface;
  card = new DirectDebitCardModel().card = CARD;
  ticketInfo: DirectDebitTicketInfoResponse;

  constructor(
    public route: ActivatedRoute,
    private directDebitApiV2Service: DirectDebitApiV2Service,
    private messageService: MessageService,
    private redirectService: RedirectService,
    private handleErrorService: HandleErrorService
  ) {
  }

  ngOnInit() {
    this.decodeData();
    this.getTicketInfo();
  }

  public getTicketInfo(): void {
    this.isLoading = true;
    this.directDebitApiV2Service.getDirectDebitTicketInfoV2(this.decodedData.ticket)
      .subscribe((response) => {
        this.ticketInfo = response;
        this.redirectService.url.next(response.callbackUrl);
        this.getContractInfo();
      }, (errorResponse: ApiResult) => {
        this.handleErrorService.handle(errorResponse);
        this.isLoading = false;
      });
  }

  private decodeData(): void {
    this.decodedData = JSON.parse(decodeURIComponent(escape(window.atob(this.route.snapshot.queryParams['data']))));
  }

  private getContractInfo(): void {
    this.directDebitApiV2Service.getDirectDebitContractInfoV2(this.decodedData.contractId, this.decodedData.ticket)
      .subscribe((response) => {
        this.contract = response.contract;
        this.isLoading = false;
      }, (errorResponse: ApiResult) => {
        this.handleErrorService.handle(errorResponse);
        this.isLoading = false;
      });
  }
}

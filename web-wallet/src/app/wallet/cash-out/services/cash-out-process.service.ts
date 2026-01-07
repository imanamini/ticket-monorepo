import {Inject, inject, Injectable} from '@angular/core';
import {
  getCardInfoEnteredByUser, getSelectedUserAmount,
  saveTransferKey,
  saveFeeCharge,
  saveSelectedUserAmount,
  saveTacUrl, getActionQueryParam
} from '../utiles/storage';
import { CardService } from './card.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { CreateCashOutUrl } from '../utiles/create-cash-out-url';
import {CashOutConfigModel, CashOutResult, MappedCashOutResult} from '../models/cash-out.model';
import { PATH } from '../consts/cash-out-paths.const';
import {MessageService} from "../../../core/services/message.service";
import {CashOutService} from "./cash-out.service";
import {ReceiptService} from "../components/receipt/services/receipt.service";
import {ReceiptInterface} from "../components/receipt/models/receipt.interface";
import {fixActivityInfoArray} from "../utiles/object";
import {CashOutRegisterModel} from "../models/cash-out-register.model";
import {APP_ACTIONS} from "../models/app-actions";
import {TICKET_TOKEN} from "../utiles/ticket-token";
import {BehaviorSubject} from "rxjs";

const KYC_ERROR_TITLE = 'WALLET_CASH_OUT_KYC_REJECTED';

@Injectable()
export class CashOutProcessService {
  private cashOutApiService = inject(CashOutService);
  private cardService = inject(CardService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private selectedUserAmount: number;
  private receiptService = inject(ReceiptService);
  private messageService = inject(MessageService);
  private activatedRoute = inject(ActivatedRoute);

  constructor(@Inject(TICKET_TOKEN) private ticketToken: BehaviorSubject<string>,) {
  }

  public reset(): void {
    this.selectedUserAmount = null;
  }

  public register(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cashOutApiService.registerCashOut(this.getInformation())
        .pipe(
          switchMap((registerResponse) => {
            const url: string = CreateCashOutUrl(registerResponse.detailUrl);
            return this.http.get<CashOutResult>('/digipay/api/' + url , {
              headers: new HttpHeaders({'ticket': this.ticketToken.value})
            });
          })
        ).subscribe((result: CashOutResult) => {
          //ToDo: When back end sent redirect url change redirect url dynamically.
          const receiptState: ReceiptInterface = this.createReceiptResult(result);
          this.receiptService.setState(receiptState);
          this.router.navigate(['../'+ PATH.receipt , this.ticketToken.value], { relativeTo: this.activatedRoute });
          resolve(true);
        },
        (error) => {
          reject(error);
          if (error?.error.result.title === KYC_ERROR_TITLE) {
            this.messageService.showErrorMessage(error?.error?.result?.message);
            return;
          }
          this.messageService.showErrorMessage(error?.error?.result?.message);
        });
    });
  }

  public getConfig(): Promise<CashOutConfigModel> {
    return new Promise((resolve, reject) => {
      this.cashOutApiService.getCashOutConfig()
        .subscribe((config: CashOutConfigModel) => {
          saveTacUrl(config.tacUrl);
          saveTransferKey(config.certFile);
          saveFeeCharge(config.feeCharge);
          resolve(config);
        }, (error) => {
          reject(error);
        });
    });
  }

  public setSelectedUserAmount(amount: number): void {
    this.selectedUserAmount = amount;
    saveSelectedUserAmount(amount);
  }

  private cashOutMapper(result: CashOutResult): MappedCashOutResult {
    return {
      status: result.status,
      color: result.color,
      imageId: result.imageId,
      title: result.title,
      amount: result.amount,
      paymentResult: fixActivityInfoArray(result['detailInfo']),
      trackingCode: result.trackingCode,
      description: result.description,
    };
  }

  public getSelectedUserAmount(): number | null {
    if (this.selectedUserAmount) {
      return this.selectedUserAmount;
    }
    if (sessionStorage.getItem('__selectedUserAmount')) {
      return Number(getSelectedUserAmount());
    }
    if(this.activatedRoute.snapshot.queryParams['amount']){
      return Number(this.activatedRoute.snapshot.queryParams['amount']);
    }
    return null;
  }

  private getInformation(): CashOutRegisterModel {
    return {
      amount: this.getSelectedUserAmount(),
      type: 'card',
      targetPan: {
        prefix: JSON.parse(getCardInfoEnteredByUser()).prefix,
        postfix: JSON.parse(getCardInfoEnteredByUser()).postfix,
        expireDate: this.cardService.getSelectedCardProfile().expireDate,
        type: JSON.parse(getCardInfoEnteredByUser()).type,
        value: JSON.parse(getCardInfoEnteredByUser()).value,
      }
    };
  }

  private createReceiptResult(result: CashOutResult): ReceiptInterface {
    // If action type has been saved this means user come from digikala
    const actionType: APP_ACTIONS = getActionQueryParam() ? JSON.parse(getActionQueryParam()) : null;
    if (actionType) {
      return {
        ...this.cashOutMapper(result),
        redirectUrl: 'https://www.digikala.com/profile/'
      };
    }
    return {
      ...this.cashOutMapper(result),
    };
  }
}

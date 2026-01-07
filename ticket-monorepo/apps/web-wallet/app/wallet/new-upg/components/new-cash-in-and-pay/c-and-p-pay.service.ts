import {inject, Injectable} from '@angular/core';
import {ApiService} from "../../../../core/http/api.service";
import {extractJavaScriptCode, runJavaScriptCode} from "./js-code-processor";
import {HttpHeaders} from "@angular/common/http";
import {TicketInfoService} from "../../services/ticket-info.service";

@Injectable()
export class CAndPPayService {
  private apiService = inject(ApiService);
  private ticketInfoService = inject(TicketInfoService);

  public navigateToPay(payUrl: string): void {
    const headers = new HttpHeaders({
      'ticket': this.ticketInfoService.ticket
    });
    this.apiService.get(payUrl, null, {headers, responseType: 'text'}).subscribe(
      (htmlContent: string) => {
        const jsCodeBlock = extractJavaScriptCode(htmlContent);
        runJavaScriptCode(jsCodeBlock);
      },
      (error) => {
        console.error('Error redirecting to payment:', error);
      }
    );
  }
}


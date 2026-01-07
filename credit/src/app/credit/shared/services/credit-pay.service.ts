import { Injectable } from '@angular/core';
import { CreditInfoResponse } from '../../api/purchase/credit-info-response.model';
import { StorageService } from '../../core/services/storage.service';
import { CreditApiService } from '../../api/credit-api.service';
import { Router } from '@angular/router';
import { EventManagementApiService } from '../../api/event-management-api.service';

@Injectable({
  providedIn: 'root'
})
export class CreditPayService {

  constructor(
    private storageService: StorageService,
    private api: CreditApiService,
    private router: Router,
    private eventManagementApiService: EventManagementApiService,
  ) {
  }

  getTicketInfo(creditAmount: number = null): Promise<CreditInfoResponse> {
    return new Promise((resolve, reject) => {
      const ticket = this.storageService.get('ticket');
      if (!ticket) {
        this.goToExpiredTokenPage();
        reject();
        return;
      }

      this.api.getTicketInfo(ticket, creditAmount).subscribe((response) => {
        // Check if response is from Digikala and trigger event
        if (response?.cancelRedirect?.url && response.cancelRedirect.url.includes('digikala.com')) {
          this.eventManagementApiService.sendEvents({
            eventType: 'visit',
            breadCrumbs: ['bnpl-pay'],
            data: {
              target: 'digikala.com',
            },
          });
        }

        resolve(response);
      }, response => {
        if (response.httpStatus && response.httpStatus === 401) {
          this.goToExpiredTokenPage();
          return;
        }
        reject(response);
      });
    });
  }

  public goToErrorPageByErrorResponse(error: any) {
    this.goToErrorPage(error && error.result && error.result.message ? error.result.message : '');
  }

  public goToErrorPage(errorText: string = '') {
    this.router.navigateByUrl('/error', {
      state: {
        errorText
      }
    });
  }

  public goToExpiredTokenPage() {
    this.goToErrorPage('خرید منقضی شده است');
  }

}

import { Component, OnInit } from '@angular/core';
import { CreditInfoResponse } from '../../../api/purchase/credit-info-response.model';
import { Router } from '@angular/router';
import { NetworkConnectionService } from '../../../core/services/network-connection.service';
import { CreditPayService } from '../../../shared/services/credit-pay.service';
import { CreditWallet } from '../../../api/purchase/credit-wallet.model';
import { StorageService } from '../../../core/services/storage.service';
import { CreditApiService } from '../../../api/credit-api.service';
import { CreditOfferItem } from '../../../api/offer/offer-info-response.model';
import { CancelService } from '../../../shared/services/cancel.service';
import { TicketType } from '../../../api/purchase/ticket-type.model';
import { TicketServiceMapper } from '../../../../utils/ticket-service-mapper';

enum errorStatus {
  'USER_NOT_FOUND' = 1010,
  'ACCOUNT_NOT_FOUND' = 1026,
  'BLOCK_USER' = 5206
}

@Component({
  selector: 'app-pay-flow',
  templateUrl: './pay-amount.component.html',
  styleUrls: ['./pay-amount.component.scss', '../../shared.style.scss']
})
export class PayAmountComponent implements OnInit {

  creditInfo: CreditInfoResponse;

  gettingData = true;

  disconnected = false;

  routing: boolean;
  selectedIndex = 0;
  selectedCreditItem: CreditWallet;
  offerMode: boolean;
  offers: CreditOfferItem[];

  constructor(
    private router: Router,
    private networkConnectionService: NetworkConnectionService,
    private storageService: StorageService,
    public creditPayService: CreditPayService,
    private creditApiService: CreditApiService,
    private cancelService: CancelService,
  ) {

    this.monitorNetwork();
  }

  ngOnInit() {
    this.getData();
  }

  getOffers(ticketType: TicketType, amount: number) {
    return new Promise<void>(resolve => {
      const serviceType = TicketServiceMapper[ticketType];
      this.creditApiService.getCreditOfferInfo(serviceType, amount).subscribe(res => {
        if (res.creditOfferList && res.creditOfferList[0]) {
          const offer = res.creditOfferList[0];
          if (offer.creditOfferType === 'BNPL') {
            this.router.navigateByUrl('bnpl');
            return;
          }
          if (offer.creditOfferType === 'CREDIT') {
            this.offers = [offer];
            resolve();
            return;
          }
        }
        this.creditPayService.goToErrorPage();
        resolve();
        return;
      });
    });
  }

  cancelPay() {
    this.cancelService.confirmBottomSheet();
  }

  onConfirm() {
    if (this.routing) {
      return;
    }
    if (!this.selectedCreditItem) {
      return;
    }
    this.routing = true;
    this.router.navigate([
      'pay/credit/details',
      this.storageService.get('ticket'),
      this.selectedCreditItem.fundProvider.businessId,
      this.selectedCreditItem.creditId,
    ]).then(() => {
      this.routing = false;
    });
  }

  onSelect(index: number) {
    this.selectedIndex = index;
    this.selectedCreditItem = this.creditInfo.creditDetails[index];
  }

  setCancelRedirect(ticketInfo: CreditInfoResponse) {
    this.storageService.set({
      cancelRedirect: ticketInfo.cancelRedirect
    });
  }

  private getData() {
    this.gettingData = true;
    this.creditPayService.getTicketInfo().then(response => {
      this.setCancelRedirect(response);
      if (response.creditDetails.length === 0) {
        this.offerMode = true;
        this.getOffers(response.ticketType, response.amount).then(() => {
          this.creditInfo = response;
          this.gettingData = false;
        });
        return;
      }
      this.creditInfo = response;
      this.selectDefaultOption();
      this.gettingData = false;
    }).catch(response => {
      if (response && response.result) {
        if (response.result.status === errorStatus.BLOCK_USER || response.result.status === errorStatus.USER_NOT_FOUND) {
          this.creditPayService.goToErrorPage();
          return;
        }
        if (response.result.status === errorStatus.ACCOUNT_NOT_FOUND) {
          this.offerMode = true;
          // In this error case, there isn't ticket type and amount in response
          this.getOffers(response.ticketType, response.amount).then(() => {
            this.gettingData = false;
          });
          return;
        }
        this.creditPayService.goToErrorPage(response.result.message ? response.result.message : '');
        return;
      }
      if (response.httpStatus && response.httpStatus === 401) {
        this.creditPayService.goToExpiredTokenPage();
        return;
      }
      this.creditPayService.goToErrorPage('');

    });
  }

  private monitorNetwork() {
    this.networkConnectionService.onConnectionStatusChange().subscribe(isOnline => {
      if (isOnline === false) {
        this.disconnected = true;
        this.networkConnectionService.disconnectedMessage();
      }
      if (isOnline === true && this.disconnected) {
        this.networkConnectionService.reConnectedMessage();
        this.disconnected = false;
      }
    });
  }

  private selectDefaultOption() {
    const selectedIndex = this.creditInfo.creditDetails.findIndex(opt => opt.balance > 0 && opt.creditAmount > 0 && !opt.disable);
    this.onSelect(selectedIndex);
  }
}

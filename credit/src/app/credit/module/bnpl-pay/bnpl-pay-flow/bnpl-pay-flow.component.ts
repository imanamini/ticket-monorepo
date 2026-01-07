import { Component, OnInit, signal } from '@angular/core';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { StorageService } from '../../../core/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditPayService } from '../../../shared/services/credit-pay.service';
import { CreditInfoResponse } from '../../../api/purchase/credit-info-response.model';
import { CreditApiService } from '../../../api/credit-api.service';
import { CreditWallet } from '../../../api/purchase/credit-wallet.model';
import { CancelService } from '../../../shared/services/cancel.service';
import { TicketType } from '../../../api/purchase/ticket-type.model';
import { TicketServiceMapper } from '../../../../utils/ticket-service-mapper';
import { CouponBottomSheetComponent } from '../coupon-bottom-sheet/coupon-bottom-sheet.component';
import { CouponService } from '../../services/coupon/coupon.service';
import { CreditPaymentFooterRow } from '../../../credit-ui/credit-payment-footer/data-access/credit-payment-footer-row';
import { EventManagementApiService } from '../../../api/event-management-api.service';

enum errorStatus {
  'USER_NOT_FOUND' = 1010,
  'ACCOUNT_NOT_FOUND' = 1026,
  'BLOCK_USER' = 5206
}

interface Footer {
  finalAmount: number;
  finalAmountTitle: string;
  rows: CreditPaymentFooterRow[];
}

@Component({
  selector: 'app-bnpl-pay-flow',
  templateUrl: './bnpl-pay-flow.component.html',
  styleUrls: ['./bnpl-pay-flow.component.scss'],
})
export class BnplPayFlowComponent implements OnInit {

  gettingData: boolean;
  creditInfo: CreditInfoResponse;
  selectedIndex = 0;
  selectedCreditItem: CreditWallet;
  footer = signal<Footer | undefined>(undefined);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
    private creditPayService: CreditPayService,
    private creditApiService: CreditApiService,
    private cancelService: CancelService,
    private ngxBottomSheetService: NgxBottomSheetService,
    private couponService: CouponService,
    private eventManagementApiService: EventManagementApiService
  ) {
  }

  ngOnInit() {
    const ticket = this.activatedRoute.snapshot.paramMap.get('ticket');
    this.storage.set({
      ticket,
    });
    this.getData();
  }

  getOffers(ticketType: TicketType, amount: number) {
    return new Promise<void>(resolve => {
      const serviceType = TicketServiceMapper[ticketType];
      this.creditApiService.getCreditOfferInfo(serviceType, amount).subscribe(res => {
        if (res.creditOfferList && res.creditOfferList[0]) {
          const offer = res.creditOfferList[0];
          if (offer.creditOfferType === 'BNPL') {
            this.router.navigateByUrl('bnpl', {state: this.creditInfo});
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

  navigateToConfirm(creditDetails: CreditWallet[]) {
    const state = {
      creditDetails
    };
    this.router.navigate(['bnpl-pay/confirm', this.storage.get('ticket')], {
      state
    });
  }

  navigateToDetail(fundProviderBusinessId: string, creditId: string): void {
    const couponCode = this.couponService.getCoupon(creditId)?.couponCode;
    const commands = [
      'bnpl-pay/details',
      this.storage.get('ticket'),
      fundProviderBusinessId,
      creditId
    ];
    if (couponCode) commands.push(couponCode);
    this.router.navigate(commands);
  }

  onSelect(index: number) {
    this.selectedIndex = index;
    this.selectedCreditItem = this.creditInfo.creditDetails[index];
    this.updatePaymentFooter();
  }

  cancelPay() {
    this.cancelService.confirmBottomSheet();
  }

  setCancelRedirect(ticketInfo: CreditInfoResponse) {
    this.storage.set({
      cancelRedirect: ticketInfo.cancelRedirect
    });
  }

  private getData() {
    this.gettingData = true;
    this.creditPayService.getTicketInfo().then(response => {
      this.setCancelRedirect(response);
      this.creditInfo = response;
      if (response.creditDetails.length === 0) {
        this.getOffers(response.ticketType, response.amount).then(() => {
          this.gettingData = false;
        });
        return;
      }
      if (response.creditDetails.length === 1 && !response.creditDetails[0].disable && !response.couponVisible) {
        this.navigateToDetail(response.creditDetails[0].fundProvider.businessId, response.creditDetails[0].creditId);
        return;
      }
      this.selectDefaultOption();
      this.updatePaymentFooter();
      this.gettingData = false;
    }).catch(response => {
      if (response && response.result) {
        if (response.result.status === errorStatus.BLOCK_USER || response.result.status === errorStatus.USER_NOT_FOUND) {
          this.creditPayService.goToErrorPage();
          return;
        }
        if (response.result.status === errorStatus.ACCOUNT_NOT_FOUND) {
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

  private selectDefaultOption() {
    const selectedIndex = this.creditInfo.creditDetails.findIndex(opt => opt.balance > 0 && opt.creditAmount > 0 && !opt.disable);
    this.onSelect((selectedIndex >= 0) ? selectedIndex : 0);
  }

  couponClickedHandler() {
    this.sendCouponCtaClick();
    this.ngxBottomSheetService.openBottomSheet(CouponBottomSheetComponent, {
        creditId: this.selectedCreditItem.creditId
      },
      {
        noPadding: true,
      }
    );

    const subscription = this.ngxBottomSheetService.onClose.subscribe(() => {
      subscription.unsubscribe();
      const result = this.ngxBottomSheetService.outputData();
      if (result) {
        this.updatePaymentFooter();
      }
    });
  }

  sendCouponCtaClick(): void {
    this.eventManagementApiService.sendEvents({
      eventType: 'click',
      breadCrumbs: ['bnpl-pay-flow'],
      data: {
        target: 'coupon-cta',
      },
    });
  }

  updatePaymentFooter() {
    const creditId = this.selectedCreditItem.creditId;
    const coupon = this.couponService.getCoupon(creditId);
    if (coupon) {
      this.footer.set({
        finalAmountTitle: 'مبلغ نهایی سبد خرید',
        finalAmount: coupon.finalAmount,
        rows: [
          {
            title: 'سبد خرید',
            value: coupon.amount,
            type: 'default',
            status: 'default',
          },
          {
            title: 'مبلغ تخفیف',
            value: coupon.couponAmount,
            type: 'default',
            status: 'success'
          }
        ]
      });
    } else {
      this.footer.set({
        finalAmountTitle: 'مبلغ سبد خرید',
        finalAmount: this.selectedCreditItem.purchaseAmount,
        rows: []
      });
    }
  }
}

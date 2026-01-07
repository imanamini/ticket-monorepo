import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { CreditUrlService } from '../../../data-access/utils/url';
import { CUSTOMER_TYPE } from '../../../data-access/models/credit/installment/customer-type';
import { BNPL_TYPE } from '../../../data-access/models/credit/installment/bnpl-type';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { BnplHelpComponent } from '../../../features/bnpl/bnpl-help/bnpl-help/bnpl-help.component';

@Component({
  selector: 'app-credit-early-settlement-info-cards',
  templateUrl: './credit-early-settlement-info-cards.component.html',
  styleUrls: ['./credit-early-settlement-info-cards.component.scss'],
  standalone: true,
  imports: [NgxIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditEarlySettlementInfoCardsComponent {
  creditId = input.required<string>();
  customerType = input<CUSTOMER_TYPE>();
  bnplType = input<BNPL_TYPE>();

  bottomSheetService = inject(NgxBottomSheetService);
  private eventService = inject(NgxEventTrackerService);
  router = inject(Router);
  creditUrlService = inject(CreditUrlService);

  goToPurchasePage(): void {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath(`/wallet-transactions/${this.creditId()}`)).then(() => {
      this.eventService.sendEvent({
        eventName: 'PRS',
        eventData: {},
      });
    });
  }

  openHelp(): void {
    this.eventService.sendEvent({ eventName: 'CGS', eventData: {} });
    const customerTypeUrl = this.customerType() === CUSTOMER_TYPE.ORGANIZATIONAL ? 'org' : 'individual';
    const bnplTypeUrl = this.bnplType() === BNPL_TYPE.BNPL1PAY ? '1pay' : '4pay';
    const pageTitleMapper = {
      [CUSTOMER_TYPE.INDIVIDUAL]: 'راهنمای اعتبار',
      [CUSTOMER_TYPE.ORGANIZATIONAL]: 'راهنمای اعتبار (سازمانی)',
    };
    const pageTitle = pageTitleMapper[this.customerType()!] || pageTitleMapper[CUSTOMER_TYPE.INDIVIDUAL];
    this.bottomSheetService.openBottomSheet(
      BnplHelpComponent,
      {
        bnplType: bnplTypeUrl,
        customerType: customerTypeUrl,
        pageTitle: pageTitle,
        isInApp: true,
      },
      {
        height: '80%',
      },
    );
  }
}

import { Component, Input } from '@angular/core';
import { MerchantsDigikalaCreditPromotion } from '../../../../../../../api/clients/models/templates/merchants-digikala/merchants-digikala-template-data';
import { CreditSmartestInstallmentsComponent } from './credit-smartest-installments/credit-smartest-installments.component';
import { GainCreditOfferComponent } from './gain-credit-offer/gain-credit-offer.component';
import { CreditRenewHomeWithInstallmentsComponent } from './credit-renew-home-with-installments/credit-renew-home-with-installments';
import { CreditPromotionTechBestSellersComponent } from './credit-promotion-tech-best-sellers/credit-promotion-tech-best-sellers.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-merchants-digikala-credit-promotion',
  templateUrl: './merchants-digikala-credit-promotion.component.html',
  styleUrls: ['./merchants-digikala-credit-promotion.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    CreditPromotionTechBestSellersComponent,
    CreditRenewHomeWithInstallmentsComponent,
    GainCreditOfferComponent,
    CreditSmartestInstallmentsComponent,
  ],
})
export class MerchantsDigikalaCreditPromotionComponent {
  @Input()
  creditPromotionData: MerchantsDigikalaCreditPromotion;
}

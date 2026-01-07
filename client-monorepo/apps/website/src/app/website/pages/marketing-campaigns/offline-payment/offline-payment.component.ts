import { Component, OnInit } from '@angular/core';
import { PageDataService } from '../../../services/page-data.service';
import { Page } from '../../../../api/clients/models/content/page';
import { OfflinePaymentTemplateDataResponse } from './offline-payment-template-data.response';
import { OfflinePaymentHeroSectionComponent } from './offline-payment-hero-section/offline-payment-hero-section.component';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { OfflinePaymentMediaComponent } from './offline-payment-media/offline-payment-media.component';
import { OfflinePaymentStepsComponent } from './offline-payment-steps/offline-payment-steps.component';
import { OfflinePaymentValuePropositionsComponent } from './offline-payment-value-propositions/offline-payment-value-propositions.component';
import { NgIf } from '@angular/common';
import { CBnplStoresComponent } from '../../credit/c-bnpl/c-bnpl/components/c-bnpl-stores/c-bnpl-stores.component';
import { UiFaqComponent } from '../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';

@Component({
  selector: 'app-offline-payment',
  templateUrl: './offline-payment.component.html',
  standalone: true,
  styleUrls: ['./offline-payment.component.scss'],
  imports: [
    OfflinePaymentHeroSectionComponent,
    BaseLayoutComponent,
    OfflinePaymentMediaComponent,
    OfflinePaymentStepsComponent,
    NgIf,
    CBnplStoresComponent,
    UiFaqComponent,
    OfflinePaymentValuePropositionsComponent,
  ],
})
export class OfflinePaymentComponent implements OnInit {
  loaded = false;
  CampaignPageData: Page<OfflinePaymentTemplateDataResponse>;

  constructor(private pageDataService: PageDataService) {}

  ngOnInit(): void {
    this.pageDataService.getPageData('campaigns', 'offline-payment').subscribe((res) => {
      this.CampaignPageData = res.page;
      this.loaded = true;
    });
  }
}

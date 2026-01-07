import { Component } from '@angular/core';
import { MerchantsModel, MerchantsModelType } from './merchants.model';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-metro-campaign-merchants',
  templateUrl: './metro-campaign-merchants.component.html',
  styleUrls: ['./metro-campaign-merchants.component.scss'],
  standalone: true,
  imports: [NgFor],
})
export class MetroCampaignMerchantsComponent {
  merchants: MerchantsModelType = MerchantsModel;
}

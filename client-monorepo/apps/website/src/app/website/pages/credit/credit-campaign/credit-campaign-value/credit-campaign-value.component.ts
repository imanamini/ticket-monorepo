import { Component, Input } from '@angular/core';
import { CreditCampaignTemplate } from '../../../../../api/clients/models/templates/credit-campaign/credit-campaign-template';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-credit-campaign-value',
  templateUrl: './credit-campaign-value.component.html',
  styleUrls: ['./credit-campaign-value.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, UiButtonComponent],
})
export class CreditCampaignValueComponent {
  @Input()
  templateData!: CreditCampaignTemplate;
}

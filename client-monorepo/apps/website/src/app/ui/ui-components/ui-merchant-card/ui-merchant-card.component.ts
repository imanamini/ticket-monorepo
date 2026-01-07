import { Component, Input } from '@angular/core';
import { Merchant } from '../../../api/clients/models/templates/credit-v3/credit-config.response';
import { UiButtonComponent } from '../ui-button/ui-button/ui-button.component';
import { NgIf, NgFor, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-ui-merchant-card',
  templateUrl: './ui-merchant-card.component.html',
  styleUrls: ['./ui-merchant-card.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgOptimizedImage, UiButtonComponent],
})
export class UiMerchantCardComponent {
  @Input()
  merchant: Merchant;
}

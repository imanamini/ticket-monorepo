import { Component, Input } from '@angular/core';
import { WealthBoursePromotion } from '../../../../../api/clients/models/templates/wealth/wealth-template-data';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { UiIconDirective } from '../../../../../ui/ui-directive/ui-icon.directive';

@Component({
  selector: 'app-bourse-promotion',
  templateUrl: './bourse-promotion.component.html',
  styleUrls: ['./bourse-promotion.component.scss'],
  standalone: true,
  imports: [UiIconDirective, NgFor, NgIf, NgOptimizedImage, UiButtonComponent],
})
export class BoursePromotionComponent {
  @Input() boursePromotionData: WealthBoursePromotion;
  @Input() wealthMode = false;
}

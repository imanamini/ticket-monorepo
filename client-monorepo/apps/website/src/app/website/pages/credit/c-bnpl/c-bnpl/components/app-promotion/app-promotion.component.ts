import { Component, Input } from '@angular/core';
import { AppPromotion } from '../../../../../../../api/clients/models/templates/c-bnpl-v2/c-bnpl-v2-template-data.response';
import { DownloadAppLinkDirective } from '../../../../../../../ui/ui-directive/download-app-link.directive';
import { UiButtonComponent } from '../../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { UiIconDirective } from '../../../../../../../ui/ui-directive/ui-icon.directive';

@Component({
  selector: 'app-promotion',
  templateUrl: './app-promotion.component.html',
  styleUrls: ['./app-promotion.component.scss'],
  standalone: true,
  imports: [NgIf, UiButtonComponent, DownloadAppLinkDirective, UiIconDirective, NgOptimizedImage],
})
export class AppPromotionComponent {
  @Input() appPromotionData: AppPromotion;
}

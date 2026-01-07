import { Component, Input } from '@angular/core';
import { HeroSection } from '../offline-payment-template-data.response';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-offline-payment-hero-section',
  templateUrl: './offline-payment-hero-section.component.html',
  styleUrls: ['./offline-payment-hero-section.component.scss'],
  standalone: true,
  imports: [UiButtonComponent, NgIf],
})
export class OfflinePaymentHeroSectionComponent {
  @Input() heroSection: HeroSection;
}

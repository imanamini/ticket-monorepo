import {ChangeDetectionStrategy, Component, inject, input, signal} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {
  SectionRegistration
} from '../../../../../../../api/clients/models/templates/c-credit/c-credit-v2-template-data';
import {NgxButtonComponent} from '@digipay/ngx-button';
import {UrlService} from "../../../../../../services/url.service";
import {DeviceDetectorService} from "../../../../../../../core/services/device/deviceDetector.service";

@Component({
  selector: 'app-credit-onsite-registration-section',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, NgxButtonComponent],
  templateUrl: './credit-onsite-registration-section.component.html',
  styleUrl: './credit-onsite-registration-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditOnsiteRegistrationSectionComponent {
  data = input.required<SectionRegistration>();

  deviceDetector = inject(DeviceDetectorService);
  urlService = inject(UrlService)

  openLink(link: string) {
    this.urlService.handleLink(link);
  }
}

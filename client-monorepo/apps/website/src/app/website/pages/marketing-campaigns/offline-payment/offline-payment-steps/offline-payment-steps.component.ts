import { Component, Input } from '@angular/core';
import { StepsSection } from '../offline-payment-template-data.response';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-offline-payment-steps',
  templateUrl: './offline-payment-steps.component.html',
  standalone: true,
  styleUrls: ['./offline-payment-steps.component.scss'],
  imports: [UiButtonComponent, NgxIcon],
})
export class OfflinePaymentStepsComponent {
  @Input() stepsSection: StepsSection;
}

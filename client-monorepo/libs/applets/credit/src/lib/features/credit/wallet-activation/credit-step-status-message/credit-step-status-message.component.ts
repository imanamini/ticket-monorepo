import { ChangeDetectionStrategy, Component, input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CreditDigipayImageComponent } from '../../components/credit-digipay-image/credit-digipay-image.component';

export type CreditStepStatusImage = 'no-service' | 'error' | 'expired';

@Component({
  selector: 'app-credit-step-status-message',
  templateUrl: './credit-step-status-message.component.html',
  styleUrls: ['./credit-step-status-message.component.scss'],
  imports: [NgTemplateOutlet, CreditDigipayImageComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditStepStatusMessageComponent {
  imageId = input<any>();
  staticImage = input<CreditStepStatusImage>();
  title = input<any>();
  message = input<any>();
  errors = input<TemplateRef<any>>();
}

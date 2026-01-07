import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BnplUsageComponent } from '../../../../../static-landings/landing-onboarding/bnpl-usage/bnpl-usage.component';
import { data } from 'autoprefixer';
import {
  bnplUsage
} from '../../../../../../../api/clients/models/templates/bnpl-onboarding/bnpl-onboarding-template-data';

@Component({
  selector: 'app-credit-usage-section',
  standalone: true,
  imports: [CommonModule, BnplUsageComponent],
  templateUrl: './credit-usage-section.component.html',
  styleUrl: './credit-usage-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditUsageSectionComponent {
  data = input<bnplUsage>();
}

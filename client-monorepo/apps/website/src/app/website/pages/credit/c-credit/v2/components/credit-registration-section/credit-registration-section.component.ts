import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  SectionValueProposition
} from '../../../../../../../api/clients/models/templates/c-credit/c-credit-v2-template-data';

@Component({
  selector: 'app-credit-registration-section',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './credit-registration-section.component.html',
  styleUrl: './credit-registration-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditRegistrationSectionComponent {
  data = input.required<SectionValueProposition>();
}

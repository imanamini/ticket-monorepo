import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IGuidStep } from '../../models/credit-guids-step.interface';

@Component({
  selector: 'wealth-applet-credit-guid-steper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './credit-guid-steper.component.html',
  styleUrl: './credit-guid-steper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGuidSteperComponent {
  steps = input.required<IGuidStep[]>();
  headerImage = input.required<string>();
  headerAlt = input.required<string>();
}

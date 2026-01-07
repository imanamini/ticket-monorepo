import { Component, input } from '@angular/core';
import { LandingElementIconCardStepsPayload } from '../../data/models/landing-element';

@Component({
  selector: 'ui-landing-element-icon-card-steps',
  templateUrl: './landing-element-icon-card-steps.component.html',
  standalone: true,
  styleUrls: ['./landing-element-icon-card-steps.component.scss'],
})
export class LandingElementIconCardStepsComponent {
  payload = input<LandingElementIconCardStepsPayload>();
}

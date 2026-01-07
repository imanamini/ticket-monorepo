import { Component, input } from '@angular/core';
import { LandingElementTextCardStepsPayload } from '../../data/models/landing-element';

@Component({
  selector: 'ui-landing-element-text-card-steps',
  templateUrl: './landing-element-text-card-steps.component.html',
  standalone: true,
  styleUrls: ['./landing-element-text-card-steps.component.scss'],
})
export class LandingElementTextCardStepsComponent {
  payload = input<LandingElementTextCardStepsPayload>();
}

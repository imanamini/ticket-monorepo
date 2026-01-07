import { Component, input } from '@angular/core';
import { LandingElementTextCardPayload } from '../../data/models/landing-element';

@Component({
  selector: 'ui-landing-element-text-card',
  templateUrl: './landing-element-text-card.component.html',
  styleUrls: ['./landing-element-text-card.component.scss'],
  standalone: true,
})
export class LandingElementTextCardComponent {
  payload = input<LandingElementTextCardPayload | undefined>();
}

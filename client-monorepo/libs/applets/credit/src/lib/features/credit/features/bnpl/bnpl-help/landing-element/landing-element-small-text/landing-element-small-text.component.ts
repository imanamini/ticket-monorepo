import { Component, input } from '@angular/core';
import { LandingElementSmallTextPayload } from '../../data/models/landing-element';

@Component({
  selector: 'ui-landing-element-small-text',
  templateUrl: './landing-element-small-text.component.html',
  styleUrls: ['./landing-element-small-text.component.scss'],
  standalone: true,
})
export class LandingElementSmallTextComponent {
  payload = input<LandingElementSmallTextPayload>();
}

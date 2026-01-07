import { Component, input } from '@angular/core';
import { LandingElementImagePayload } from '../../data/models/landing-element';

@Component({
  selector: 'ui-landing-element-image',
  templateUrl: './landing-element-image.component.html',
  styleUrls: ['./landing-element-image.component.scss'],
  standalone: true,
})
export class LandingElementImageComponent {
  payload = input<LandingElementImagePayload | undefined>();
}

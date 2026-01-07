import { Component, input } from '@angular/core';
import { LandingElementAlertBoxPayload } from '../../data/models/landing-element';

@Component({
  selector: 'ui-landing-element-alert-box',
  templateUrl: './landing-element-alert-box.component.html',
  standalone: true,
  styleUrls: ['./landing-element-alert-box.component.scss'],
})
export class LandingElementAlertBoxComponent {
  payload = input<LandingElementAlertBoxPayload | undefined>();
}

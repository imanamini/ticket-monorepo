import { Component, Input } from '@angular/core';
import { LandingElementAlertBoxPayload } from '../../../../../api/clients/models/templates/c-bnpl/landing-element';

@Component({
  selector: 'app-ui-landing-element-alert-box',
  templateUrl: './landing-element-alert-box.component.html',
  styleUrls: ['./landing-element-alert-box.component.scss'],
  standalone: true,
})
export class LandingElementAlertBoxComponent {
  @Input()
  payload: LandingElementAlertBoxPayload;
}

import { Component, Input } from '@angular/core';
import { LandingElementAlertBoxExtendedPayload } from '../../../../../api/clients/models/templates/c-bnpl/landing-element';

@Component({
  selector: 'app-ui-landing-element-alert-box-extended',
  templateUrl: './landing-element-alert-box-extended.component.html',
  styleUrls: ['./landing-element-alert-box-extended.component.scss'],
  standalone: true,
})
export class LandingElementAlertBoxExtendedComponent {
  @Input()
  payload!: LandingElementAlertBoxExtendedPayload;
}

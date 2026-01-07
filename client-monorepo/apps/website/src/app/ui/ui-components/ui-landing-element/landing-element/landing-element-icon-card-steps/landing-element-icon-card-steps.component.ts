import { Component, Input } from '@angular/core';
import { LandingElementIconCardStepsPayload } from '../../../../../api/clients/models/templates/c-bnpl/landing-element';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-ui-landing-element-icon-card-steps',
  templateUrl: './landing-element-icon-card-steps.component.html',
  styleUrls: ['./landing-element-icon-card-steps.component.scss'],
  standalone: true,
  imports: [NgFor],
})
export class LandingElementIconCardStepsComponent {
  @Input()
  payload: LandingElementIconCardStepsPayload;
}

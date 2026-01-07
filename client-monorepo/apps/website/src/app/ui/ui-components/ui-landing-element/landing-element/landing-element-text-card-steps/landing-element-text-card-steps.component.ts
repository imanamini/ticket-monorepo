import { Component, Input } from '@angular/core';
import { LandingElementTextCardStepsPayload } from '../../../../../api/clients/models/templates/c-bnpl/landing-element';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-ui-landing-element-text-card-steps',
  templateUrl: './landing-element-text-card-steps.component.html',
  styleUrls: ['./landing-element-text-card-steps.component.scss'],
  standalone: true,
  imports: [NgFor],
})
export class LandingElementTextCardStepsComponent {
  @Input()
  payload: LandingElementTextCardStepsPayload;
}

import { Component, Input } from '@angular/core';
import { LandingElementTextCardPayload } from '../../../../../api/clients/models/templates/c-bnpl/landing-element';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ui-landing-element-text-card',
  templateUrl: './landing-element-text-card.component.html',
  styleUrls: ['./landing-element-text-card.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class LandingElementTextCardComponent {
  @Input()
  payload: LandingElementTextCardPayload;
}

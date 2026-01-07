import { Component, input } from '@angular/core';
import { LandingElementLinkCardsPayload } from '../../data/models/landing-element';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'ui-landing-element-link-cards',
  templateUrl: './landing-element-link-cards.component.html',
  standalone: true,
  styleUrls: ['./landing-element-link-cards.component.scss'],
  imports: [NgForOf],
})
export class LandingElementLinkCardsComponent {
  payload = input<LandingElementLinkCardsPayload>();
}

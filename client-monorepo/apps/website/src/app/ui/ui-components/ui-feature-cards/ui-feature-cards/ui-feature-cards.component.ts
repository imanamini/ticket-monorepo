import { Component, Input } from '@angular/core';
import { FeatureCards } from '../../../../api/clients/models/templates/ipg/feature-cards';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-ui-feature-cards',
  templateUrl: './ui-feature-cards.component.html',
  styleUrls: ['./ui-feature-cards.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor],
})
export class UiFeatureCardsComponent {
  @Input() features!: FeatureCards[];
}

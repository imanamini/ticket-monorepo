import { Component, Input } from '@angular/core';
import { FeatureCards } from '../../../../api/clients/models/templates/ipg/feature-cards';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-ui-value-simple',
  templateUrl: './ui-value-simple.component.html',
  styleUrls: ['./ui-value-simple.component.scss'],
  standalone: true,
  imports: [NgFor, NgIf],
})
export class UiValueSimpleComponent {
  @Input()
  features: FeatureCards[] | undefined;
}

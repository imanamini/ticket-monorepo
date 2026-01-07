import { Component, Input } from '@angular/core';
import { FeatureCards } from '../../../../api/clients/models/templates/ipg/feature-cards';
import { UiValueSimpleComponent } from '../../../../ui/ui-components/ui-value-cards/ui-value-simple/ui-value-simple.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-card-to-card-value',
  templateUrl: './card-to-card-value.component.html',
  styleUrls: ['./card-to-card-value.component.scss'],
  standalone: true,
  imports: [NgIf, UiValueSimpleComponent],
})
export class CardToCardValueComponent {
  @Input()
  title = '';

  @Input()
  subtitle = '';

  @Input()
  features: FeatureCards[] | undefined;
}

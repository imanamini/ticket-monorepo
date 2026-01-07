import { Component, Input } from '@angular/core';
import { FeatureCards } from '../../../../../../api/clients/models/templates/ipg/feature-cards';
import { UiValueSimpleComponent } from '../../../../../../ui/ui-components/ui-value-cards/ui-value-simple/ui-value-simple.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-isiran-value',
  templateUrl: './isiran-value.component.html',
  styleUrls: ['./isiran-value.component.scss'],
  standalone: true,
  imports: [NgIf, UiValueSimpleComponent],
})
export class IsiranValueComponent {
  @Input()
  title = '';

  @Input()
  subtitle = '';

  @Input()
  features!: FeatureCards[];
}

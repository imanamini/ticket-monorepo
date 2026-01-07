import {ChangeDetectionStrategy, Component, input, signal} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {sectionValue} from "../../../../../api/clients/models/templates/careers/careers-template-date";

@Component({
  selector: 'app-organization-values',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './organizationValues.component.html',
  styleUrl: './organizationValues.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationValuesComponent {

  organizationValue = input<sectionValue>();

  colorList = signal(['#ef7e241a', '#fbc0101a', '#57b4671a', '#774f9b1a', '#55c4f01a']);
  widthList = signal(['320px', '320px', '320px', '386px', '386px']);

}

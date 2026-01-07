import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {benefitsSection} from "../../../../../api/clients/models/templates/careers/careers-template-date";

@Component({
  selector: 'app-digipay-benefit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './digipay-benefit.component.html',
  styleUrl: './digipay-benefit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DigipayBenefitComponent {

  benefit = input<benefitsSection>();

}

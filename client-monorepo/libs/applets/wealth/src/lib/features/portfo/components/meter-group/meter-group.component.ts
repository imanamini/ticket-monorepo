import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { IMeter } from '../../models/meter.interface';

@Component({
  selector: 'app-meter-group',
  standalone: true,
  templateUrl: './meter-group.component.html',
  styleUrl: './meter-group.component.scss',
  imports: [DecimalPipe, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeterGroupComponent {
  meters = input<IMeter[]>();
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconEnum } from '../../../../data-access/enums/icon.enum';
import { InsIconComponent } from '../ins-icon/ins-icon.component';

@Component({
  selector: 'rate',
  standalone: true,
  imports: [
    InsIconComponent
  ],
  templateUrl: './rate.component.html',
  styleUrl: './rate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RateComponent {
  rate = input.required<number>();
  protected readonly IconEnum = IconEnum;
}

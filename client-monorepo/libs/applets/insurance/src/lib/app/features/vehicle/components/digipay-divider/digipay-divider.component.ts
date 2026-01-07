import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InsIconComponent } from '../ins-icon/ins-icon.component';
import { IconEnum } from '../../../../data-access/enums/icon.enum';

@Component({
  selector: 'digipay-divider',
  standalone: true,
  imports: [
    InsIconComponent
  ],
  templateUrl: './digipay-divider.component.html',
  styleUrl: './digipay-divider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DigipayDividerComponent {

  protected readonly IconEnum = IconEnum;
}

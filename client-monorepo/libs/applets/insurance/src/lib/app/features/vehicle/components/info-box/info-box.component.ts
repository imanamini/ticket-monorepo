import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { InsIconComponent } from '../ins-icon/ins-icon.component';
import { IconEnum } from '../../../../data-access/enums/icon.enum';
import { NgStyle } from '@angular/common';

type textColor = 'blue';

@Component({
  selector: 'info-box',
  standalone: true,
  imports: [
    InsIconComponent,
    NgStyle
  ],
  templateUrl: './info-box.component.html',
  styleUrl: './info-box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoBoxComponent {
  icon = input<{
    name: IconEnum;
    width: number;
    height: number
  }>();
  message = input.required<string>();
  textColor = input<textColor>();

  protected readonly IconEnum = IconEnum;
}

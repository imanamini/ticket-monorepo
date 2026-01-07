import { Component, input, InputSignal } from '@angular/core';
import { IconEnum } from '../../../../../../../../data-access/enums/icon.enum';
import { InsIconComponent } from '../../../../../../components/ins-icon/ins-icon.component';

@Component({
  selector: 'ins-checkbox',
  standalone: true,
  imports: [
    InsIconComponent
  ],
  templateUrl: './ins-checkbox.component.html',
  styleUrl: './ins-checkbox.component.scss'
})
export class InsCheckboxComponent {

  protected readonly IconEnum = IconEnum;

  isActive: InputSignal<boolean> = input(false);
}

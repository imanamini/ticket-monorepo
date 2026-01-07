import { Component, effect, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

import { InsRadioButtonItemModel } from '../../data-access/models/ins-radio-button-item.model';
import { InsRadioButtonType } from '../../data-access/enums/ins-radio-button-type.enum';
import { InsIconComponent } from '../ins-icon/ins-icon.component';
import { IconEnum } from '../../../../data-access/enums/icon.enum';

@Component({
  selector: 'ins-radio-button',
  standalone: true,
  imports: [
    InsIconComponent,
    NgClass
  ],
  templateUrl: './ins-radio-button.component.html',
  styleUrl: './ins-radio-button.component.scss'
})
export class InsRadioButtonComponent {

  constructor() {
  }

  items = input.required<InsRadioButtonItemModel[]>();
  value = input<number>();
  type = input<InsRadioButtonType>(InsRadioButtonType.Seperated);
  valueChange = output<number>();
  showError = input<boolean>();

  readonly InsRadioButtonType = InsRadioButtonType;
  protected readonly IconEnum = IconEnum;

  handleClickOnItem(e: number): void {
    this.valueChange.emit(e);
  }
}

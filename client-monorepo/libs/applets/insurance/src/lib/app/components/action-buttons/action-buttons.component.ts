import { Component, input, OnInit, output } from '@angular/core';
import { NgClass } from '@angular/common';

import { BaseComponent } from '../base/base.component';
import { InsButtonComponent } from '../ins-button/ins-button.component';
import { InsButtonStyleEnum } from '../../data-access/enums/ins-button-style.enum';
import { InsButtonModeEnum } from '../../data-access/enums/ins-button-mode.enum';
import { InsButtonSizeEnum } from '../../data-access/enums/ins-button-size.enum';

@Component({
  selector: 'action-buttons',
  standalone: true,
  imports: [
    InsButtonComponent,
    NgClass,
  ],
  templateUrl: './action-buttons.component.html',
  styleUrl: './action-buttons.component.scss',
})
export class ActionButtonsComponent extends BaseComponent {
  showDeActiveButton = input<boolean>(true);
  activeButtonText = input<string>('تایید و ادامه');
  deActiveButtonText = input<string>('مرحله قبل');
  backgroundMode = input<'transparent' | 'gray'>();
  activeButtonBackground = input<InsButtonStyleEnum>(InsButtonStyleEnum.Brand);
  activeButtonLoading = input<boolean>(false);
  activeButtonClicked = output<Event>();
  deActiveButtonClicked = output<Event>();
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly InsButtonModeEnum = InsButtonModeEnum;
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;

  constructor() {
    super();
  }

  handleActiveButtonClicked(e: Event): void {
    this.activeButtonClicked.emit(e);
  }

  handleDeActiveButtonClicked(e: Event): void {
    this.deActiveButtonClicked.emit(e);
  }

}

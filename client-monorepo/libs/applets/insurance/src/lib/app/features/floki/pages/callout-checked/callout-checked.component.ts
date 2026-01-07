import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { CalloutModel } from '../../models/callout.model';
import { CalloutModeEnum } from './models/callout-mode.enum';

@Component({
  selector: 'callout-checked',
  standalone: true,
  templateUrl: './callout-checked.component.html',
  styleUrl: './callout-checked.component.scss'
})
export class CalloutCheckedComponent {
  messages = input<CalloutModel[]>([]);
  mode = input<CalloutModeEnum>(CalloutModeEnum.CHECKED);
  protected readonly CalloutModeEnum = CalloutModeEnum;
  protected readonly input = input;
}

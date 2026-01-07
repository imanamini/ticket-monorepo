import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SimType } from '../../../../api/digipay/models/common/sim-type';
import { StyledSwitchOption } from '../../../models/switch-option.model';
import { UiOption } from '../../../models/ui-option';
import { UiAnimatedSwitchComponent } from '../../ui-switch/ui-animated-switch/ui-animated-switch.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ui-sim-type-switch',
  templateUrl: './ui-sim-type-switch.component.html',
  styleUrls: ['./ui-sim-type-switch.component.scss'],
  standalone: true,
  imports: [NgIf, UiAnimatedSwitchComponent],
})
export class UiSimTypeSwitchComponent implements OnChanges {
  options: StyledSwitchOption[] = [
    { label: 'اعتباری', value: SimType.CREDIT },
    { label: 'دائمی', value: SimType.PERMANENT },
    { label: 'TD-LTE', value: SimType.TD_LTE },
  ];

  @Input()
  simCards: UiOption[] = [
    { label: 'اعتباری', value: SimType.CREDIT },
    { label: 'دائمی', value: SimType.PERMANENT },
  ];

  @Input()
  value: SimType;

  @Output()
  changed = new EventEmitter<SimType>();

  selectedOption: StyledSwitchOption;

  @ViewChild(UiAnimatedSwitchComponent) child: UiAnimatedSwitchComponent;

  uiAnimatedSwitchWindowResize() {
    this.child.windowResizeCallback();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value && changes.value.currentValue) {
      const o = this.options.filter((op) => op.value === this.value);
      if (o.length > 0) {
        this.selectedOption = o[0];
      }
    }
  }

  onChange(option: StyledSwitchOption): void {
    this.selectedOption = option;
    this.changed.emit(option.value);
  }
}

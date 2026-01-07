import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { numberToString } from '../../../../../utils/number-to-string';

@Component({
  selector: 'app-select-amount-slider',
  templateUrl: './select-amount-slider.component.html',
  styleUrls: ['./select-amount-slider.component.scss']
})
export class SelectAmountSliderComponent implements OnInit, OnChanges {

  @Input() min: number = 0;
  @Input() max: number = 0;
  @Input() step: number = 1;
  @Input() value: number = 0;
  @Output() valueChange = new EventEmitter<number>();
  options: Options = {};

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.min || changes.max || changes.step) {
      this.options = {
        floor: this.min,
        ceil: this.max,
        step: this.step,
        showSelectionBar: true,
        hideLimitLabels: true,
        translate: (value: number): string => {
          return '<b>' + numberToString(value) + ' ریال' + '</b>';
        },
      };
    }
  }
}

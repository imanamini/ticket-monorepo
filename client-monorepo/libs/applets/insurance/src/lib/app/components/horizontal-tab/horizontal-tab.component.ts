import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { HorizontalStepModel } from './models/horizontal-tab.model';
import { NgFor } from '@angular/common';
import { UiHorizontalSwiperComponent } from '../ui-horizontal-swiper/ui-horizontal-swiper.component';

@Component({
  selector: 'horizontal-tab',
  templateUrl: './horizontal-tab.component.html',
  styleUrls: ['./horizontal-tab.component.scss'],
  standalone: true,
  imports: [UiHorizontalSwiperComponent, NgFor]
})
export class HorizontalTabComponent implements OnChanges {

  @Input()
  currentStepIndex = 0;

  @Input()
  minimumTabSize = 150;

  @Input()
  steps: HorizontalStepModel[];

  @Output()
  changeStep = new EventEmitter();

  widthPerStep = 300;

  minimumButtonBarSize: number;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.minimumButtonBarSize = this.minimumTabSize * 2;
    this.getButtonBarWidth();
  }

  changeStepCall(index): void {
    this.currentStepIndex = index;
    this.changeStep.emit(index);
  }

  getButtonBarWidth(): void {
    const buttonWidth = document.getElementById('button-bar-horizontal-tab').getBoundingClientRect().width;
    if (buttonWidth > this.minimumButtonBarSize) {
      this.widthPerStep = buttonWidth / 2;
    }
  }
}

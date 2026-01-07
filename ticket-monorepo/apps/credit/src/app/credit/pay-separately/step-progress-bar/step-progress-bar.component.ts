import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PayStep } from '../services/pay-step.interface';

@Component({
  selector: 'app-step-progress-bar',
  templateUrl: './step-progress-bar.component.html',
  styleUrls: ['./step-progress-bar.component.scss']
})
export class StepProgressBarComponent implements OnInit, OnChanges {

  @Input() steps: PayStep[];
  stepWidth: string[] = [];
  minWidth = 5;

  constructor() { }

  ngOnInit() {
    this.setWidth();
  }

  setWidth() {
    setTimeout(() => {
      let total = 0;
      const sharedPartOfProgressBar = 100 - (this.minWidth * this.steps.length);
      this.steps.forEach(step => {
        total += step.amount;
      });
      this.steps.forEach(step => {
        const stepShare = (step.amount / total);
        this.stepWidth.push((this.minWidth + this.floor2Decimal(sharedPartOfProgressBar * stepShare)) + '%');
      });
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.steps && !changes.steps.firstChange) {
      this.setWidth();
    }
  }

  floor2Decimal(input: number): number {
    return Math.floor(input * 100) / 100;
  }
}

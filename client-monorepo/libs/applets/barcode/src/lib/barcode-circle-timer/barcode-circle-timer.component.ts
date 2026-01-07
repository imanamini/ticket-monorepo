import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-circle-timer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="circle"
      [style.width.px]="size"
      [style.height.px]="size"
      [style.background]="bg"
      aria-hidden="true"
    ></div>
  `,
  styles: [`
    :host { display: inline-block; }
    .circle {
      border-radius: 50%;
    }
  `]
})
export class CircleTimerComponent implements OnChanges {
  @Input() totalTime = 60;     
  @Input() timeLeft = 60;       
  @Input() size = 160;          
  @Input() fillColor = '#3b82f6';
  @Input() trackColor = '#e5e7eb';

  bg = '';

  ngOnChanges() {
    const progress = Math.max(0, Math.min(1, this.timeLeft / Math.max(1, this.totalTime)));
    const deg = progress * 360;
    this.bg = `conic-gradient(${this.fillColor} ${deg}deg, ${this.trackColor} 0deg)`;
  }
}

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'profile-applet-circle-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './circle-progress-bar.component.html',
  styleUrl: './circle-progress-bar.component.scss',
})
export class CircleProgressBarComponent implements OnChanges {
  @Input() progressColor = '#9a0fe0';
  @Input() size = 114; // Default size
  @Input() progress = 0; // Default progress

  strokeDasharray!: number;
  strokeDashoffset!: number;
  radius!: number;
  cx!: number;
  cy!: number;

  ngOnChanges(changes: SimpleChanges) {
    this.updateValues();
  }

  private updateValues() {
    this.radius = (this.size - 10) / 2;
    this.cx = this.size / 2;
    this.cy = this.size / 2;
    this.strokeDasharray = 2 * Math.PI * this.radius;
    this.strokeDashoffset = this.strokeDasharray - (this.progress / 100) * this.strokeDasharray;
  }
}

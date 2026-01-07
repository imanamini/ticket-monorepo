import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ProgressBarModel } from '@client-monorepo/common/subscription';

@Component({
  selector: 'subscription-applet-progress-bar',
  standalone: true,
  imports: [],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss',
})
export class ProgressBarComponent implements OnInit, OnChanges {
  @Input() progressData!: ProgressBarModel;

  progress = 0;
  used = 0;
  total = 0;
  progressColor!: string;

  ngOnInit() {
    this.progressColor = this.progressData.defaultColor;
    this.updateProgress();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['progressData']) {
      this.updateProgress();
    }
  }

  updateProgress() {
    this.used = this.progressData.used;
    this.total = this.progressData.total;
    this.progress = this.calculateProgress(this.used, this.total);
    this.progressColor = this.calculateProgressColor();
  }

  calculateProgressColor(): string {
    const range = this.progressData.colorRange.find((range) => this.progress < range.limit);
    return range ? range.color : this.progressData.defaultColor;
  }

  calculateProgress(used: number, total: number): number {
    return (used / total) * 100;
  }
}

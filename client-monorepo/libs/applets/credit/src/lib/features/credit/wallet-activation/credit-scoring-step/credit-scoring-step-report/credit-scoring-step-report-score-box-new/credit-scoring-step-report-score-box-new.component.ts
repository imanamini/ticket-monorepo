import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CreditReportSpectrum, CreditReportSummary } from '../../../../data-access/models/credit-scoring/credit-report-response';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';

@Component({
  selector: 'ui-cs-score-box-new',
  templateUrl: './credit-scoring-step-report-score-box-new.component.html',
  standalone: true,
  styleUrls: ['./credit-scoring-step-report-score-box-new.component.scss'],
  imports: [PipesModule, NgxButtonComponent, NgxTrackableIdDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoringStepReportScoreBoxNewComponent {
  radius = 100;
  strokeWidth = 12;
  circleStrokeWidth = 4;
  startAngle = 180;
  endAngle = 360;
  gapSize = 6;
  centerX: number = this.radius + this.strokeWidth;
  centerY: number = this.radius + this.strokeWidth;

  summary = input<CreditReportSummary>();

  spectrum = computed<CreditReportSpectrum | null>(() => {
    const summary = this.summary();
    const spectrum = summary?.spectrum;
    if (spectrum) {
      for (const s of spectrum) {
        if (s.min <= summary.score && summary.score <= s.max) {
          return s;
        }
      }
    }
    return null;
  });

  min = computed(() => this.summary()?.spectrum[0].min);
  max = computed(() => this.summary()?.spectrum[this.summary()!.spectrum.length - 1].max);
  value = computed(() => this.summary()?.score);
  valueRadiant = computed(() => {
    const valuePercentage = (this.value()! - this.min()!) / (this.max()! - this.min()!);
    const valueAngle = this.startAngle + valuePercentage * (this.endAngle - this.startAngle);
    return (valueAngle * Math.PI) / 180;
  });
  valueX = computed(() => this.centerX + this.radius * Math.cos(this.valueRadiant()));
  valueY = computed(() => this.centerY + this.radius * Math.sin(this.valueRadiant()));
  segments = computed(() =>
    this.summary()?.spectrum.map((item) => {
      return {
        color: item.color,
        percentage: (item.max - item.min) / this.max()!,
      };
    }),
  );

  clicked = output<void>();

  getCurrentPercentage(index: number): number {
    let total = 0;
    for (let i = 0; i < index; i++) {
      total += this.segments()![i].percentage || 0;
    }
    return total;
  }

  generateArc(startPercentage: number, endPercentage: number): string {
    const totalAngleRange = this.endAngle - this.startAngle;

    const start = this.startAngle + startPercentage * totalAngleRange + this.gapSize;
    const end = this.startAngle + endPercentage * totalAngleRange - this.gapSize;

    const startRadian = (start * Math.PI) / 180;
    const endRadian = (end * Math.PI) / 180;

    const x1 = this.centerX + this.radius * Math.cos(startRadian);
    const y1 = this.centerY + this.radius * Math.sin(startRadian);
    const x2 = this.centerX + this.radius * Math.cos(endRadian);
    const y2 = this.centerY + this.radius * Math.sin(endRadian);

    const largeArcFlag = end - start <= 180 ? '0' : '1';

    return `M ${x1} ${y1} A ${this.radius} ${this.radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  }
}

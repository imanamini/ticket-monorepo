import { ChangeDetectionStrategy, Component, ElementRef, input, OnInit, output, signal, viewChild } from '@angular/core';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';

@Component({
  selector: 'app-credit-smart-scoring-step-result-chart',
  templateUrl: './credit-smart-scoring-step-result-chart.component.html',
  standalone: true,
  styleUrls: ['./credit-smart-scoring-step-result-chart.component.scss'],
  imports: [PipesModule, NgxButtonComponent, NgxTrackableIdDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSmartScoringStepResultChartComponent implements OnInit {
  semicLen = 0;
  minProgressValue = 0;
  maxProgressValue = 200;

  value = input(0);
  expirationDate = input<number>();
  width = input(212);
  height = input(144);
  radius = input(144);
  strokeWidth = input(16);
  labelFontSize = input(48);

  pathD = signal('');

  progressPath = viewChild<ElementRef<SVGPathElement>>('progressPath');
  labelText = viewChild<ElementRef<SVGTextElement>>('labelText');
  svgEl = viewChild<ElementRef<SVGSVGElement>>('svgEl');

  report = output<void>();

  ngOnInit(): void {
    this.setupPath();
    this.updateProgress(this.value() / 10);
  }

  private setupPath() {
    const w = Math.max(0, Number(this.width()) || 0);
    const h = Math.max(0, Number(this.height()) || 0);
    const stroke = Math.max(0, Number(this.strokeWidth()) || 0);

    if (this.svgEl && this.svgEl()?.nativeElement) {
      this.svgEl()!.nativeElement.setAttribute('viewBox', `0 0 ${w} ${h}`);
    }

    const halfStroke = stroke / 2;
    const availableWidth = Math.max(0, w - 2 * halfStroke);
    const maxRadiusByWidth = availableWidth / 2;
    const prefR = Math.max(0, Number(this.radius()) || 0);
    let r = Math.min(prefR || maxRadiusByWidth, maxRadiusByWidth);
    let cy = h / 2;
    if (cy < r + halfStroke) {
      cy = r + halfStroke;
    }
    const maxRByHeight = Math.max(0, h - stroke);
    if (r > maxRByHeight) {
      r = maxRByHeight;
    }

    cy = Math.max(cy, r + halfStroke);
    cy = Math.min(cy, h - halfStroke);

    const cx = w / 2;
    const x1 = cx - r;
    const x2 = cx + r;
    const y = cy;
    this.pathD.set(`M ${x1} ${y} A ${r} ${r} 0 0 1 ${x2} ${y}`);
    this.semicLen = Math.PI * r;
    if (this.progressPath() && this.progressPath()!.nativeElement) {
      const el = this.progressPath()!.nativeElement;
      el.setAttribute('d', this.pathD());
      el.setAttribute('stroke-width', `${stroke}`);
      el.setAttribute('stroke-dasharray', `0 ${this.semicLen}`);
      el.setAttribute('stroke-linecap', 'round');
    }
  }

  private updateProgress(percent: number) {
    if (!this.progressPath() || !this.progressPath()?.nativeElement) return;
    if (!this.labelText() || !this.labelText()?.nativeElement) return;

    let p = Number(percent);
    if (isNaN(p)) p = 0;
    if (p < 0) p = 0;
    if (p > this.maxProgressValue) p = this.maxProgressValue;

    const dash = (p / this.maxProgressValue) * this.semicLen;
    this.progressPath()!.nativeElement.setAttribute('stroke-dasharray', `${dash} ${this.semicLen}`);
    this.labelText()!.nativeElement.textContent = Math.round(p).toString();
  }
}

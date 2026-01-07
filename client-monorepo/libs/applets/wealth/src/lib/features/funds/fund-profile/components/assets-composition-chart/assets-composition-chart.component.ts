import { ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';
import { DonutChartComponent } from '../../../../../shared/components/donut-chart/donut-chart.component';
import { IFundPortfolioChart, IFundPortfolioGoldChart } from '../../../models/fund-chart.model';
import { FundsType } from 'libs/applets/wealth/src/lib/components/core/models/fund-schemas/types';

@Component({
  selector: 'app-assets-composition-chart',
  standalone: true,
  imports: [DonutChartComponent],
  templateUrl: './assets-composition-chart.component.html',
  styleUrl: './assets-composition-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsCompositionChartComponent implements OnInit {
  data = input<IFundPortfolioChart & Partial<IFundPortfolioGoldChart>>();
  type = input<FundsType>();
  labels = signal<string[]>([]);
  chartData = signal<number[]>([]);
  preferredColors = signal<string[]>([]);

  ngOnInit(): void {
    for (const [key, value] of Object.entries(this.data())) {
      if (key !== 'date' && value) {
        this.labels().push(key);
        this.chartData().push(value);
      }
    }
    this.type() === 'Gold' ? this.preferredColors.set(['#ff981a', '#fbc972']) : null;
  }
}

import { ChangeDetectionStrategy, Component, input, OnInit, signal } from '@angular/core';
import { IFundChart } from '../../../models/fund-chart.model';
import { AreaChartComponent } from '../../../../../shared/components/area-chart/area-chart.component';

@Component({
  selector: 'app-nav-chart',
  standalone: true,
  imports: [AreaChartComponent],
  templateUrl: './nav-chart.component.html',
  styleUrl: './nav-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavChartComponent implements OnInit {
  data = input<IFundChart[]>();
  finalPrice = input<boolean>();
  statisticLabel? = signal<string>('آماری');
  selectedPeriod? = signal<string>('sixMonth');
  labels = signal<string[]>([]);
  chartData = signal<IFundChart[]>([]);

  ngOnInit(): void {
    this.data().forEach((item) => {
      this.labels().push(item.date);
      const chartItems = this.finalPrice
        ? { statisticalNav: item.statisticalNav }
        : {
            issueNav: item.issueNav,
            cancelNav: item.cancelNav,
            statisticalNav: item.statisticalNav,
          };
      this.chartData().push(chartItems);
    });
  }
}

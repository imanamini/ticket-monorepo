import { Component, Input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import moment from 'jalali-moment';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-area-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './area-chart.component.html',
  styleUrl: './area-chart.component.scss',
})
export class AreaChartComponent {
  @Input() data = [];
  @Input() labels: string[];
  @Input() statisticLabel? = 'آماری';
  @Input() selectedPeriod? = 'sixMonth';
  chartLabels: string[] = [];
  doughnutChartDatasets = [];
  dataSets = { issueNav: {}, cancelNav: {}, statisticNav: {} };

  doughnutChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'yekan-bakh, "Courier New", Courier, monospace',
          },
          autoSkip: false,
        },
      },
      y: {
        grid: {
          display: false,
        },

        ticks: {
          font: {
            family: 'yekan-bakh, "Courier New", Courier, monospace',
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        rtl: true,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          boxHeight: 8,
        },
      },
    },
  };

  ngOnInit(): void {
    this.dataSets = {
      issueNav: {
        label: 'خرید',
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: 'origin',
        lineTension: 1,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
      cancelNav: {
        label: 'فروش',
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: 'origin',
        lineTension: 1,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
      statisticNav: {
        label: this.statisticLabel,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: 'origin',
        lineTension: 1,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
    };
    this.paintChart(this.selectedPeriod);
  }

  paintChart(period: string) {
    this.doughnutChartDatasets = [];
    const days = this.getDays(period);
    let lastDate = moment(new Date(this.labels[0])).locale('fa').date();
    if (lastDate > 29) lastDate = 29;
    const dataInPeriod = this.data.slice(0, days).reverse();
    const timePeriod = this.labels.slice(0, days).reverse();

    if (period === 'month') {
      this.doughnutChartOptions.scales['x'].ticks.autoSkip = true;
      this.doughnutChartOptions.scales['x'].ticks.callback = (value: any, index: number) => {
        return moment(new Date(timePeriod[index])).locale('fa').format('jD jMMMM');
      };
    } else {
      this.doughnutChartOptions.scales['x'].ticks.autoSkip = false;
      this.doughnutChartOptions.scales['x'].ticks.callback = (value: any, index: number) => {
        const dateLabel = timePeriod[index];
        const dayOfMonth = moment(new Date(dateLabel)).locale('fa').date();
        return dayOfMonth === lastDate || (period === 'year' && lastDate === 29 && index === 0)
          ? moment(new Date(dateLabel)).locale('fa').format('jD jMMMM')
          : '';
      };
    }
    const chartData = { issueNav: [], cancelNav: [], statisticNav: [] };
    this.chartLabels = timePeriod.map((label) => {
      return moment(new Date(label)).locale('fa').format('jD jMMMM');
    });
    dataInPeriod.forEach((d) => {
      if (d.issueNav) chartData.issueNav.push(d.issueNav);
      if (d.cancelNav) chartData.cancelNav.push(d.cancelNav);
      if (d.statisticalNav) chartData.statisticNav.push(d.statisticalNav);
    });

    Object.entries(chartData).forEach((data) => {
      if (data[1].length)
        this.doughnutChartDatasets.push({
          ...this.dataSets[data[0]],
          data: data[1],
        });
    });
  }

  getDays(period: string) {
    this.selectedPeriod = period;
    let days = 32;
    switch (period) {
      case 'sixMonth':
        days = 190;
        break;
      case 'year':
        days = 366;
        break;

      default:
        days = 32;
        break;
    }
    return days;
  }
}

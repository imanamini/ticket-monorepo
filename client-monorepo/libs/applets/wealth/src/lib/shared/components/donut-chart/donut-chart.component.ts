import { Component, input, Input, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.scss',
})
export class DonutChartComponent implements OnInit {
  @Input() data: number[];
  @Input() labels: string[];
  @Input() preferredColors: string[];

  fullWidth = input<boolean>(false);
  chartWidth = input<number>(300);
  chartCutout = input<number>(72);
  doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [];

  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: false,
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          font: {
            family: 'yekan-bakh, "Courier New", Courier, monospace',
          },
        },
        rtl: true,
      },
      tooltip: {
        enabled: false,
      },
    },
    animation: true,
    layout: {
      padding: {
        top: 10,
      },
    },
  };

  ngOnInit(): void {
    this.labels = this.labels?.map((label) => {
      const l = 'CHART_' + label.toUpperCase();
      switch (l) {
        case 'CHART_BOND':
          return 'اوراق مشارکت';
        case 'CHART_CASH':
          return 'وجه نقد';
        case 'CHART_COMMODITY':
          return 'گواهی سپرده کالایی';
        case 'CHART_DEPOSIT':
          return 'سپرده بانکی';
        case 'CHART_FIVEBEST':
          return 'پنج سهم با بیشترین وزن';
        case 'CHART_FUNDUNIT':
          return 'واحد صندوق';
        case 'CHART_OTHER':
          return 'سایر دارایی‌ها';
        case 'CHART_STOCK':
          return 'سایر سهام';
        case 'CHART_GOLDBAR':
          return 'شمش';
        case 'CHART_GOLDCOIN':
          return 'سکه';
      }

      return label.toUpperCase();
    });
    this.doughnutChartDatasets = [
      {
        data: this.data,
        label: '',
        borderRadius: 22,
        borderWidth: 0,
        borderJoinStyle: 'round',
        clip: 100,
        backgroundColor: this.preferredColors,
        circular: true,
        hoverOffset: 0,
        hoverBorderWidth: 0,
        borderColor: '#FF0000', //TODO: remove this after fixing chart border issue
        offset: 0,
        spacing: 1,
      },
    ];
    this.doughnutChartOptions.cutout = this.chartCutout();
  }
}

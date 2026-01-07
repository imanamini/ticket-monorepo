import { ArcElement, Chart, ChartData, ChartOptions, DoughnutController, Legend, Tooltip } from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);
export abstract class DonutChartConfig {
  static setData(labels: Array<string>, dataset: Array<number>, backgroundColors: Array<string>): ChartData<'doughnut'> {
    return {
      labels,
      datasets: [{ data: dataset, backgroundColor: backgroundColors }],
    };
  }

  static setOptions(): ChartOptions<'doughnut'> {
    return {
      aspectRatio: 1,
      cutout: '85%',
      responsive: true,
      plugins: {
        tooltip: {
          bodyFont: {
            family: 'yekan-bakh',
          },
          titleFont: {
            family: 'yekan-bakh',
          },
          backgroundColor: 'rgba(0,0,0,1)',
          xAlign: 'right',
          titleAlign: 'right',
          bodyAlign: 'left',
          padding: 10,
          displayColors: false,
        },
        legend: {
          display: false,
        },
      },
    };
  }
}

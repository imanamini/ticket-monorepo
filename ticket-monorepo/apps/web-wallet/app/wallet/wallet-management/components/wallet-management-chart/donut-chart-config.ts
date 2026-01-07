import { ChartData, ChartOptions } from 'chart.js';

export abstract class DonutChartConfig {
  static setData(labels: Array<string>, dataset: Array<number>): ChartData<'doughnut'> {
    return {
      labels: labels,
      datasets: [
        {data: dataset , backgroundColor:['#0040FF', '#789AFF', '#00CC6D']},
      ],
    };
  }

  static setOptions(): ChartOptions<'doughnut'> {
    return {
      aspectRatio: 1,
      cutout: '85%',
      plugins: {
        tooltip:{
          bodyFont:{
            family:'iranyekan'
          },
          titleFont:{
            family:'iranyekan'
          }
        },
        legend: {
          display: false,
        }
      }
    };
  }
}

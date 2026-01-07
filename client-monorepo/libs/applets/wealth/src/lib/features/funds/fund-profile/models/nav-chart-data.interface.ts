export interface INAVChartData {
  issueNav: INAVChartDateItem;
  cancelNav: INAVChartDateItem;
  statisticalNav: INAVChartDateItem;
}

export interface INAVChartDateItem {
  label: string;
  borderColor: string;
  backgroundColor: string;
  fill: string;
  lineTension: number;
  pointRadius: number;
  pointHoverRadius: number;
}

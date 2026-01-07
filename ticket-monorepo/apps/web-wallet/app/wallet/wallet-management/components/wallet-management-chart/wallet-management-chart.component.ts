import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { DonutChartConfig } from './donut-chart-config';
import { BalanceInformationResponseInterface } from '../../../../api/models/wallet-management/balance.interface';

@Component({
  selector: 'app-wallet-management-chart',
  templateUrl: './wallet-management-chart.component.html',
  styleUrls: ['./wallet-management-chart.component.scss']
})
export class WalletManagementChartComponent implements OnInit {
  public chartData: ChartData<'doughnut'>;
  public options: ChartOptions<'doughnut'>;
  @Input() balanceInformation: BalanceInformationResponseInterface;

  ngOnInit() {
    this.chartData = DonutChartConfig.setData(
      ['نقدی', 'نقدی غیرقابل برداشت', 'کارت هدیه'],
      [
        this.balanceInformation.cashoutableBalance,
        this.balanceInformation.nonCashoutableBalance,
        this.balanceInformation.timeBoundBalance
      ]
    );
    this.options = DonutChartConfig.setOptions();
  }

}

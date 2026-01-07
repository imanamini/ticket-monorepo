import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
} from '@angular/core';
import { WALLET_COLORS } from '../chart-label/colors.enum';
import { NgIf } from '@angular/common';
import { BalanceInformationForPreview } from '../../../data-access/models/balance.interface';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { ChartData, ChartOptions } from 'chart.js';
import { DonutChartConfig } from './donut-chart-config';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'wallet-mng-applet-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, PipesModule, BaseChartDirective],
  standalone: true,
})
export class DonutChartComponent implements OnInit {
  public chartData!: ChartData<'doughnut'>;
  public options!: ChartOptions<'doughnut'>;
  balanceInformation = input.required<BalanceInformationForPreview | null>();

  ngOnInit(): void {
    this.setChantConfig();
  }

  private setChantConfig(): void {
    const chartLabels: string[] = [];
    const chartValues: number[] = [];
    const chartBackgroundColors: string[] = [];
    if (this.balanceInformation()?.cashoutableBalance !== 0) {
      chartLabels.push('نقدی');
      // @ts-ignore
      chartValues.push(this.balanceInformation().cashoutableBalance);
      chartBackgroundColors.push(WALLET_COLORS.BLUE);
    }

    if (this.balanceInformation()?.nonCashoutableBalance !== 0) {
      chartLabels.push('نقدی غیرقابل برداشت');
      // @ts-ignore
      chartValues.push(this.balanceInformation().nonCashoutableBalance);
      chartBackgroundColors.push(WALLET_COLORS.MIDDLE_BLUE);
    }

    if (this.balanceInformation()?.timeBoundBalance !== 0) {
      chartLabels.push('کارت هدیه');
      // @ts-ignore
      chartValues.push(this.balanceInformation().timeBoundBalance);
      chartBackgroundColors.push(WALLET_COLORS.GREEN);
    }

    this.chartData = DonutChartConfig.setData(
      chartLabels,
      chartValues,
      chartBackgroundColors,
    );
    this.options = DonutChartConfig.setOptions();
  }
}

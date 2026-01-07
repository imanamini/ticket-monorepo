import { Component, Inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexGrid,
  ApexPlotOptions,
  ApexResponsive,
  ApexStates,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { ApexDataLabels } from 'ng-apexcharts/lib/model/apex-types';
import { MarketBenefits, MostProfitableInvestmentMarket } from '../../../../../api/clients/models/templates/wealth/wealth-template-data';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormFieldOption, UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { MessageService } from '@client-monorepo/common/utilities';
import { NumberToStringPipe } from '../../../../../ui/ui-pipes/number-to-string.pipe';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiIconDirective } from '../../../../../ui/ui-directive/ui-icon.directive';

@Component({
  selector: 'app-most-profitable-investment-market',
  templateUrl: './most-profitable-investment-market.component.html',
  styleUrls: ['./most-profitable-investment-market.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UiIconDirective,
    UiFormFieldBuilderModule,
    UiButtonComponent,
    NgIf,
    NgApexchartsModule,
    NumberToStringPipe,
  ],
})
export class MostProfitableInvestmentMarketComponent implements OnInit {
  @Input() compareMarketsData: MostProfitableInvestmentMarket;

  @ViewChild('chart') chart: ChartComponent;

  chartOptions: Partial<ChartOptions>;

  inputForm: FormGroup;

  totalYearsList: FormFieldOption[] = [];

  startYearsList: FormFieldOption[] = [];

  endYearsList: FormFieldOption[] = [];

  startYear: number;

  endYear: number;

  investAmount: number;

  mostProfitableMarket: { name: string; benefit: number };

  isInvestAmountAcceptable: boolean;

  protected readonly MARKET_TRANSLATOR = MARKET_TRANSLATOR;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.chartOptions = {
        series: [
          {
            data: [10, 41, 35, 51],
          },
        ],
        chart: {
          height: 300,
          width: '100%',
          type: 'bar',
          toolbar: {
            show: false,
          },
          fontFamily: 'yekan-bakh',
          zoom: {
            enabled: true,
          },
        },
        xaxis: {
          categories: this.buildCategories(),
          labels: {
            show: false,
            style: {
              colors: '#2C3544',
              fontSize: '14px',
              fontWeight: 400,
            },
          },
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            offsetX: 24,
            align: 'left',
            style: {
              colors: '#2C3544',
              fontSize: '14px',
              fontWeight: 400,
            },
          },
          axisBorder: {
            show: true,
          },
        },
        fill: {
          colors: ['#00A34D'],
        },
        tooltip: {
          enabled: false,
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 16,
            borderRadiusApplication: 'end',
            borderRadiusWhenStacked: 'last',
            hideZeroBarsWhenGrouped: false,
            dataLabels: {
              orientation: 'horizontal',
              total: {
                enabled: true,
                offsetX: 0,
                offsetY: 0,
                style: {
                  color: '#fff',
                  fontSize: '12px',
                  fontFamily: 'yekan-bakh',
                  fontWeight: 600,
                },
              },
            },
          },
        },
        dataLabels: {
          enabled: true,
          offsetY: -5,
          offsetX: -8,
          distributed: true,
          style: {
            fontSize: '14px',
            fontWeight: 400,
          },
          formatter: function (val): string {
            const investAmount = Math.trunc(+val);
            if (investAmount > 10000000000) {
              return (+val / 10000000000).toFixed(3) + ' میلیارد تومان';
            }
            if (investAmount > 10000000) {
              return (+val / 10000000).toFixed(2) + ' میلیون تومان';
            }
            return +val / 10000 + ' هزار تومان';
          },
        },
        grid: {
          show: false,
        },
        states: {
          normal: {
            filter: {
              type: 'none',
            },
          },
          hover: {
            filter: {
              type: 'none',
            },
          },
          active: {
            filter: {
              type: 'none',
            },
          },
        },
        responsive: [
          {
            breakpoint: 744,
            options: {
              dataLabels: {
                style: {
                  fontSize: '12px',
                },
                formatter: function (val): string {
                  const investAmount = Math.trunc(+val);
                  if (investAmount > 10000000000) {
                    return (+val / 10000000000).toFixed(3) + ' میلیارد';
                  }
                  if (investAmount > 10000000) {
                    return (+val / 10000000).toFixed(2) + ' میلیون';
                  }
                  return +val / 10000 + ' هزار';
                },
              },
            },
          },
        ],
      };

      this.compareMarketsData.marketBenefits = this.sortMarketsYears(this.compareMarketsData.marketBenefits);

      this.setTotalYearsList();

      this.inputForm = this.fb.group({
        investAmount: 100000000,
        dateBounds: this.fb.group({
          startYear: this.totalYearsList[0].value,
          endYear: this.totalYearsList[this.totalYearsList.length - 1].value,
        }),
      });

      this.calculateProfits(
        this.inputForm.value.investAmount,
        this.totalYearsList[0].value,
        this.totalYearsList[this.totalYearsList.length - 1].value,
      );

      this.updateYearsLists(this.totalYearsList[0].value, this.totalYearsList[this.totalYearsList.length - 1].value);

      this.inputForm.valueChanges.subscribe((changes) => {
        this.updateYearsLists(+changes.dateBounds.startYear, +changes.dateBounds.endYear);

        if (!changes.dateBounds.startYear || !changes.dateBounds.endYear) {
          return;
        }

        if (!this.areDateBoundsOk(changes.dateBounds.startYear, changes.dateBounds.endYear)) {
          this.messageService.showErrorMessage('بازه ی سرمایه گذاری را به درستی انتخاب کنید');
          return;
        }
      });
    }
  }

  sortMarketsYears(markets: MarketBenefits[]): MarketBenefits[] {
    markets.forEach((market) => {
      market.marketData = market.marketData.sort((a, b) => {
        return a.year - b.year;
      });
    });

    return markets;
  }

  areDateBoundsOk(startYear: number, endYear: number): boolean {
    return startYear < endYear;
  }

  buildCategories(): string[] {
    const categories: string[] = [];
    this.compareMarketsData.marketBenefits.forEach((market) => {
      categories.push(MARKET_TRANSLATOR[market.market]);
    });
    return categories;
  }

  setTotalYearsList() {
    this.compareMarketsData.marketBenefits[0].marketData.forEach((marketData) => {
      this.totalYearsList.push({
        title: `${marketData.year}`,
        value: marketData.year,
      });
    });
    this.startYearsList = [...this.totalYearsList];
    this.endYearsList = [...this.totalYearsList];
  }

  calculateProfits(investAmount: number, startYear: number, endYear: number) {
    if (!this.checkInvestAmountAcceptablitiy(investAmount)) {
      return;
    }
    if (investAmount === this.investAmount && startYear === this.startYear && endYear === this.endYear) {
      return;
    }
    this.mostProfitableMarket = { name: '', benefit: 0 };
    this.investAmount = investAmount;
    this.startYear = startYear;
    this.endYear = endYear;
    let coefficient = 1;
    const dataArray = [];
    this.compareMarketsData.marketBenefits.forEach((marketBenefit: MarketBenefits, index: number) => {
      marketBenefit.marketData.forEach((marketData) => {
        if (+marketData.year >= startYear && +marketData.year < endYear) {
          coefficient *= (100 + +marketData.benefit) / 100;
        }
      });
      dataArray[index] = investAmount * coefficient;
      if ((coefficient - 1) * 100 > this.mostProfitableMarket.benefit) {
        this.mostProfitableMarket = {
          name: marketBenefit.market,
          benefit: (coefficient - 1) * 100,
        };
      }
      coefficient = 1;
    });
    this.chartOptions.series = [
      {
        data: dataArray,
      },
    ];
  }

  updateYearsLists(startYear: number, endYear: number) {
    if (!startYear) {
      startYear = +this.totalYearsList[0].value;
    }

    if (!endYear) {
      endYear = +this.totalYearsList[this.totalYearsList.length - 1].value;
    }

    this.startYearsList = this.totalYearsList.filter((year) => {
      return year.value < endYear;
    });
    this.endYearsList = this.totalYearsList.filter((year) => {
      return year.value > startYear;
    });
  }

  submitInput() {
    this.calculateProfits(
      this.inputForm.value['investAmount'],
      this.inputForm.value['dateBounds']['startYear'],
      this.inputForm.value['dateBounds']['endYear'],
    );
  }

  checkInvestAmountAcceptablitiy(investAmount: number): boolean {
    this.isInvestAmountAcceptable = investAmount >= 10000000 && investAmount <= 10000000000;
    return this.isInvestAmountAcceptable;
  }
}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  states: ApexStates;
  responsive: ApexResponsive[];
};

export const MARKET_TRANSLATOR = {
  BOURSE: 'بورس',
  GOLD_COIN: 'سکه',
  BANK: 'بانک',
  ESTATE: 'مسکن',
  DOLLAR: 'دلار',
};

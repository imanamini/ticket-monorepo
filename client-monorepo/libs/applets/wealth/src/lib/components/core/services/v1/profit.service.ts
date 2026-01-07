import { map, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { BaseApiService } from '../base-api.service';
import { API } from '../../../../data-access/constants/api';
import { TServiceResult } from '../../../../data-access/models/base/t-service-resutl';
import { IAnnualProfit, IDetailAnnual } from '../../../../features/wallet/models/annual-profit.interface';
import { getJalaliMonthTitle } from '../../../utils/date';

interface IProfitResponse {
  profitDetail: IProfit[];
  totalProfit: number;
  totlaRecords: number;
}
interface IProfit {
  year: number;
  month: number;
  day: number;
  profit: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProfitService {
  private baseApiService = inject(BaseApiService);

  getProfit(pageSize?: number): Observable<TServiceResult<IAnnualProfit>> {
    const queryPageSize = pageSize ? `?PageSize=${pageSize}` : '';
    return this.baseApiService.get(`${API.profit.base}${queryPageSize}`).pipe(
      map((res: IProfitResponse) => {
        return new TServiceResult<IAnnualProfit>(this.mapProfitDetailToAnnual(res), '', null, true);
      }),
    );
  }

  private mapProfitDetailToAnnual(profitDetails: IProfitResponse): IAnnualProfit {
    const groupedByYear = profitDetails.profitDetail?.reduce<Record<string, IDetailAnnual>>((acc, item) => {
      const yearKey = item.year.toString();

      if (!acc[yearKey]) {
        acc[yearKey] = {
          title: yearKey,
          monthlyPnls: [],
        };
      }

      acc[yearKey].monthlyPnls.push({
        title: getJalaliMonthTitle(item.month),
        amount: item.profit,
      });

      return acc;
    }, {});

    if (!groupedByYear) {
      return {
        annuallyPnls: [],
        hasMoreProfit: false,
        totalProfit: 0,
        totalRecords: 0,
      };
    }

    const annualProfit: IAnnualProfit = {
      annuallyPnls: Object?.values(groupedByYear)
        .map((yearItem) => ({
          ...yearItem,
          monthlyPnls: yearItem.monthlyPnls,
        }))
        .sort((a, b) => Number(b.title) - Number(a.title)),

      hasMoreProfit: profitDetails.totlaRecords > 4,
    };
    return { ...annualProfit, totalProfit: profitDetails.totalProfit, totalRecords: profitDetails.totlaRecords };
  }

  limitAnnualToFourMonths(annual: IAnnualProfit): IAnnualProfit {
    const result: IDetailAnnual[] = [];
    let remaining = 4;

    for (const year of annual.annuallyPnls) {
      if (remaining <= 0) break;

      if (!year.monthlyPnls || year.monthlyPnls.length === 0) {
        continue;
      }

      const take = Math.min(remaining, year.monthlyPnls.length);

      result.push({
        ...year,
        monthlyPnls: year.monthlyPnls.slice(0, take),
      });

      remaining -= take;
    }

    return {
      annuallyPnls: result,
      hasMoreProfit: annual.totalRecords > 4,
      totalProfit: annual.totalProfit,
      totalRecords: annual.totalRecords,
    };
  }
}

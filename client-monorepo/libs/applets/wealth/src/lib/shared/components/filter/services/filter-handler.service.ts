import { Injectable } from '@angular/core';
import { IFilterItem } from '../models';

@Injectable({
  providedIn: 'root',
})
export class FilterHandlerService {
  getFilterItems(page: string): IFilterItem[] {
    if (page.includes('crowd-list')) {
      return this.getCrowdFilters();
    }
    return [];
  }

  private getCrowdFilters(): IFilterItem[] {
    return [
      this.staticFilter(),
      {
        id: 'status',
        title: 'طرح‌های فعال',
        active: false,
        value: 'Active',
      },
      {
        id: 'status',
        title: 'طرح‌های تکمیل شده',
        active: false,
        value: 'Collected',
      },
      // {
      //   id: 'status',
      //   title: طرح‌های تسویه شده,
      //   active: false,
      //   value:'Completed'
      // },
    ];
  }

  private staticFilter(): IFilterItem {
    return {
      id: 'FILTER',
      title: 'فیلترها',
      active: false,
      static: true,
    };
  }

  setActive(filter: IFilterItem) {}
}

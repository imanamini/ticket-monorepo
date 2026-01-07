import { inject, Injectable } from '@angular/core';
import {
  StoreRestrictionFields,
  StoreRestrictionToFilterComponentIdMapper,
  StoreSort,
  StoresSingleFilterModel,
} from '@client-monorepo/stores';
import { ActivatedRoute, Router } from '@angular/router';
import { RestrictionTypes, SearchPayloadInterface } from '@client-monorepo/common/network';
import { AccordionStateService } from '@digipay/ngx-accordion';

@Injectable({
  providedIn: 'root',
})
export class StoreFiltersService {
  router = inject(Router);
  route = inject(ActivatedRoute);
  accordionStateService = inject(AccordionStateService);

  public convertMapperToFilterItems(mapper: Record<any, string>): StoresSingleFilterModel[] {
    return Object.entries(mapper).map(([key, val]) => {
      return {
        id: key,
        label: val,
        isSelected: false,
      } as StoresSingleFilterModel;
    });
  }

  public extractFiltersFromMapperByKeys(mapper: Record<any, string>, keys: string[]): StoresSingleFilterModel[] {
    // Extract only the keys present in the keys array
    return Object.entries(mapper)
      .filter(([key]) => keys.includes(key))
      .map(([key, val]) => {
        return {
          id: key,
          label: val,
          isSelected: false,
        } as StoresSingleFilterModel;
      });
  }

  public extractFiltersFromRouteByKeys(keys: StoreRestrictionFields[]): {
    key: StoreRestrictionFields;
    value: string;
  }[] {
    const queryParams = { ...this.route.snapshot.queryParams };
    const result: { key: StoreRestrictionFields; value: string }[] = [];

    keys.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
        result.push({ key, value: queryParams[key] });
      }
    });

    return result;
  }

  public addFiltersToRoute(params: { [key: string]: string }, handling?: 'merge' | 'preserve'): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...params },
      replaceUrl: true,
      queryParamsHandling: handling ? handling : '',
    });
  }

  public chipsTrailingIconFilterRemover(routeKey: StoreRestrictionFields, singleValueToRemove?: string | undefined): void {
    const queryParams = { ...this.route.snapshot.queryParams };
    if (queryParams[routeKey].split(',').length > 1 && singleValueToRemove) {
      this.singleFilterRemover(routeKey, singleValueToRemove);
    } else {
      this.bulkFilterRemover([routeKey]);
    }
    this.accordionStateService.clearState(StoreRestrictionToFilterComponentIdMapper[routeKey]);
  }

  public singleFilterRemover(key: string, valueToRemove: string): void {
    const queryParams = { ...this.route.snapshot.queryParams };
    if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
      const values = queryParams[key].split(',').filter((val: string) => val !== valueToRemove);
      queryParams[key] = values.join(',');
    }
    this.addFiltersToRoute(queryParams, 'merge');
  }

  public bulkFilterRemover(key: string[]): void {
    const queryParams = { ...this.route.snapshot.queryParams };
    key.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
        delete queryParams[key];
      }
    });
    this.addFiltersToRoute(queryParams);
  }

  public createFilterRequestBody(
    objectForKeys: { [key in StoreRestrictionFields]: string },
    restrictionType: RestrictionTypes,
    operation: string,
  ): SearchPayloadInterface<StoreRestrictionFields> {
    const keys = Object.keys(objectForKeys) as StoreRestrictionFields[];
    const filters = this.extractFiltersFromRouteByKeys(keys);
    const restrictions: any[] = [];
    const orders: any[] = [];
    filters.forEach((filter) => {
      if (filter.key === 'sort') {
        switch (filter.value) {
          case StoreSort.A_Z:
            orders.push({
              field: 'title',
              order: 'asc',
            });
            break;
          case StoreSort.Z_A:
            orders.push({
              field: 'title',
              order: 'desc',
            });
            break;
          case StoreSort.CREATION_DATE:
            orders.push({
              field: 'creationDate',
              order: 'desc',
            });
            orders.push({
              field: 'priority',
              order: 'asc',
            });
            orders.push({
              field: 'trackingCode',
              order: 'desc',
            });
            break;
          case StoreSort.PRIORITY:
            orders.push({
              field: 'priority',
              order: 'asc',
            });
            orders.push({
              field: 'trackingCode',
              order: 'desc',
            });
            break;
          case StoreSort.AUCTION:
            orders.push({
              field: 'auction',
              order: 'desc',
            });
            orders.push({
              field: 'priority',
              order: 'asc',
            });
            orders.push({
              field: 'trackingCode',
              order: 'desc',
            });
            break;
        }
      } else {
        const values: (string | number)[] = filter.value.split(',').map((val) => {
          return isNaN(Number(val)) ? val : Number(val); // Convert to number if it's numeric
        });
        restrictions.push({
          type: restrictionType,
          field: filter.key,
          values: values,
          operation: operation,
        });
      }
    });
    return {
      restrictions: restrictions,
      orders: orders,
    };
  }
}

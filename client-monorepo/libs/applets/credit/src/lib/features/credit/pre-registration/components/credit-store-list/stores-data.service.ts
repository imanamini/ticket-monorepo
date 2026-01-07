import { Injectable } from '@angular/core';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { FILTER_STORES_TYPES } from '../../../data-access/models/credit/store/filter-stores-types';
import { STORE_PROVIDERS } from '../../../data-access/models/credit/store/store-providers';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoresDataService {
  operatorSwitchOptions = [{ id: STORE_PROVIDERS.C_CREDIT }, { id: STORE_PROVIDERS.BNPL }];

  private selectedFilters: { [key: string]: any } = {
    [FILTER_STORES_TYPES.PROVIDER]: [this.operatorSwitchOptions[0].id],
  };

  constructor(private api: CreditApiService) {}

  async getStoresList(page: number, pageSize: number): Promise<any[]> {
    const restriction = Object.entries(this.selectedFilters).map(([filter, values]) => ({
      type: 'collection',
      field: 'paymentMethods',
      operation: 'eq',
      values,
    }));

    try {
      const response = await lastValueFrom(this.api.getCreditStores(restriction, page, pageSize));
      return response.stores || [];
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw error;
    }
  }

  async getStoresListWithoutLogin(page: number, pageSize: number): Promise<any[]> {
    const restriction = Object.entries(this.selectedFilters).map(([filter, values]) => ({
      type: 'collection',
      field: 'paymentMethods',
      operation: 'eq',
      values,
    }));

    try {
      const response = await lastValueFrom(this.api.getCreditStoresWithoutLogin(restriction, page, pageSize));
      return response.stores || [];
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw error;
    }
  }

  setSelectedProvider(providerId: STORE_PROVIDERS) {
    const selectedItem = this.operatorSwitchOptions.find((item) => item.id === providerId);
    if (selectedItem) {
      this.selectedFilters[FILTER_STORES_TYPES.PROVIDER] = [selectedItem.id];
    }
  }
}

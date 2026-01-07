import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseRecommendation } from '../../api/digipay/models/recommendation/base-recommendation';
import { UiCarrier } from '../../ui/models/ui-carrier';
import { StorageInterface } from '@digipay/ng-storage';
import { StorageSchema } from '../models/storage-schema';

@Injectable({
  providedIn: 'root',
})
export class GuestUserService {
  cachedNumbers: BehaviorSubject<string[]> = new BehaviorSubject([]);

  constructor(
    @Inject('StorageInterface')
    public storageService: StorageInterface<StorageSchema>,
  ) {}

  clearAll(): void {
    this.storageService.patch({
      cachedNumbers: [],
    });
  }

  addNumberToCache(cellNumber: string, carrier: UiCarrier): void {
    const numbers = this.getNumbers();

    if (numbers.filter((f) => f.id === cellNumber).length > 0) {
      return;
    }

    const recommendation = {
      id: cellNumber,
      title: cellNumber,
      imageId: carrier.icon.toUpperCase(),
    } as BaseRecommendation;

    numbers.push(recommendation);
    this.storageService.store({
      cachedNumbers: numbers,
    });
  }

  getNumbers(): BaseRecommendation[] {
    const numbers = this.storageService.get('cachedNumbers', '');
    if (!numbers) {
      return [];
    }
    return numbers;
  }
}

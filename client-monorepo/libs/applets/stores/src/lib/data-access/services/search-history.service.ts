import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '@client-monorepo/common/utilities';
import { FrequentServicesIdEnum } from '@client-monorepo/common/service-data';

@Injectable({
  providedIn: 'root',
})
export class SearchHistoryService {
  storageService = inject(StorageService);
  searchHistory = signal<Array<string>>([]);
  hubSearchHistory = signal<Array<FrequentServicesIdEnum>>([]);
  historyLoading = signal<boolean>(true);
  hubSearchLoading = signal(true);

  private getHistory(): Observable<Array<string>> {
    return new Observable((subscriber) => {
      const history = this.storageService.getSearchHistory();
      subscriber.next(history);
      subscriber.complete();
    });
  }

  refreshSearchHistory(): void {
    this.historyLoading.set(true);
    this.getHistory().subscribe({
      next: (result) => {
        this.searchHistory.set(result);
        this.historyLoading.set(false);
      },
    });
  }

  pushToSearchHistory(history: string) {
    this.getHistory().subscribe({
      next: (result) => {
        result.unshift(history);
        result = [...new Set(result)];
        this.storageService.setSearchHistory(result.slice(0, 5));
        this.refreshSearchHistory();
      },
    });
  }

  removeSingleHistory(history: string) {
    this.getHistory().subscribe({
      next: (result) => {
        const index = result.indexOf(history);
        if (index >= 0) {
          result.splice(index, 1);
        }
        this.storageService.setSearchHistory(result.slice(0, 5));
        this.refreshSearchHistory();
      },
    });
  }

  clearHistory(): void {
    this.storageService.setSearchHistory([]);
    this.refreshSearchHistory();
  }

  private getHubSearchHistory(): Observable<Array<FrequentServicesIdEnum>> {
    return new Observable((subscriber) => {
      const history = this.storageService.getHubSearchHistory();
      subscriber.next(history);
      subscriber.complete();
    });
  }

  refreshHubSearchHistory(): void {
    this.hubSearchLoading.set(true);
    this.getHubSearchHistory().subscribe({
      next: (result) => {
        this.hubSearchHistory.set(result);
        this.hubSearchLoading.set(false);
      },
    });
  }

  pushToHubSearchHistory(history: FrequentServicesIdEnum) {
    this.getHubSearchHistory().subscribe({
      next: (result) => {
        result.unshift(history);
        result = [...new Set(result)];
        this.storageService.setHubSearchHistory(result.slice(0, 5));
        this.refreshHubSearchHistory();
      },
    });
  }

  clearHubSearchHistory(): void {
    this.storageService.setHubSearchHistory([]);
    this.refreshHubSearchHistory();
  }
}

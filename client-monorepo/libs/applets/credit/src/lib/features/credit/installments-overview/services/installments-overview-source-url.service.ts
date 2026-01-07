import { Injectable, signal } from '@angular/core';

@Injectable()
export class InstallmentsOverviewSourceUrlService {
  #sourceUrl = signal<string | null>(null);

  get sourceUrl() {
    return this.#sourceUrl.asReadonly();
  }

  setSourceUrl(sourceUrl: string) {
    this.#sourceUrl.set(sourceUrl);
  }
}

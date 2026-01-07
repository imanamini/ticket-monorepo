import { Inject, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, lastValueFrom, of, tap, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DisasterLevelService {
  http = inject(HttpClient);
  private _disasterLevel = signal<number>(0);
  private hideAssetsLevels = [1, 2];
  private hideInstallmentsLevels = [2];

  constructor(@Inject('APP_ENV') private environment: { [key: string]: string }) {}

  async checkDisasterLevelHeader(): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.http.options(this.environment['base_url'] + '/dpx/light-mode?t=' + Date.now(), { observe: 'response' }).pipe(
          timeout(3000),
          tap((response) => {
            const disasterLevelHeader = response.headers.get('disaster-level');
            if (disasterLevelHeader !== null) {
              const disasterLevel = Number(disasterLevelHeader);
              if (disasterLevel !== this.getCurrentDisasterLevel()) {
                this.updateDisasterLevel(disasterLevel);
              }
            }
          }),
          catchError((error) => {
            console.error('Disaster level check failed:', error);
            return of(null);
          }),
        ),
      );
    } catch (error) {
      // Silently handle any errors that slip through
      console.error('Unexpected error in disaster level check:', error);
    }
  }

  getCurrentDisasterLevel(): number {
    return this._disasterLevel();
  }

  getCurrentDisasterStatus(): boolean {
    return this._disasterLevel() > 0;
  }

  updateDisasterLevel(level: number): void {
    this._disasterLevel.set(level);
  }

  hideAssets(): boolean {
    return this.hideAssetsLevels.includes(this._disasterLevel());
  }

  hideInstallments(): boolean {
    return this.hideInstallmentsLevels.includes(this._disasterLevel());
  }
}

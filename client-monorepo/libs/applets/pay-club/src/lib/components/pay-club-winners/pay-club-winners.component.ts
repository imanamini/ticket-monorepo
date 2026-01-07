import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ClubApiService } from '../../data-access/services/club-api.service';
import { SearchPrizesResponse, SearchResult } from '../../data-access/models/search-prizes-response';
import { DrawStatus } from '../../data-access/models/reward-status';
import { RewardType } from '../../data-access/models/reward-type';
import { getDateRangeFromMonths } from '../../data-access/utils/date';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pay-club-applet-pay-club-winners',
  standalone: true,
  imports: [CommonModule, PipesModule],
  templateUrl: './pay-club-winners.component.html',
  styleUrls: ['./pay-club-winners.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayClubWinnersComponent implements OnInit {
  currentTime = input<number>(0);
  winners = signal<SearchResult[]>([]);
  hasWinner = signal(false);
  clubApiService = inject(ClubApiService);
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const periodDate = getDateRangeFromMonths(1, this.currentTime() - 1000);
    this.setWinnersList(periodDate).subscribe();
  }

  setWinnersList(date: Record<string, any>) {
    return this.getWinnerApi(date).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(() => {
        return EMPTY;
      }),
      tap((res) => {
        if (res?.searchResultList?.length > 0) {
          this.hasWinner.set(true);
          this.winners.set(res?.searchResultList);
        }
      }),
    );
  }

  getWinnerApi(date: Record<string, any>): Observable<SearchPrizesResponse> {
    const request = {
      status: DrawStatus.WIN,
      type: RewardType.LOTTERY_TICKET,
      startDate: date['startDate'],
      endDate: date['endDate'],
    };
    return this.clubApiService.searchPrizesApi(request);
  }
}

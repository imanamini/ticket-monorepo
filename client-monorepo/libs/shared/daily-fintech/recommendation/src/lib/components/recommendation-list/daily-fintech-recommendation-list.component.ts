import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RECOMMENDATION_TYPES, RecommendationApiService, RecommendationData } from '@client-monorepo/daily-fintech/recommendation';
import { DailyFintechRecommendationItemComponent } from '../recommendation-item/daily-fintech-recommendation-item.component';
import { DailyFintechRecommendationBottomSheetComponent } from '../recommendation-bottom-sheet/daily-fintech-recommendation-bottom-sheet.component';
import { CellNumberItemBottomSheetService } from '@client-monorepo/common/cellular-operator';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'daily-fintech-recommendation-list',
  standalone: true,
  imports: [CommonModule, DailyFintechRecommendationItemComponent],
  templateUrl: './daily-fintech-recommendation-list.component.html',
  styleUrls: ['./daily-fintech-recommendation-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyFintechRecommendationListComponent implements OnInit {
  // Injects
  private bottomSheetService = inject(NgxBottomSheetService);
  private recommendationApiService = inject(RecommendationApiService);
  private itemBottomSheetService = inject(CellNumberItemBottomSheetService);
  private destroyRef = inject(DestroyRef);

  // Inputs
  title = input('');
  billType = input('');
  hasSpinner = input<string[]>(['']);
  itemType = input<RECOMMENDATION_TYPES>({} as RECOMMENDATION_TYPES);

  //Signals
  items = signal<RecommendationData[]>([]);

  // Output
  handleClick = output<RecommendationData>();

  ngOnInit(): void {
    this.getRecommendationData();
    this.itemBottomSheetService
      .onReloadRequest()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((reload) => {
        if (reload) {
          this.items.set([]);
          this.getRecommendationData();
        }
      });
  }

  private getRecommendationData() {
    if (this.billType()) {
      this.getRecommendationsWithBillType(this.billType());
    } else {
      this.getRecommendations();
    }
  }

  handleItemClick(number: RecommendationData) {
    this.handleClick.emit(number);
  }

  itemOnHold(event: Event, number: RecommendationData, itemType: RECOMMENDATION_TYPES) {
    event.stopPropagation();
    this.bottomSheetService.openBottomSheet(DailyFintechRecommendationBottomSheetComponent, {
      cellNumber: number,
      type: itemType,
    });
  }

  /**
   * Get recommendation list from API
   */
  getRecommendations(): void {
    this.recommendationApiService
      .getRecommendations(this.itemType())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.items.set(data.recommendations);
      });
  }

  getRecommendationsWithBillType(billType: string): void {
    this.recommendationApiService
      .getRecommendationsBasedOnBillType(this.itemType(), billType)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.items.set(data.recommendations);
      });
  }
}

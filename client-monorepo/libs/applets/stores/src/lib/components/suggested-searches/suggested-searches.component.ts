import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { rangeCreator } from '@client-monorepo/common/utilities';
import { NgxChipComponent } from '@digipay/ngx-chip';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { StoresService } from '@client-monorepo/stores';

@Component({
  selector: 'stores-applet-suggested-searches',
  standalone: true,
  imports: [CommonModule, TitleSummaryComponent, NgxChipComponent, NgxBadgeModule],
  templateUrl: './suggested-searches.component.html',
  styleUrl: './suggested-searches.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestedSearchesComponent implements OnInit {
  storesService = inject(StoresService);
  suggestionsLoading = signal<boolean>(true);
  searchSuggestions = signal<Array<string>>([]);
  itemClicked = output<string>();

  rangeCreator = rangeCreator;

  ngOnInit() {
    this.getSuggestedSearches();
  }

  getSuggestedSearches(): void {
    this.suggestionsLoading.set(true);

    this.storesService.getSuggestedSearches().subscribe({
      next: (result) => {
        this.searchSuggestions.set(result);
        this.suggestionsLoading.set(false);
      },
    });
  }

  itemClickedHandle(itemText: string): void {
    this.itemClicked.emit(itemText);
  }
}

import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalScrollComponent } from '@client-monorepo/common/ui-components';
import { MessageFilterModel } from '../../data-access/models/message-filter.model';
import { NgxChipComponent } from '@digipay/ngx-chip';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { InboxCategoriesFilterComponent } from '../inbox-categories-filter/inbox-categories-filter.component';
import { AppMessagingCategoryEnum } from '@client-monorepo/shared/common';

@Component({
  selector: 'inbox-applet-inbox-filters',
  standalone: true,
  imports: [CommonModule, HorizontalScrollComponent, NgxChipComponent],
  templateUrl: './inbox-filters.component.html',
  styleUrl: './inbox-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxFiltersComponent {
  // services
  private readonly ngxBottomSheetService = inject(NgxBottomSheetService);

  //output
  filterClicked = output<number[]>();

  // signals
  messageFilterItems = signal<MessageFilterModel[]>([
    {
      order: 0,
      id: 'special-offer',
      value: AppMessagingCategoryEnum.SPECIAL_OFFER,
      label: 'پیشنهاد ویژه',
      clickDisabled: true,
      pressed: false,
      icon: 'discount',
    },
    {
      order: 1,
      id: 'activities',
      value: AppMessagingCategoryEnum.ACTIVITIES,
      label: 'فعالیت‌ها',
      clickDisabled: true,
      pressed: false,
      icon: 'risk',
    },
    {
      order: 2,
      id: 'notifications',
      value: AppMessagingCategoryEnum.NOTIFICATIONS,
      label: 'اطلاع‌رسانی‌ها',
      clickDisabled: true,
      pressed: false,
      icon: 'notification',
    },
    {
      order: 3,
      id: 'more',
      label: 'بیشتر',
      clickDisabled: false,
      pressed: false,
      icon: 'filter',
    },
  ]);
  selectedCategories = signal<number[]>([]);

  // methods
  private emitCombinedFilters(): void {
    const bottomSheetSelected = this.selectedCategories();
    const pressedFilters = this.messageFilterItems()
      .filter((f) => f.pressed && f.id !== 'more')
      .map((f) => f.value as number);
    const combined = [...pressedFilters, ...bottomSheetSelected];
    this.filterClicked.emit(combined);
  }

  onFilterClicked(filter: MessageFilterModel): void {
    if (filter.id === 'more') {
      this.ngxBottomSheetService.openBottomSheet(
        InboxCategoriesFilterComponent,
        {
          selected: this.selectedCategories(),
        },
        { noPadding: true },
      );

      const onCloseBottomSheet = this.ngxBottomSheetService.onClose.subscribe(() => {
        onCloseBottomSheet.unsubscribe();
        const result = this.ngxBottomSheetService.outputData();
        if (result && result.categories) {
          this.messageFilterItems.update((items) => {
            const copy = [...items];
            // change and update element 3 (more categories)
            copy[3] = {
              ...copy[3],
              clickDisabled: result.categories.length > 0,
              pressed: result.categories.length > 0,
            };
            return copy;
          });
          this.selectedCategories.set(result.categories);
          this.emitCombinedFilters();
        }
      });

      return;
    }

    this.messageFilterItems.update((items) => items.map((f) => (f.id === filter.id ? { ...f, pressed: !f.pressed } : f)));

    this.emitCombinedFilters();
  }
}

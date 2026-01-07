import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CheckboxFilterModel } from '../../data-access/models/checkbox-filter.model';
import { AppMessagingCategoryEnum, AppMessagingCategoryTitles } from '@client-monorepo/shared/common';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'inbox-applet-inbox-categories-filter',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, NgxCheckboxComponent, NgxIcon],
  templateUrl: './inbox-categories-filter.component.html',
  styleUrl: './inbox-categories-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxCategoriesFilterComponent implements OnInit {
  //services
  private readonly ngxBottomSheetService = inject(NgxBottomSheetService);

  //signals
  filterList = signal<AppMessagingCategoryEnum[]>([]);
  checkBoxList = signal<CheckboxFilterModel[]>([]);

  ngOnInit() {
    const bottomSheetData: number[] = this.ngxBottomSheetService.data()?.selected ?? [];
    this.filterList.set(bottomSheetData);
    this.checkBoxList.set(this.buildList());
  }

  private buildList(): CheckboxFilterModel[] {
    const selected = this.filterList() || [];
    return Object.keys(AppMessagingCategoryTitles).map((key) => {
      const id = Number(key) as AppMessagingCategoryEnum;
      return {
        id,
        title: AppMessagingCategoryTitles[id]!,
        checked: selected.includes(id),
      };
    });
  }

  handleCheckChange(id: number, checked: boolean): void {
    if (checked) {
      this.filterList.update((list) => [...list, id]);
    } else {
      this.filterList.update((list) => list.filter((i) => i !== id));
    }

    this.checkBoxList.update((list) => list.map((item) => (item.id === id ? { ...item, checked } : item)));
  }

  closeBottomSheet(): void {
    this.ngxBottomSheetService.closeBottomSheet();
  }
  submitFilter(): void {
    this.ngxBottomSheetService.outputData.set({
      categories: this.filterList(),
    });
    this.closeBottomSheet();
  }
}

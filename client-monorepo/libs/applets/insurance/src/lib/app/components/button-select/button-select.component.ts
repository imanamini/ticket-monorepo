import { Component, effect, input, output, signal, WritableSignal } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgClass } from '@angular/common';

import { ButtonSelectListItemsComponent } from '../button-select-list-items/button-select-list-items.component';
import { ButtonSelectListItemsModel } from '../../data-access/models/button-select-list-items.model';
import { ButtonSelectListItemModel } from '../../data-access/models/button-select-list-item.model';
import { ButtonSelectItemTypeEnum } from '../../data-access/enums/button-select-item-type.enum';

@Component({
  selector: 'button-select',
  standalone: true,
  imports: [
    NgxIcon,
    NgClass
  ],
  templateUrl: './button-select.component.html',
  styleUrl: './button-select.component.scss'
})
export class ButtonSelectComponent {

  constructor(private bottomSheet: MatBottomSheet) {
    effect(() => {
      if (!this.selectedItem() || this.selectedItem().length === 0) {
        this.displayTitle.set(this.title());
        return;
      }
      this.displayTitle.set((this.selectedItem().length > 1 ? ` دیگر${this.selectedItem().length - 1} + و + ${this.selectedItem()[0].title}`
        : this.selectedItem()[0].title));
    }, {allowSignalWrites: true});
  }

  type = input<string>();
  itemType = input<ButtonSelectItemTypeEnum>(ButtonSelectItemTypeEnum.SIMPLE);
  listItemTitle = input<string>();
  buttonText = input<string>();
  searchInputPlaceHolder = input<string>();
  searchable = input<boolean>(false);
  selectedItem = input<ButtonSelectListItemModel[]>();
  items = input.required<ButtonSelectListItemModel[]>();
  title = input.required<string>();
  isDivider = input<boolean>();
  iconName = input<string>();
  itemSelected = output<ButtonSelectListItemModel[]>();

  protected readonly Array = Array;

  displayTitle: WritableSignal<string> = signal('');

  handleClicked(): void {
    this.bottomSheet.open<ButtonSelectListItemsComponent, ButtonSelectListItemsModel>(ButtonSelectListItemsComponent, {
      data: {
        title: this.listItemTitle(),
        type: this.itemType(),
        searchable: this.searchable(),
        searchInputPlaceHolder: this.searchInputPlaceHolder(),
        buttonText: this.buttonText(),
        isDivider: this.isDivider(),
        items: this.items()
      }
    }).afterDismissed().subscribe({
      next: (selected: ButtonSelectListItemModel[]) => {
        if (!selected) {
          return;
        }
        this.itemSelected.emit(selected.filter(i => i.selected));
      }
    });
  }

  handleClearClicked(e: Event): void {
    e.stopPropagation();
    this.itemSelected.emit([]);
  }
}

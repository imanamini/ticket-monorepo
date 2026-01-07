import { Component, inject, Inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxRadioButtonComponent } from '@digipay/ngx-radio-button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgClass } from '@angular/common';

import { ButtonSelectListItemsModel } from '../../data-access/models/button-select-list-items.model';
import { ButtonSelectListItemModel } from '../../data-access/models/button-select-list-item.model';
import { ActionButtonsComponent } from '../action-buttons/action-buttons.component';
import { ButtonSelectItemTypeEnum } from '../../data-access/enums/button-select-item-type.enum';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'button-select-list-items',
  standalone: true,
  imports: [
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    NgxIcon,
    NgxCheckboxComponent,
    NgxRadioButtonComponent,
    NgClass,
    ActionButtonsComponent
  ],
  templateUrl: './button-select-list-items.component.html',
  styleUrl: './button-select-list-items.component.scss'
})
export class ButtonSelectListItemsComponent extends BaseComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef) {
    super();
  }

  public data: ButtonSelectListItemsModel = inject(MAT_BOTTOM_SHEET_DATA);
  protected readonly ButtonSelectItemTypeEnum = ButtonSelectItemTypeEnum;
  searchFormControl: FormControl = new FormControl('');
  items: WritableSignal<ButtonSelectListItemModel[]> = signal([]);

  ngOnInit(): void {
    this.items.set(structuredClone<ButtonSelectListItemModel[]>(this.data.items));
    this.subscribeOnFormChange();
  }

  subscribeOnFormChange(): void {
    super.addSubscription(this.searchFormControl.valueChanges.subscribe({
      next: value => {
        this.items.set(structuredClone<ButtonSelectListItemModel[]>(this.data.items.filter(i => i.title.includes(value))));
      }
    }));
  }

  handleItemSelected(e: ButtonSelectListItemModel): void {
    e.selected = !e.selected;
    if (this.data.type !== ButtonSelectItemTypeEnum.CHECK_BOX) {
      this.items.set(this.items().map(s => {
        if (s.value === e.value) {
          return s;
        }
        return {
          ...s,
          selected: false
        };
      }));
      this.bottomSheetRef.dismiss(this.items());
    }
  }

  handleButtonClicked(): void {
    this.bottomSheetRef.dismiss(this.items());
  }
}

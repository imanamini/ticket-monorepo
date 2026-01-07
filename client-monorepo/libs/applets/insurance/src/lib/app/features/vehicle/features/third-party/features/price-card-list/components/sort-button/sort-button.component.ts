import { Component, EventEmitter, input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { InsIconComponent } from '../../../../../../components/ins-icon/ins-icon.component';
import { IconEnum } from '../../../../../../../../data-access/enums/icon.enum';
import { SORT_METHOD_TRANSLATIONS, SortMethod } from '../../data-access/enums/SortMethod';

@Component({
  selector: 'sort-button',
  standalone: true,
  imports: [
    InsIconComponent,
    NgClass
  ],
  templateUrl: './sort-button.component.html',
  styleUrl: './sort-button.component.scss'
})
export class SortButtonComponent {
  selectedSortMethod = input<SortMethod>();

  @Output() sortButtonClicked = new EventEmitter();

  @Output() deleteSortClicked = new EventEmitter();

  protected readonly SORT_METHOD_TRANSLATIONS = SORT_METHOD_TRANSLATIONS;

  protected readonly IconEnum = IconEnum;

  constructor() {
  }

  sortClicked(): void {
    this.sortButtonClicked.emit();
  }

  deleteSelectedSortMethod($event): void {
    $event.stopPropagation();
    this.deleteSortClicked.emit();
  }

}

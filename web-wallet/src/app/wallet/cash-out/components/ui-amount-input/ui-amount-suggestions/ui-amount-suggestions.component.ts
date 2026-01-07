import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";
import {UserInterfaceModule} from "../../../../../user-interface/user-interface.module";

@Component({
  selector: 'ui-amount-suggestions',
  templateUrl: './ui-amount-suggestions.component.html',
  styleUrls: ['./ui-amount-suggestions.component.scss'],
  imports: [
    NgForOf,
    NgClass,
    UserInterfaceModule
  ],
  standalone: true
})
export class UiAmountSuggestionsComponent implements OnInit {

  @Input()
  suggestions: string[] | number[] = [];

  @Input()
  selectedValue = '';

  @Output()
  selected = new EventEmitter<string | number>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onClick(amount: string): void {
    this.selectedValue = amount;
    this.selected.emit(amount);
  }

}

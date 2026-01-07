import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiCurrencyComponent } from '../../ui-formatters/ui-currency/currency.component';
import { NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-ui-amount-suggestions',
  templateUrl: './ui-amount-suggestions.component.html',
  styleUrls: ['./ui-amount-suggestions.component.scss'],
  standalone: true,
  imports: [NgFor, NgClass, UiCurrencyComponent],
})
export class UiAmountSuggestionsComponent {
  @Input()
  suggestions: string[] | number[] = [];

  @Input()
  selectedValue = '';

  @Output()
  selected = new EventEmitter<string | number>();

  onClick(amount: string): void {
    this.selectedValue = amount;
    this.selected.emit(amount);
  }
}

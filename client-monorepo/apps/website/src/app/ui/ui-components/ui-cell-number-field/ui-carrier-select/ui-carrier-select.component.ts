import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiCarrier } from '../../../models/ui-carrier';
import { NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-ui-carrier-select',
  templateUrl: './ui-carrier-select.component.html',
  styleUrls: ['./ui-carrier-select.component.scss'],
  standalone: true,
  imports: [NgFor, NgClass],
})
export class UiCarrierSelectComponent {
  @Input()
  selected: UiCarrier = null;

  @Input()
  mobileFriendly = false;

  @Input()
  carriers: UiCarrier[] = [];

  @Output()
  carrierSelect = new EventEmitter<UiCarrier>();

  onCLick(carrier: UiCarrier): void {
    this.carrierSelect.emit(carrier);
  }
}

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { StyledSwitchOption } from '../../../models/switch-option.model';
import { UiCarrier } from '../../../models/ui-carrier';
import { UiFormHintComponent } from '../../ui-hint-text/ui-form-hint/ui-form-hint.component';
import { UiCarrierSelectComponent } from '../ui-carrier-select/ui-carrier-select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from '../../form-field-builder/form-field/form-field.component';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-ui-cell-number-field',
  templateUrl: './ui-cell-number-field.component.html',
  styleUrls: ['./ui-cell-number-field.component.scss'],
  standalone: true,
  imports: [NgClass, FormFieldComponent, ReactiveFormsModule, FormsModule, NgIf, UiCarrierSelectComponent, UiFormHintComponent],
})
export class UiCellNumberFieldComponent implements OnInit, OnChanges {
  @Input()
  mobileFriendly = false;

  @Input()
  showMnpNotice = true;

  @Input()
  selectCarrier = true;

  @Input()
  carrierOptions: UiCarrier[] = [];

  @Input()
  selectedCarrier: UiCarrier = null;

  @Input()
  cellNumber = '';

  @Output()
  cellNumberChange = new EventEmitter();

  @Output()
  carrierChanged = new EventEmitter<UiCarrier>();

  switchOptions: StyledSwitchOption[] = [];

  selectedSwitchOption: StyledSwitchOption = null;

  @Input()
  errorMessage: string = null;

  ngOnInit(): void {
    this.makeSwitchOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options) {
      this.makeSwitchOptions();
    }
    if (changes.selectedCarrier) {
      this.makeSwitchOptions();
    }
  }

  cellNumberChanged($event): void {
    this.cellNumberChange.emit($event);
  }

  onCarrierChange(switchOption: StyledSwitchOption): void {
    const option = this.carrierOptions.filter((o) => o.value === switchOption.value)[0];
    this.carrierChanged.emit(option);
    this.selectedSwitchOption = switchOption;
  }

  carrierSelectChanged(carrier: UiCarrier): void {
    this.selectedCarrier = carrier;
    this.carrierChanged.emit(carrier);
  }

  private makeSwitchOptions(): void {
    this.switchOptions = this.carrierOptions.map((option) => {
      return {
        value: option.value,
        backgroundColor: '#f0f5ff',
        borderColor: '#0040ff',
        label: option.label,
      };
    });

    if (this.switchOptions.length > 0 && this.selectedCarrier) {
      this.selectedSwitchOption = this.switchOptions.filter((o) => o.value === this.selectedCarrier.value)[0];
    }
  }
}

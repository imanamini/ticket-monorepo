import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RadioButtonInterface } from './radio-button.interface';
import { UntypedFormGroup } from '@angular/forms';
import { UiCheckBoxComponent } from '../ui-check-box/ui-check-box.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'multi-select-radio-button',
  templateUrl: './multi-select-radio-button.component.html',
  styleUrls: ['./multi-select-radio-button.component.scss'],
  standalone: true,
  imports: [NgFor, UiCheckBoxComponent]
})
export class MultiSelectRadioButtonComponent implements OnInit {

  @Input()
  radioButtonGroup: Array<RadioButtonInterface>;

  @Input()
  radio = false;

  @Output()
  onClick: EventEmitter<Array<RadioButtonInterface>> = new EventEmitter<Array<RadioButtonInterface>>();

  form: UntypedFormGroup;

  radioButtonArray = [];

  ngOnInit(): void {
    this.createFormGroup();
  }

  clickOnRadioButton(radioButton: RadioButtonInterface): void {

    if (this.radio) {
      for (const item of this.radioButtonArray) {
        if (item.value === radioButton.value) {
          item.checked = !item.checked;
        }
      }
    } else {
      for (const item of this.radioButtonArray) {
        item.checked = item.value === radioButton.value;
      }
    }
    this.radioButtonGroup = this.radioButtonArray;
    this.onClick.emit(this.radioButtonArray);
  }

  private createFormGroup(): void {
    this.radioButtonArray = this.radioButtonGroup.map(radioButton => {
      return {...radioButton, checked: false};
    });
  }
}

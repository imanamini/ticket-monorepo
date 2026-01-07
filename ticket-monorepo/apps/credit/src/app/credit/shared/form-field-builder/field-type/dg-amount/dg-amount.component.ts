import { Component, OnInit } from '@angular/core';
import { BaseFieldType } from '../../base-field-type/base-field-type';

@Component({
  selector: 'app-dg-amount',
  templateUrl: './dg-amount.component.html',
  styleUrls: ['./dg-amount.component.scss']
})
export class DgAmountComponent extends BaseFieldType {

  isFocused: boolean = false;

  clean($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    $event.stopImmediatePropagation();
    if (this.form) {
      this.form.controls[this.formControlName].setValue(null);
    }
  }

  amountKeyDown($event: any): void {
    const code = $event.key.charCodeAt(0);
    const isZero = [48, 1632, 1776].indexOf(code) >= 0;
    if (isZero && $event.target.value.length === 0) {
      $event.preventDefault();
      return;
    }
  }
}

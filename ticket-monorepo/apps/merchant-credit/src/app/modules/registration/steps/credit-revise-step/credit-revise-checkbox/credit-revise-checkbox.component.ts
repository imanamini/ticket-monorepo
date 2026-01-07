import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DocumentItem } from '../../../../../api/models/registration/pages/limitation/limitation.model';

@Component({
  selector: 'app-credit-revise-checkbox',
  templateUrl: './credit-revise-checkbox.component.html',
  styleUrls: ['./credit-revise-checkbox.component.scss']
})
export class CreditReviseCheckboxComponent implements OnInit {

  @Input() document?: DocumentItem;

  @Input() disabled: boolean = false;

  @Input() checked: boolean = false;

  @Input() isNumber: boolean = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit(): void {
  }

  handleChange() {
    this.checkedChange.emit(this.checked);
  }
}
